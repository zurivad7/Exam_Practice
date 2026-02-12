import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function PracticePage() {
  const sets = await prisma.practiceSet.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-4">
      <div className="card">
        <h1 className="text-xl font-semibold">Practice Categories</h1>
        <p className="text-sm text-slate-600">MVP grouping by question set (acts as category list).</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {sets.map((set) => (
          <Link key={set.id} href={`/practice/${set.id}`} className="card hover:bg-slate-50">
            <p className="font-medium">{set.title}</p>
            <p className="text-sm text-slate-500">{set.mode.toUpperCase()} · {set.generated} questions</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
