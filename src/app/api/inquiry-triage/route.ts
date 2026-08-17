import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";
import { errorResponse } from "@/lib/api-helpers";

const TRIAGE_TOOL = {
  name: "submit_triage",
  description: "問い合わせの分類結果と返信下書きを提出する",
  input_schema: {
    type: "object" as const,
    properties: {
      category: {
        type: "string",
        description:
          "問い合わせの種類（例: 注文について / 返品・交換 / 不具合報告 / 料金について / その他）",
      },
      urgency: { type: "string", enum: ["高", "中", "低"] },
      summary: { type: "string", description: "問い合わせ内容の1行要約" },
      draft_reply: {
        type: "string",
        description: "顧客にそのまま送れる丁寧な返信文の下書き",
      },
    },
    required: ["category", "urgency", "summary", "draft_reply"],
  },
};

export async function POST(req: NextRequest) {
  try {
    const { inquiry } = await req.json();

    if (!inquiry) {
      return NextResponse.json(
        { error: "inquiry は必須です" },
        { status: 400 }
      );
    }

    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system:
        "あなたはカスタマーサポートの一次対応を支援するアシスタントです。顧客からの問い合わせ文を分類し、返信の下書きを作成します。submit_triage ツールを使って結果を提出してください。",
      tools: [TRIAGE_TOOL],
      tool_choice: { type: "tool", name: "submit_triage" },
      messages: [{ role: "user", content: inquiry }],
    });

    const toolUse = message.content.find(
      (block) => block.type === "tool_use"
    );
    if (!toolUse || toolUse.type !== "tool_use") {
      throw new Error("分類結果の取得に失敗しました");
    }

    return NextResponse.json(toolUse.input);
  } catch (err) {
    return errorResponse(err);
  }
}
