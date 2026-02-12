import test from 'node:test';
import assert from 'node:assert/strict';
import { containsNormalizedSubstring } from '../lib/pdf/normalize.js';
import { runQcChecks } from '../lib/qc/guards.js';

test('Evidence match requires exact substring after normalization', () => {
  const pageMap = new Map([[1, 'Newton’s second law states that Force equals mass times acceleration.']]);
  const question = {
    id: 'q1',
    category: 'All Questions',
    difficulty: 'easy',
    skill: 'recall',
    question: 'What does Newton second law state?',
    choices: ['F=ma', 'E=mc2', 'PV=nRT', 'V=IR'],
    correct_index: 0,
    rationale: 'The quote explicitly states force equals mass times acceleration.',
    distractor_rationales: ['Wrong law', 'Wrong equation', 'Wrong equation', 'Wrong equation'],
    evidence: [{ page: 1, quote: 'Force equals mass times acceleration', chunk_id: 'c1' }],
    qc: { passed: false, checks: { evidence_match: false, one_correct: true, no_duplicate_choices: true, answerable_from_evidence: true, no_trick_options: true, deduped: true } }
  };

  const qc = runQcChecks(question, pageMap, new Set());
  assert.equal(qc.checks.evidence_match, true);
  assert.equal(containsNormalizedSubstring(pageMap.get(1), question.evidence[0].quote), true);
});

test('QC rejects duplicate choices', () => {
  const pageMap = new Map([[1, 'Mitosis includes prophase, metaphase, anaphase, and telophase.']]);
  const question = {
    id: 'q2', category: 'All', difficulty: 'easy', skill: 'recall', question: 'Which stage appears in mitosis?',
    choices: ['Prophase', 'Prophase', 'Interphase', 'Cytokinesis'],
    correct_index: 0,
    rationale: 'Prophase is in mitosis.',
    distractor_rationales: ['duplicate', 'duplicate', 'different phase', 'separate process'],
    evidence: [{ page: 1, quote: 'Mitosis includes prophase', chunk_id: 'c2' }], qc: { passed: false, checks: {} }
  };
  const qc = runQcChecks(question, pageMap, new Set());
  assert.equal(qc.checks.no_duplicate_choices, false);
  assert.equal(qc.passed, false);
});

test('No external citation guard catches non-PDF quote', () => {
  const pageMap = new Map([[2, 'Cell respiration produces ATP in mitochondria.']]);
  const question = {
    id: 'q3', category: 'All', difficulty: 'medium', skill: 'comprehension', question: 'Where ATP is produced?',
    choices: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi'],
    correct_index: 0,
    rationale: 'Evidence quote says ATP in mitochondria.',
    distractor_rationales: ['wrong organelle', 'wrong organelle', 'wrong organelle', 'wrong organelle'],
    evidence: [{ page: 2, quote: 'According to WHO standards, ATP is generated in mitochondria', chunk_id: 'c3' }], qc: { passed: false, checks: {} }
  };
  const qc = runQcChecks(question, pageMap, new Set());
  assert.equal(qc.checks.evidence_match, false);
});
