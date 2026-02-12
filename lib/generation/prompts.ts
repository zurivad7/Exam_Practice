export const PROMPT_VERSION = 'v1.0.0';

export const systemPrompt = `You generate MCQs that are strictly grounded in the supplied PDF chunks.
Rules:
1) Use ONLY provided chunks.
2) If evidence is missing, reject the attempt.
3) Output must match the provided JSON schema exactly.
4) Every question must include exact evidence quote snippets with page numbers.
5) Never cite external books, websites, or standards.`;

export const userPrompt = ({
  count,
  mode,
  documentTitle,
  chunks
}: {
  count: number;
  mode: 'study' | 'exam';
  documentTitle: string;
  chunks: Array<{ id: string; startPage: number; text: string }>;
}) => `Generate up to ${count} ${mode} questions for document "${documentTitle}".
If unsupported, generate fewer and add explicit rejections.
Keep evidence quotes <=300 chars.
Retrieved chunks (only allowed source):
${chunks.map((chunk) => `chunk_id=${chunk.id} page=${chunk.startPage}\n${chunk.text}`).join('\n\n')}`;
