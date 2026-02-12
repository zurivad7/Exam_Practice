import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { retrieveChunks } from '@/lib/retrieval/search';
import { generateStrictSet } from '@/lib/generation/generate';

export async function POST(request: Request) {
  const formData = await request.formData();
  const documentId = String(formData.get('documentId'));
  const pageStart = Number(formData.get('pageStart'));
  const pageEnd = Number(formData.get('pageEnd'));
  const mode = String(formData.get('mode')) as 'study' | 'exam';
  const requested = Number(formData.get('count'));

  const document = await prisma.document.findUnique({ where: { id: documentId } });
  if (!document) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

  const chunks = await retrieveChunks(documentId, `Generate ${requested} ${mode} questions`, pageStart, pageEnd, 24);

  const output = await generateStrictSet({
    documentId,
    title: document.name,
    mode,
    requested,
    chunks: chunks.map((chunk) => ({ id: chunk.id, startPage: chunk.startPage, text: chunk.text }))
  });

  const set = await prisma.practiceSet.create({
    data: {
      documentId,
      title: `${document.name} p${pageStart}-${pageEnd}`,
      mode,
      requested,
      generated: output.set.questions.length,
      rejected: output.set.rejections.length,
      resultJson: JSON.stringify(output)
    }
  });

  return NextResponse.redirect(new URL(`/practice/${set.id}`, request.url));
}
