import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function DocumentDetailsPage({ params }: { params: { id: string } }) {
  const document = await prisma.document.findUnique({
    where: { id: params.id },
    include: { pages: true, sets: { orderBy: { createdAt: 'desc' } } }
  });

  if (!document) notFound();

  return (
    <div className="space-y-4">
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">{document.name}</h1>
        <p className="text-sm text-slate-600">Pages: {document.pageCount}</p>
        <form action="/api/sets/generate" method="post" className="grid gap-3 md:grid-cols-4">
          <input type="hidden" name="documentId" value={document.id} />
          <input type="number" name="pageStart" min={1} max={document.pageCount} defaultValue={1} className="rounded border p-2" />
          <input type="number" name="pageEnd" min={1} max={document.pageCount} defaultValue={document.pageCount} className="rounded border p-2" />
          <select name="mode" className="rounded border p-2"><option value="study">Study</option><option value="exam">Exam</option></select>
          <select name="count" className="rounded border p-2"><option>10</option><option>20</option><option>40</option></select>
          <button className="btn md:col-span-4" type="submit">Generate Set</button>
        </form>
      </div>
      <div className="card">
        <h2 className="mb-2 text-lg font-semibold">Generated Sets</h2>
        <ul className="space-y-2 text-sm">
          {document.sets.map((set) => (
            <li key={set.id} className="rounded border p-2">{set.title}: Generated {set.generated}/{set.requested} · rejected {set.rejected}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
