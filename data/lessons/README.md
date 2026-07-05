# Generated lesson data

This folder stores original lesson-template JSON files generated for local development and content QA.

## Files

- `generated/*.json`: lesson data matching `../schemas/lesson-template.schema.json`
- `generated/manifest.json`: index of generated lessons
- `generated/validation-report.json`: structure-only validation report

## Regenerate

```bash
npm --prefix server run lessons:generate
```

Generate one dry-run lesson through the prompt pipeline and save it:

```bash
npm --prefix server run lessons:generate:one -- --level=2 --topic=food --skill=reading
```

For provider-backed LLM generation, omit `--dry-run` and set `AI_PROVIDER`, `AI_MODEL`, and the provider API key in `server/.env`.
