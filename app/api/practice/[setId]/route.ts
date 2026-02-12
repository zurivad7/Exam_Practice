import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_: Request, { params }: { params: { setId: string } }) {
  const set = await prisma.practiceSet.findUnique({ where: { id: params.setId } });
  if (!set) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(JSON.parse(set.resultJson));
}
