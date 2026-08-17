# AI業務効率化ツールキット

Claude API（Anthropic）を使って、中小企業のバックオフィス業務を自動化する4つのデモツールをまとめたポートフォリオサイトです。

## 収録ツール

1. **社内FAQチャットボット** (`/faq-bot`) — 社内マニュアルの内容だけを根拠に質問に回答
2. **問い合わせ自動振り分け** (`/inquiry-triage`) — 問い合わせの分類・緊急度判定・返信下書き生成
3. **CSVレポート自動生成** (`/report-generator`) — 売上/アクセスデータから週次・月次レポートを自動作成
4. **議事録自動要約** (`/transcript-summarizer`) — 会議の文字起こしから決定事項・アクションアイテムを整理

## セットアップ

```bash
npm install
cp .env.local.example .env.local
# .env.local に ANTHROPIC_API_KEY を設定
npm run dev
```

http://localhost:3000 で確認できます。

## デプロイ

Vercelへのデプロイを想定しています。

```bash
npx vercel
```

デプロイ後、Vercelのプロジェクト設定 → Environment Variables に `ANTHROPIC_API_KEY` を追加してください。
