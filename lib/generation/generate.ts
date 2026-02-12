import OpenAI from 'openai';
import { OutputSchema } from '@/lib/types';
import { systemPrompt, userPrompt } from './prompts';
import { runQcChecks } from '@/lib/qc/guards';
import { prisma } from '@/lib/db';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateStrictSet = async ({
  documentId,
  title,
  mode,
  requested,
  chunks
}: {
  documentId: string;
  title: string;
  mode: 'study' | 'exam';
  requested: number;
  chunks: Array<{ id: string; startPage: number; text: string }>;
}) => {
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
    temperature: 0.3,
    max_output_tokens: 3000,
    input: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: userPrompt({ count: requested, mode, documentTitle: title, chunks })
      }
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'exam_set',
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            set: {
              type: 'object',
              additionalProperties: false,
              properties: {
                document_id: { type: 'string' },
                title: { type: 'string' },
                mode: { type: 'string', enum: ['study', 'exam'] },
                created_at: { type: 'string' },
                questions: { type: 'array' },
                rejections: { type: 'array' }
              },
              required: ['document_id', 'title', 'mode', 'created_at', 'questions', 'rejections']
            }
          },
          required: ['set']
        },
        strict: true
      }
    }
  });

  const payload = JSON.parse(response.output_text);
  const parsed = OutputSchema.parse(payload);

  const pages = await prisma.page.findMany({ where: { documentId } });
  const pageTextByNumber = new Map(pages.map((page) => [page.number, page.rawText]));
  const seen = new Set<string>();

  const qcQuestions = parsed.set.questions.flatMap((question) => {
    const qc = runQcChecks(question, pageTextByNumber, seen);
    if (!qc.passed) {
      parsed.set.rejections.push({
        attempted_id: question.id,
        reason: 'qc_failed',
        details: JSON.stringify(qc.checks)
      });
      return [];
    }

    return [{ ...question, qc }];
  });

  parsed.set.questions = qcQuestions;
  return parsed;
};
