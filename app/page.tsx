import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="card space-y-4">
      <h1 className="text-2xl font-semibold">Evidence-Locked Exam Prep</h1>
      <p className="text-sm text-slate-600">Generate MCQs that are grounded in uploaded PDFs with strict evidence verification.</p>
      <div className="flex gap-3">
        <Link href="/documents" className="btn">Documents</Link>
        <Link href="/practice" className="btn-secondary">Practice Sets</Link>
      </div>
    </div>
  );
}
