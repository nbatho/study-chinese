const envNumber = (name, fallback) => {
  const raw = process.env[name];

  if (raw === undefined || raw === '') {
    return fallback;
  }

  const value = Number(raw);

  if (!Number.isFinite(value)) {
    throw new Error(`Environment variable ${name} must be a number, got: ${raw}`);
  }

  return value;
};

const normalizePem = (value) => value?.replace(/\\n/g, '\n');
const dbSslCa = normalizePem(process.env.DB_SSL_CA);
const dbSslRejectUnauthorized =
  process.env.DB_SSL_REJECT_UNAUTHORIZED === undefined
    ? Boolean(dbSslCa)
    : process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';

export const env = {
  PORT: envNumber('PORT', 5000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  CLIENT_URLS: process.env.CLIENT_URLS,
  TRUST_PROXY:
    process.env.TRUST_PROXY ??
    ((process.env.NODE_ENV || 'development') === 'production'
      ? 'loopback, linklocal, uniquelocal'
      : false),
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000/api/v1',
  ADMIN_EMAILS: process.env.ADMIN_EMAILS || '',

  DATABASE_URL: process.env.DATABASE_URL,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: envNumber('DB_PORT', 5432),
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_SSL: process.env.DB_SSL === 'true',
  DB_SSL_CA: dbSslCa,
  DB_SSL_REJECT_UNAUTHORIZED: dbSslRejectUnauthorized,
  DB_MAX_CONNECTIONS: envNumber('DB_MAX_CONNECTIONS', 10),
  DB_IDLE_TIMEOUT_MS: envNumber('DB_IDLE_TIMEOUT_MS', 30000),
  SKIP_DB_CONNECT: process.env.SKIP_DB_CONNECT === 'true',

  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'Study Chinese <onboarding@resend.dev>',
  EMAIL_VERIFICATION_TTL_HOURS: envNumber('EMAIL_VERIFICATION_TTL_HOURS', 24),
  OTP_TTL_MINUTES: envNumber('OTP_TTL_MINUTES', 10),

  JWT_SECRET: process.env.JWT_SECRET || 'change-this-dev-secret',
  JWT_EXPIRES_IN_SECONDS: envNumber('JWT_EXPIRES_IN_SECONDS', 900),
  REFRESH_TOKEN_EXPIRES_IN_SECONDS: envNumber('REFRESH_TOKEN_EXPIRES_IN_SECONDS', 2592000),

  AI_PROVIDER: process.env.AI_PROVIDER || 'mock',
  AI_MODEL: process.env.AI_MODEL,
  AI_API_KEY: process.env.AI_API_KEY,
  AI_BASE_URL: process.env.AI_BASE_URL,
  AI_TIMEOUT_MS: envNumber('AI_TIMEOUT_MS', 12000),
  AI_RETRY_ATTEMPTS: envNumber('AI_RETRY_ATTEMPTS', 1),
  AI_RETRY_DELAY_MS: envNumber('AI_RETRY_DELAY_MS', 400),
  AI_MAX_MESSAGE_CHARS: envNumber('AI_MAX_MESSAGE_CHARS', 2000),
  AI_FALLBACK_TO_MOCK:
    process.env.AI_FALLBACK_TO_MOCK === undefined
      ? (process.env.NODE_ENV || 'development') !== 'production'
      : process.env.AI_FALLBACK_TO_MOCK === 'true',
  AI_INPUT_COST_PER_1M_TOKENS: envNumber('AI_INPUT_COST_PER_1M_TOKENS', 0),
  AI_OUTPUT_COST_PER_1M_TOKENS: envNumber('AI_OUTPUT_COST_PER_1M_TOKENS', 0),
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  OCR_PROVIDER: process.env.OCR_PROVIDER || 'mock',
  OCR_BASE_URL: process.env.OCR_BASE_URL,
  OCR_API_KEY: process.env.OCR_API_KEY,
  OCR_TIMEOUT_MS: envNumber('OCR_TIMEOUT_MS', 30000),
  OCR_MAX_IMAGE_BYTES: envNumber('OCR_MAX_IMAGE_BYTES', 5 * 1024 * 1024),
  TTS_PROVIDER: process.env.TTS_PROVIDER || 'edge',
  TTS_EDGE_VOICE: process.env.TTS_EDGE_VOICE || 'zh-CN-XiaoxiaoNeural',
  TTS_EDGE_OUTPUT_FORMAT:
    process.env.TTS_EDGE_OUTPUT_FORMAT || 'audio-24khz-48kbitrate-mono-mp3',
  TTS_MAX_TEXT_LENGTH: envNumber('TTS_MAX_TEXT_LENGTH', 300),
  TTS_TIMEOUT_MS: envNumber('TTS_TIMEOUT_MS', 12000),
  STT_PROVIDER: process.env.STT_PROVIDER || 'groq',
  STT_MODEL: process.env.STT_MODEL || 'whisper-large-v3-turbo',
  STT_TIMEOUT_MS: envNumber('STT_TIMEOUT_MS', 15000),
  STT_MAX_AUDIO_BYTES: envNumber('STT_MAX_AUDIO_BYTES', 2 * 1024 * 1024)
};

export const isProduction = env.NODE_ENV === 'production';

const isUnsafeJwtSecret =
  !env.JWT_SECRET ||
  env.JWT_SECRET === 'change-this-dev-secret' ||
  env.JWT_SECRET.length < 32;

if (isProduction && isUnsafeJwtSecret) {
  throw new Error('JWT_SECRET must be set to a strong value with at least 32 characters in production.');
}

export const adminEmails = new Set(
  env.ADMIN_EMAILS.split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

export const hasDatabaseConfig = () => {
  if (env.DATABASE_URL) {
    return true;
  }

  return Boolean(env.DB_HOST && env.DB_NAME && env.DB_USER);
};
