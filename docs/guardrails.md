# Guardrails (Code Enforced)

## G1 Evidence locked
- `containsNormalizedSubstring` verifies evidence quotes against stored page text.
- Normalization: whitespace collapse, quote/dash normalization.

## G2 No external knowledge
- Prompts explicitly prohibit external references.
- Generator receives only retrieved chunks and no web context.

## G3 Reject over hallucinate
- Output supports `rejections[]` and saved generated/rejected counters.

## G4 QC filters
- Exactly one correct index.
- Choice dedupe.
- Ban all/none trick options.
- Heuristic answerability from evidence term overlap.
- Dedup question stems in-set.

## G5 Safety/privacy
- Private local storage and delete cascade.

## G6 UI trust cues
- Evidence panel in review mode.
- "View in context" action present (MVP placeholder modal integration point).
