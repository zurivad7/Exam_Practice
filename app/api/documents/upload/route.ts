import { NextResponse } from 'next/server';
import { saveUpload } from '@/lib/storage/local';
import { parsePdfWithPages } from '@/lib/pdf/parse';
import { prisma } from '@/lib/db';
import { chunkPages } from '@/lib/retrieval/chunk';
import { embedText } from '@/lib/retrieval/vector';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('pdf');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing PDF file' }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const filePath = await saveUpload(file.name, bytes);
  const pages = await parsePdfWithPages(filePath);

  const document = await prisma.document.create({
    data: {
      name: file.name,
      filePath,
      pageCount: pages.length
    }
  });

  await prisma.page.createMany({
    data: pages.map((page) => ({
      documentId: document.id,
      number: page.pageNumber,
      rawText: page.rawText
    }))
  });

  const chunks = chunkPages(pages);
  await prisma.chunk.createMany({
    data: chunks.map((chunk) => ({
      id: `${document.id}_${chunk.id}`,
      documentId: document.id,
      startPage: chunk.startPage,
      endPage: chunk.endPage,
      text: chunk.text,
      embedding: JSON.stringify(embedText(chunk.text)),
      tokenEstimate: Math.ceil(chunk.text.length / 4)
    }))
  });

  return NextResponse.redirect(new URL(`/documents/${document.id}`, request.url));
}
