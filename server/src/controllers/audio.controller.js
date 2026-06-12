import crypto from 'node:crypto';
import { synthesizeSpeech } from '../services/audio.service.js';
import { asyncHandler } from '../utils/async-handler.js';

export const getAudio = asyncHandler(async (req, res) => {
  const audio = await synthesizeSpeech({
    text: req.query.text,
    language: req.query.language,
    voice: req.query.voice,
    speed: req.query.speed,
    provider: req.query.provider
  });
  const etag = crypto
    .createHash('sha256')
    .update(`${audio.provider}:${audio.voice}:${audio.language}:${audio.speed}:`)
    .update(audio.audio)
    .digest('base64url');

  res.setHeader('Content-Type', audio.mimeType);
  res.setHeader('Content-Length', String(audio.audio.length));
  res.setHeader('Cache-Control', 'private, max-age=86400');
  res.setHeader('ETag', `"${etag}"`);
  res.setHeader('X-TTS-Provider', audio.provider);
  res.setHeader('X-TTS-Voice', audio.voice);
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  if (req.headers['if-none-match'] === `"${etag}"`) {
    res.status(304).end();
    return;
  }

  res.send(audio.audio);
});
