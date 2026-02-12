import test from 'node:test';
import assert from 'node:assert/strict';
import { chunkPages } from '../lib/retrieval/chunk.js';
import { embedText, cosineSimilarity } from '../lib/retrieval/vector.js';

test('Upload-parse-chunk-retrieve primitives work for MVP flow', () => {
  const pages = [
    { pageNumber: 1, rawText: 'Binary search requires sorted arrays and halves search space each step.' },
    { pageNumber: 2, rawText: 'Merge sort uses divide and conquer with O(n log n) complexity.' }
  ];

  const chunks = chunkPages(pages, 80, 10);
  assert.ok(chunks.length >= 2);

  const query = embedText('sorted arrays halves search');
  const score1 = cosineSimilarity(query, embedText(chunks[0].text));
  const score2 = cosineSimilarity(query, embedText(chunks[chunks.length - 1].text));

  assert.ok(score1 >= score2);
});
