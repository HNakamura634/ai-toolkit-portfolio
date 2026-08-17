import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";
import { errorResponse } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  try {
    const { document, question } = await req.json();

    if (!document || !question) {
      return NextResponse.json(
        { error: "document と question は必須です" },
        { status: 400 }
      );
    }

    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: `あなたは社内ドキュメントに基づいて質問に答えるFAQボットです。
以下の社内資料の内容だけを根拠に回答してください。資料に書かれていないことは「資料に記載がありません」と正直に答え、推測で答えないでください。
回答は簡潔に、必要なら箇条書きを使ってください。

# 社内資料
${document}`,
      messages: [{ role: "user", content: question }],
    });

    const answer = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ answer });
  } catch (err) {
    return errorResponse(err);
  }
}
