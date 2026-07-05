const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-20b';
const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';

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

const valueFrom = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');

const resolveProviderConfig = ({ purpose = 'generation' } = {}) => {
  const prefix = purpose === 'review' ? 'AI_REVIEW' : 'AI';
  const provider = String(
    valueFrom(process.env[`${prefix}_PROVIDER`], process.env.AI_PROVIDER, 'openai')
  ).toLowerCase();
  const apiKey =
    valueFrom(process.env[`${prefix}_API_KEY`], process.env.AI_API_KEY) ||
    (provider === 'groq'
      ? valueFrom(process.env.GROQ_API_KEY, process.env.OPENAI_API_KEY)
      : valueFrom(process.env.OPENAI_API_KEY, process.env.GROQ_API_KEY));
  const baseUrl =
    valueFrom(process.env[`${prefix}_BASE_URL`], process.env.AI_BASE_URL) ||
    (provider === 'groq'
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions');
  const model =
    valueFrom(process.env[`${prefix}_MODEL`], process.env.AI_MODEL) ||
    (provider === 'groq' ? DEFAULT_GROQ_MODEL : DEFAULT_OPENAI_MODEL);

  return { provider, apiKey, baseUrl, model };
};

const parseResponseError = (body) => {
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
};

const isJsonModeValidationError = (status, body) => {
  if (status !== 400) {
    return false;
  }

  const parsed = parseResponseError(body);
  const code = parsed?.error?.code;
  const message = parsed?.error?.message || '';

  return code === 'json_validate_failed' || message.includes('Failed to validate JSON');
};

const buildRequestBody = ({ model, systemPrompt, prompt, temperature, useJsonMode }) => ({
  model,
  messages: [
    {
      role: 'system',
      content: systemPrompt || 'Return valid JSON only.'
    },
    { role: 'user', content: prompt }
  ],
  temperature,
  ...(useJsonMode ? { response_format: { type: 'json_object' } } : {})
});

const postChatCompletion = async ({ apiKey, baseUrl, requestBody }) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  const body = await response.text();

  return { response, body };
};

export const callOpenAiCompatibleJson = async ({
  purpose = 'generation',
  systemPrompt,
  prompt,
  temperature = 0.3,
  jsonMode = true
}) => {
  const { provider, apiKey, baseUrl, model } = resolveProviderConfig({ purpose });

  if (!apiKey) {
    throw new Error(
      `Missing API key for ${purpose}. Set AI_API_KEY, OPENAI_API_KEY, GROQ_API_KEY, or ${purpose === 'review' ? 'AI_REVIEW_API_KEY.' : 'AI_API_KEY.'}`
    );
  }

  let usedJsonMode = jsonMode;
  let { response, body } = await postChatCompletion({
    apiKey,
    baseUrl,
    requestBody: buildRequestBody({ model, systemPrompt, prompt, temperature, useJsonMode: usedJsonMode })
  });

  if (!response.ok && usedJsonMode && isJsonModeValidationError(response.status, body)) {
    usedJsonMode = false;
    const fallbackPrompt = `${prompt}

The previous request failed provider JSON-mode validation. Return only one syntactically valid JSON object. Do not use markdown fences, comments, or trailing text.`;

    ({ response, body } = await postChatCompletion({
      apiKey,
      baseUrl,
      requestBody: buildRequestBody({
        model,
        systemPrompt,
        prompt: fallbackPrompt,
        temperature,
        useJsonMode: false
      })
    }));
  }

  if (!response.ok) {
    throw new Error(`${purpose} model request failed with ${response.status}: ${body.slice(0, 300)}`);
  }

  const payload = JSON.parse(body);
  const rawText = payload.choices?.[0]?.message?.content || '{}';

  return {
    provider,
    modelName: model,
    rawText,
    json: JSON.parse(extractJsonText(rawText)),
    usage: payload.usage,
    jsonMode: usedJsonMode
  };
};
