import crypto from 'node:crypto';
import WebSocket from 'ws';
import { env } from '../config/env.config.js';
import { badRequest, AppError } from '../utils/http-error.js';

const EDGE_TTS_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const EDGE_TTS_ENDPOINT = 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1';
const EDGE_EXTENSION_ORIGIN = 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold';
const EDGE_CHROMIUM_VERSION = '143.0.3650.75';
const EDGE_CHROMIUM_MAJOR_VERSION = EDGE_CHROMIUM_VERSION.split('.')[0];
const EDGE_SEC_MS_GEC_VERSION = `1-${EDGE_CHROMIUM_VERSION}`;
const EDGE_USER_AGENT =
  `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ` +
  `(KHTML, like Gecko) Chrome/${EDGE_CHROMIUM_MAJOR_VERSION}.0.0.0 ` +
  `Safari/537.36 Edg/${EDGE_CHROMIUM_MAJOR_VERSION}.0.0.0`;
const WINDOWS_EPOCH_SECONDS = 11644473600n;
const HUNDRED_NANOSECONDS_PER_SECOND = 10000000n;
const DEFAULT_LANGUAGE = 'zh-CN';
const DEFAULT_SPEED = 1;

const SUPPORTED_PROVIDERS = new Set(['edge']);

const xmlEscape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();

const normalizeSpeed = (speed) => {
  const value = Number(speed || DEFAULT_SPEED);

  if (!Number.isFinite(value)) {
    return DEFAULT_SPEED;
  }

  return Math.min(2, Math.max(0.5, value));
};

const speedToProsodyRate = (speed) => {
  const percent = Math.round((speed - 1) * 100);
  return `${percent >= 0 ? '+' : ''}${percent}%`;
};

const generateSecMsGec = () => {
  const unixSeconds = BigInt(Math.floor(Date.now() / 1000));
  const windowsSeconds = unixSeconds + WINDOWS_EPOCH_SECONDS;
  const roundedWindowsSeconds = windowsSeconds - (windowsSeconds % 300n);
  const ticks = roundedWindowsSeconds * HUNDRED_NANOSECONDS_PER_SECOND;

  return crypto
    .createHash('sha256')
    .update(`${ticks}${EDGE_TTS_TOKEN}`, 'ascii')
    .digest('hex')
    .toUpperCase();
};

const generateMuid = () => crypto.randomBytes(16).toString('hex').toUpperCase();

const validateLanguage = (language) => {
  if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(language)) {
    throw badRequest('Ngôn ngữ TTS không hợp lệ.', { field: 'language' });
  }
};

const validateVoice = (voice) => {
  if (!/^[a-z]{2,3}-[A-Z]{2}-[A-Za-z0-9]+Neural$/.test(voice)) {
    throw badRequest('Voice Edge TTS không hợp lệ.', { field: 'voice' });
  }
};

const createHeaders = ({ path, requestId, contentType }) => {
  const headers = [`X-Timestamp:${new Date().toISOString()}`, `Path:${path}`];

  if (requestId) {
    headers.unshift(`X-RequestId:${requestId}`);
  }

  if (contentType) {
    headers.push(`Content-Type:${contentType}`);
  }

  return `${headers.join('\r\n')}\r\n\r\n`;
};

const createSpeechConfigMessage = () =>
  `${createHeaders({
    path: 'speech.config',
    contentType: 'application/json; charset=utf-8'
  })}${JSON.stringify({
    context: {
      synthesis: {
        audio: {
          metadataoptions: {
            sentenceBoundaryEnabled: false,
            wordBoundaryEnabled: false
          },
          outputFormat: env.TTS_EDGE_OUTPUT_FORMAT
        }
      }
    }
  })}`;

const createSsmlMessage = ({ requestId, text, language, voice, speed }) =>
  `${createHeaders({
    path: 'ssml',
    requestId,
    contentType: 'application/ssml+xml'
  })}<speak version="1.0" xml:lang="${language}"><voice name="${voice}"><prosody rate="${speedToProsodyRate(
    speed
  )}">${xmlEscape(text)}</prosody></voice></speak>`;

const eventDataToBuffer = async (data) => {
  if (Buffer.isBuffer(data)) {
    return data;
  }

  if (data instanceof ArrayBuffer) {
    return Buffer.from(data);
  }

  if (ArrayBuffer.isView(data)) {
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  }

  if (typeof Blob !== 'undefined' && data instanceof Blob) {
    return Buffer.from(await data.arrayBuffer());
  }

  return Buffer.from(data);
};

const parseAudioChunk = (buffer) => {
  if (buffer.length >= 2) {
    const headerLength = buffer.readUInt16BE(0);

    if (headerLength > 0 && headerLength <= buffer.length - 2) {
      const header = buffer.subarray(2, 2 + headerLength).toString('utf8');

      if (header.includes('Path:audio')) {
        return buffer.subarray(2 + headerLength);
      }
    }
  }

  const separator = buffer.indexOf('\r\n\r\n');

  if (separator === -1) {
    return null;
  }

  const header = buffer.subarray(0, separator).toString('utf8');

  if (!header.includes('Path:audio')) {
    return null;
  }

  return buffer.subarray(separator + 4);
};

const synthesizeWithEdge = ({ text, language, voice, speed }) =>
  new Promise((resolve, reject) => {
    const requestId = crypto.randomUUID().replaceAll('-', '');
    const url = new URL(EDGE_TTS_ENDPOINT);
    url.searchParams.set('TrustedClientToken', EDGE_TTS_TOKEN);
    url.searchParams.set('ConnectionId', requestId);
    url.searchParams.set('Sec-MS-GEC', generateSecMsGec());
    url.searchParams.set('Sec-MS-GEC-Version', EDGE_SEC_MS_GEC_VERSION);

    const audioChunks = [];
    let settled = false;

    const settle = (callback, value) => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeout);

      try {
        socket.close();
      } catch {
        // The socket may already be closed after turn.end.
      }

      callback(value);
    };

    const socket = new WebSocket(url.toString(), {
      headers: {
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        Cookie: `muid=${generateMuid()};`,
        Origin: EDGE_EXTENSION_ORIGIN,
        Pragma: 'no-cache',
        'User-Agent': EDGE_USER_AGENT
      }
    });
    socket.binaryType = 'arraybuffer';

    const timeout = setTimeout(() => {
      settle(
        reject,
        new AppError(504, 'TTS_TIMEOUT', 'Edge TTS phản hồi quá lâu. Vui lòng thử lại.')
      );
    }, env.TTS_TIMEOUT_MS);

    socket.on('open', () => {
      socket.send(createSpeechConfigMessage());
      socket.send(createSsmlMessage({ requestId, text, language, voice, speed }));
    });

    socket.on('message', async (data, isBinary) => {
      try {
        if (!isBinary) {
          const message = data.toString();

          if (message.includes('Path:turn.end')) {
            const audio = Buffer.concat(audioChunks);

            if (!audio.length) {
              settle(reject, new AppError(502, 'TTS_EMPTY_AUDIO', 'Edge TTS không trả về audio.'));
              return;
            }

            settle(resolve, {
              audio,
              provider: 'edge',
              voice,
              language,
              speed,
              mimeType: 'audio/mpeg'
            });
          }

          return;
        }

        const chunk = parseAudioChunk(await eventDataToBuffer(data));

        if (chunk?.length) {
          audioChunks.push(chunk);
        }
      } catch (error) {
        settle(reject, error);
      }
    });

    socket.on('error', (error) => {
      settle(
        reject,
        new AppError(502, 'TTS_PROVIDER_ERROR', 'Không thể kết nối Edge TTS.', {
          reason: error.message
        })
      );
    });

    socket.on('close', () => {
      if (!settled && audioChunks.length) {
        settle(resolve, {
          audio: Buffer.concat(audioChunks),
          provider: 'edge',
          voice,
          language,
          speed,
          mimeType: 'audio/mpeg'
        });
      }
    });
  });

export const synthesizeSpeech = async ({
  text,
  language = DEFAULT_LANGUAGE,
  voice = env.TTS_EDGE_VOICE,
  speed = DEFAULT_SPEED,
  provider = env.TTS_PROVIDER
}) => {
  const normalizedText = normalizeText(text || '');

  if (!normalizedText) {
    throw badRequest('Vui lòng truyền text để tạo audio.', { field: 'text' });
  }

  if (normalizedText.length > env.TTS_MAX_TEXT_LENGTH) {
    throw badRequest(`Text TTS tối đa ${env.TTS_MAX_TEXT_LENGTH} ký tự.`, {
      field: 'text',
      maxLength: env.TTS_MAX_TEXT_LENGTH
    });
  }

  if (!SUPPORTED_PROVIDERS.has(provider)) {
    throw badRequest('TTS provider không được hỗ trợ.', {
      field: 'provider',
      supportedProviders: [...SUPPORTED_PROVIDERS]
    });
  }

  validateLanguage(language);
  validateVoice(voice);

  return synthesizeWithEdge({
    text: normalizedText,
    language,
    voice,
    speed: normalizeSpeed(speed)
  });
};
