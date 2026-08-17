import Link from "next/link";

const TOOLS = [
  {
    href: "/faq-bot",
    title: "社内FAQチャットボット",
    description:
      "社内マニュアルを読み込ませて質問に自動回答。バックオフィス問い合わせの一次対応を削減。",
  },
  {
    href: "/inquiry-triage",
    title: "問い合わせ自動振り分け",
    description:
      "顧客からの問い合わせを分類・緊急度判定し、返信の下書きまで自動生成。",
  },
  {
    href: "/report-generator",
    title: "CSVレポート自動生成",
    description:
      "売上・アクセスデータのCSVから、週次・月次レポートをMarkdownで自動作成。",
  },
  {
    href: "/transcript-summarizer",
    title: "議事録自動要約",
    description:
      "会議の文字起こしから、決定事項・アクションアイテムを整理した議事録を自動生成。",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm font-medium text-neutral-500">
          AI業務効率化ツールキット
        </p>
        <h1 className="mt-2 text-3xl font-bold">
          Claudeで作る、中小企業向け業務自動化のデモ集
        </h1>
        <p className="mt-3 max-w-2xl text-neutral-600">
          問い合わせ対応・レポート作成・議事録作成など、日々の定型業務をAIで自動化する4つのツールのデモです。
          いずれもClaude
          APIを使って数時間〜1日程度で構築しています。実際の業務に合わせたカスタム開発も可能です。
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-400 hover:shadow-sm"
            >
              <h2 className="font-semibold text-neutral-900 group-hover:underline">
                {tool.title}
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
