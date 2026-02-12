import { normalizeText } from '@/lib/pdf/normalize';

export interface Chunk {
  id: string;
  startPage: number;
  endPage: number;
  text: string;
}

export const chunkPages = (
  pages: Array<{ pageNumber: number; rawText: string }>,
  size = 1000,
  overlap = 200
): Chunk[] => {
  const chunks: Chunk[] = [];

  for (const page of pages) {
    const normalized = normalizeText(page.rawText);
    let offset = 0;
    while (offset < normalized.length) {
      const slice = normalized.slice(offset, offset + size);
      const id = `p${page.pageNumber}_c${offset}`;
      chunks.push({ id, startPage: page.pageNumber, endPage: page.pageNumber, text: slice });
      offset += Math.max(1, size - overlap);
    }
  }

  return chunks;
};
