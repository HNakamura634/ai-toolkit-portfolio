"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

const SAMPLE_DOCUMENT = `# 経費精算ルール
- 交通費は実費精算、領収書またはICカード履歴の提出が必要です。
- 会食費は1人あたり5,000円まで。上限を超える場合は事前に上長の承認が必要です。
- 精算申請は利用月の翌月10日までに経理システムから提出してください。
- 領収書の紛失時は「支払証明書」を発行し、上長のサインをもらって代替提出できます。

# 有給休暇ルール
- 有給休暇は入社半年後に10日付与されます。
- 取得は前日の17時までに勤怠システムから申請してください。
- 半日単位・時間単位での取得も可能です。`;

export default function FaqBotPage() {
  const [document, setDocument] = useState(SAMPLE_DOCUMENT);
  const [question, setQuestion] = useState("会食費の上限はいくらですか？");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk() {
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const res = await fetch("/api/faq-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document, question }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "エラーが発生しました");
      setAnswer(data.answer);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell
      title="社内FAQチャットボット"
      description="社内マニュアルやルールを貼り付けると、その内容だけを根拠に質問に答えます。バックオフィスの問い合わせ対応を自動化するデモです。"
    >
      <div className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            社内資料（マニュアル・規程など）
          </label>
          <textarea
            className="h-48 w-full rounded-lg border border-neutral-300 bg-white p-3 text-sm"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            質問
          </label>
          <input
            className="w-full rounded-lg border border-neutral-300 bg-white p-3 text-sm"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <button
          onClick={handleAsk}
          disabled={loading || !document || !question}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {loading ? "回答生成中..." : "質問する"}
        </button>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {answer && (
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <p className="mb-1 text-xs font-medium text-neutral-500">回答</p>
            <p className="whitespace-pre-wrap text-sm">{answer}</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
