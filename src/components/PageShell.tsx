import Link from "next/link";

export function PageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-neutral-800"
        >
          ← ツール一覧に戻る
        </Link>
        <h1 className="mt-3 text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-neutral-600">{description}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
