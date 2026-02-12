import { normalizeText } from '../pdf/normalize.js';

export const chunkPages = (pages, size = 1000, overlap = 200) => {
  const chunks = [];
  for (const page of pages) {
    const normalized = normalizeText(page.rawText);
    let offset = 0;
    while (offset < normalized.length) {
      const slice = normalized.slice(offset, offset + size);
      chunks.push({ id: `p${page.pageNumber}_c${offset}`, startPage: page.pageNumber, endPage: page.pageNumber, text: slice });
      offset += Math.max(1, size - overlap);
    }
  }
  return chunks;
};
