import { containsNormalizedSubstring, normalizeText } from '@/lib/pdf/normalize';
import type { Question } from '@/lib/types';

const bannedChoiceRegex = /all of the above|none of the above/i;

const sharedKeywordCount = (a: string, b: string) => {
  const tokenize = (value: string) =>
    new Set(
      normalizeText(value)
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length > 3)
    );

  const ta = tokenize(a);
  const tb = tokenize(b);
  let hits = 0;
  ta.forEach((token) => {
    if (tb.has(token)) hits += 1;
  });
  return hits;
};

export const runQcChecks = (
  question: Question,
  pageTextByNumber: Map<number, string>,
  seenQuestions: Set<string>
) => {
  const noDuplicateChoices = new Set(question.choices.map((choice) => normalizeText(choice).toLowerCase())).size === 4;
  const noTrickOptions = question.choices.every((choice) => !bannedChoiceRegex.test(choice));
  const evidenceMatch = question.evidence.every((evidence) => {
    const pageText = pageTextByNumber.get(evidence.page) ?? '';
    return containsNormalizedSubstring(pageText, evidence.quote);
  });
  const answerableFromEvidence = question.evidence.some((evidence) => sharedKeywordCount(question.question, evidence.quote) >= 2);
  const dedupeKey = normalizeText(question.question).toLowerCase();
  const deduped = !seenQuestions.has(dedupeKey);
  if (deduped) seenQuestions.add(dedupeKey);

  const checks = {
    evidence_match: evidenceMatch,
    one_correct: Number.isInteger(question.correct_index) && question.correct_index >= 0 && question.correct_index < 4,
    no_duplicate_choices: noDuplicateChoices,
    answerable_from_evidence: answerableFromEvidence,
    no_trick_options: noTrickOptions,
    deduped
  };

  return {
    passed: Object.values(checks).every(Boolean),
    checks
  };
};
