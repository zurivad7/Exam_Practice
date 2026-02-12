# Architecture

## Modules

- `app/`: Next.js App Router pages and route handlers.
- `lib/pdf`: parsing + normalization.
- `lib/retrieval`: chunking, embedding, cosine retrieval in app code.
- `lib/generation`: prompt templates and OpenAI schema-constrained generation.
- `lib/qc`: evidence verification and quality checks.
- `prisma/`: SQLite schema for docs/pages/chunks/sets/attempts.
- `tests/`: guardrail and flow tests.

## Data flow

Upload PDF -> parse pages -> create chunks+vectors -> generate strict set (retrieval-only context) -> QC -> persist practice set JSON -> render practice player.

## Security and privacy

- Uploaded PDFs are stored only in local private folder (`./data/uploads`).
- Delete action removes PDF and all derived entities.
- Minimal logging (errors/rejections count, no broad content dumps).
