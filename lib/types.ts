import { z } from 'zod';

export const QuestionSchema = z.object({
  id: z.string(),
  category: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  skill: z.enum(['recall', 'comprehension', 'application']),
  question: z.string(),
  choices: z.array(z.string()).length(4),
  correct_index: z.number().int().min(0).max(3),
  rationale: z.string(),
  distractor_rationales: z.array(z.string()).length(4),
  evidence: z
    .array(
      z.object({
        page: z.number().int().min(1),
        quote: z.string().max(300),
        chunk_id: z.string()
      })
    )
    .min(1),
  qc: z.object({
    passed: z.boolean(),
    checks: z.object({
      evidence_match: z.boolean(),
      one_correct: z.boolean(),
      no_duplicate_choices: z.boolean(),
      answerable_from_evidence: z.boolean(),
      no_trick_options: z.boolean(),
      deduped: z.boolean()
    })
  })
});

export const RejectionSchema = z.object({
  attempted_id: z.string(),
  reason: z.enum(['insufficient_evidence', 'evidence_not_found', 'qc_failed', 'other']),
  details: z.string()
});

export const OutputSchema = z.object({
  set: z.object({
    document_id: z.string(),
    title: z.string(),
    mode: z.enum(['study', 'exam']),
    created_at: z.string(),
    questions: z.array(QuestionSchema),
    rejections: z.array(RejectionSchema)
  })
});

export type OutputSet = z.infer<typeof OutputSchema>;
export type Question = z.infer<typeof QuestionSchema>;
