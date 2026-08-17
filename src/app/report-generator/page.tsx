"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { PageShell } from "@/components/PageShell";

const SAMPLE_CSV = `date,channel,visitors,orders,revenue
2026-08-01,SNS,1200,34,102000
2026-08-01,検索広告,800,41,145000
2026-08-01,自然検索,2100,55,178000
2026-08-02,SNS,1100,28,88000
2026-08-02,検索広告,900,50,171000
2026-08-02,自然検索,2000,60,190000`;

export default function ReportGeneratorPage() {
  const [csv, setCsv] = useState(SAMPLE_CSV);
  const [instructions, setInstructions] = useState(
    "チャネルごとの売上効率を比較して、来週の広告予算配分の提案までしてください。"
  );
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCsv(String(reader.result ?? ""));
    reader.readAsText(file);
  }

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setReport("");
    try {
      const res = await fetch("/api/report-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv, instructions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "エラーが発生しました");
      setReport(data.report);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell
      title="CSVレポート自動生成"
      description="CSVデータを貼り付け（またはアップロード）すると、要点をまとめたMarkdownレポートを自動生成します。週次・月次レポート作成の自動化デモです。"
    >
      <div className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            CSVファイル
          </label>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFile}
            className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            CSVデータ
          </label>
          <textarea
            className="h-40 w-full rounded-lg border border-neutral-300 bg-white p-3 font-mono text-xs"
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            レポート作成の指示（任意）
          </label>
          <input
            className="w-full rounded-lg border border-neutral-300 bg-white p-3 text-sm"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || !csv}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {loading ? "生成中..." : "レポートを生成"}
        </button>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {report && (
          <div className="prose prose-sm max-w-none rounded-lg border border-neutral-200 bg-white p-4">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        )}
      </div>
    </PageShell>
  );
}
