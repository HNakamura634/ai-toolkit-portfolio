"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageShell } from "@/components/PageShell";

const SAMPLE_TRANSCRIPT = `田中: 今日は新機能のリリース時期について話しましょう。
佐藤: QAが来週いっぱいかかりそうなので、リリースは再来週の月曜でどうでしょうか。
田中: 了解です。では9月1日リリースで進めましょう。佐藤さんはQAチームへの連携をお願いします。
鈴木: マーケ側の告知文言はまだ確定していません。木曜までに私がドラフトを作ります。
田中: ありがとうございます。あと、価格プランの変更は今回のリリースに含めるか未定なので、来週改めて相談しましょう。`;

export default function TranscriptSummarizerPage() {
  const [transcript, setTranscript] = useState(SAMPLE_TRANSCRIPT);
  const [minutes, setMinutes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSummarize() {
    setLoading(true);
    setError("");
    setMinutes("");
    try {
      const res = await fetch("/api/transcript-summarizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "エラーが発生しました");
      setMinutes(data.minutes);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell
      title="議事録自動要約"
      description="Zoom/Teamsなどの文字起こしテキストを貼り付けると、決定事項・アクションアイテムを整理した議事録を自動生成します。"
    >
      <div className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            会議の文字起こし
          </label>
          <textarea
            className="h-56 w-full rounded-lg border border-neutral-300 bg-white p-3 text-sm"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        </div>
        <button
          onClick={handleSummarize}
          disabled={loading || !transcript}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {loading ? "要約中..." : "議事録を作成"}
        </button>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {minutes && (
          <div className="prose prose-sm max-w-none rounded-lg border border-neutral-200 bg-white p-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{minutes}</ReactMarkdown>
          </div>
        )}
      </div>
    </PageShell>
  );
}
