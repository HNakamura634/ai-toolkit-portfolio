"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

const SAMPLE_INQUIRY = `先週注文した商品がまだ届きません。注文番号は12345です。
急ぎで必要なので、いつ届くか教えてください。`;

type TriageResult = {
  category: string;
  urgency: "高" | "中" | "低";
  summary: string;
  draft_reply: string;
};

const URGENCY_STYLE: Record<string, string> = {
  高: "bg-red-100 text-red-700",
  中: "bg-amber-100 text-amber-700",
  低: "bg-neutral-100 text-neutral-700",
};

export default function InquiryTriagePage() {
  const [inquiry, setInquiry] = useState(SAMPLE_INQUIRY);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/inquiry-triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiry }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "エラーが発生しました");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell
      title="問い合わせ自動振り分け・返信下書き"
      description="顧客からの問い合わせ文を貼り付けると、種類・緊急度を判定し、返信の下書きまで自動生成します。"
    >
      <div className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            問い合わせ内容
          </label>
          <textarea
            className="h-36 w-full rounded-lg border border-neutral-300 bg-white p-3 text-sm"
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || !inquiry}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {loading ? "解析中..." : "解析する"}
        </button>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {result && (
          <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium">
                {result.category}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${URGENCY_STYLE[result.urgency] ?? URGENCY_STYLE["低"]}`}
              >
                緊急度: {result.urgency}
              </span>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-neutral-500">要約</p>
              <p className="text-sm">{result.summary}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-neutral-500">
                返信下書き
              </p>
              <p className="whitespace-pre-wrap rounded-lg bg-neutral-50 p-3 text-sm">
                {result.draft_reply}
              </p>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
