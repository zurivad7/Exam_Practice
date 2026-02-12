# Evidence-Locked Exam Prep (MVP)

A Next.js + Prisma app that generates MCQs strictly grounded in uploaded PDF text.

## Quick start

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

## How it works

1. Upload a PDF on `/documents`.
2. Backend extracts per-page text, stores pages, builds overlapping chunks, and computes embeddings.
3. Generation uses retrieved chunks only and OpenAI Structured Outputs JSON schema.
4. QC rejects unsupported or low-quality items.
5. Practice UI shows evidence, rationale, confidence capture, and issue reporting.

## Guardrails checklist

- [x] Evidence-locked: every quote must be exact substring match against normalized page text.
- [x] No external knowledge: generation prompt and retrieval context are PDF-only.
- [x] Rejection over hallucination: stores and displays rejections count.
- [x] QC filters: duplicates/trick-options/evidence answerability/dedup checks.
- [x] Safety/privacy: local private storage + document delete cascades data removal.
- [x] UI trust cues: evidence panel, review mode behavior, context viewing placeholder.

## TODOs

- OCR implementation behind `ENABLE_OCR=true` using Tesseract pipeline.
- Postgres migration by changing Prisma datasource provider.
- S3 storage adapter replacing `lib/storage/local.ts`.
- Multi-user auth and row-level access.
