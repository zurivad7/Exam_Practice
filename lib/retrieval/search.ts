import { prisma } from '@/lib/db';
import { cosineSimilarity, embedText } from './vector';

export const retrieveChunks = async (documentId: string, query: string, pageStart: number, pageEnd: number, k = 8) => {
  const rows = await prisma.chunk.findMany({
    where: {
      documentId,
      startPage: { gte: pageStart },
      endPage: { lte: pageEnd }
    }
  });

  const queryVector = embedText(query);

  const scored = rows
    .map((row) => {
      const rowVector = JSON.parse(row.embedding) as number[];
      return {
        ...row,
        score: cosineSimilarity(queryVector, rowVector)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  return scored;
};
