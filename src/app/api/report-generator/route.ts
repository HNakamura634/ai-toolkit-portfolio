import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";
import { errorResponse } from "@/lib/api-helpers";

const MAX_CSV_CHARS = 20000;

export async function POST(req: NextRequest) {
  try {
    const { csv, instructions } = await req.json();

    if (!csv) {
      return NextResponse.json({ error: "csv は必須です" }, { status: 400 });
    }

    const truncated = csv.slice(0, MAX_CSV_CHARS);

    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system: `あなたは業務データを分析してレポートを作成するアシスタントです。
与えられたCSVデータをもとに、Markdown形式で日本語のレポートを作成してください。
構成の目安: 「サマリー」「主要な数値」「気づき・傾向」「次のアクション案」。
数値の見落としや計算間違いがないよう、データに書かれている値だけを根拠にしてください。`,
      messages: [
        {
          role: "user",
          content: `# CSVデータ\n${truncated}\n\n# レポート作成の指示\n${
            instructions || "特になし。データから読み取れる傾向を中心にまとめてください。"
          }`,
        },
      ],
    });

    const report = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ report });
  } catch (err) {
    return errorResponse(err);
  }
}
