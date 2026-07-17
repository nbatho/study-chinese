/**
 * Pull the JSON object out of an LLM response: strips ```json fences and any
 * prose around the outermost `{ … }`. Returns the trimmed input unchanged when
 * no object delimiters are found, so callers still get something to JSON.parse.
 */
export const extractJsonText = (text) => {
  const trimmed = String(text || '').trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const first = candidate.indexOf('{');
  const last = candidate.lastIndexOf('}');

  if (first === -1 || last === -1 || last <= first) {
    return candidate;
  }

  return candidate.slice(first, last + 1);
};
