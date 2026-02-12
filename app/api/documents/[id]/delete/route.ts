import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { deleteUpload } from '@/lib/storage/local';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const document = await prisma.document.findUnique({ where: { id: params.id } });
  if (!document) return NextResponse.redirect(new URL('/documents', request.url));

  await deleteUpload(document.filePath);
  await prisma.document.delete({ where: { id: params.id } });

  return NextResponse.redirect(new URL('/documents', request.url));
}
