import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";
import { errorResponse } from "@/lib/api-helpers";

const MAX_TRANSCRIPT_CHARS = 30000;

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json(
        { error: "transcript は必須です" },
        { status: 400 }
      );
    }

    const truncated = transcript.slice(0, MAX_TRANSCRIPT_CHARS);

    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system: `あなたは会議の文字起こしから議事録を作成するアシスタントです。
以下のMarkdown構成で日本語の議事録を作成してください。書かれていない内容は補完せず、文字起こしにある情報だけを使ってください。

## 会議サマリー
## 決定事項
## アクションアイテム（担当者・期限が読み取れる場合は明記）
## 保留・要確認事項`,
      messages: [
        {
          role: "user",
          content: `# 文字起こしテキスト\n${truncated}`,
        },
      ],
    });

    const minutes = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ minutes });
  } catch (err) {
    return errorResponse(err);
  }
}
