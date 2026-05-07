const MODEL = 'gpt-4o-mini';
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;
const ipHits = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const state = ipHits.get(ip);
  if (!state || now - state.windowStart > WINDOW_MS) {
    ipHits.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  if (state.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  state.count += 1;
  return false;
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function getSuggestionText(responseJson) {
  const outputText = normalizeText(responseJson?.output_text);
  if (outputText) return outputText;
  const output = Array.isArray(responseJson?.output) ? responseJson.output : [];
  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      const candidate = normalizeText(part?.text || part?.output_text);
      if (candidate) return candidate;
    }
  }
  return '';
}

function setCorsHeaders(req, res) {
  const configuredOrigins = String(process.env.AI_ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

  const requestOrigin = req.headers.origin;
  const allowAll = configuredOrigins.length === 0;
  const allowed = allowAll || (requestOrigin && configuredOrigins.includes(requestOrigin));

  if (allowed && requestOrigin) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return allowed;
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

export default async function handler(req, res) {
  const corsAllowed = setCorsHeaders(req, res);
  if (!corsAllowed && req.headers.origin) {
    return res.status(403).json({ error: 'Origin is not allowed.' });
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not configured on server.' });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
  }

  const body = parseBody(req);
  const fieldType = body?.fieldType === 'textarea' ? 'textarea' : 'input';
  const maxWords = fieldType === 'textarea' ? 80 : 16;
  const fieldLabel = normalizeText(body?.fieldLabel) || normalizeText(body?.fieldKey) || 'Message';
  const templateId = normalizeText(body?.templateId) || 'love-letter';
  const recipientName = normalizeText(body?.recipientName).slice(0, 60);
  const senderName = normalizeText(body?.senderName).slice(0, 60);
  const currentValue = normalizeText(body?.currentValue).slice(0, 500);

  const prompt = [
    'You write romantic but natural copy for a love-letter web app.',
    'Return plain text only. No markdown. No surrounding quotes.',
    `Field: ${fieldLabel}`,
    `Template: ${templateId}`,
    `Recipient: ${recipientName || '(not provided)'}`,
    `Sender: ${senderName || '(not provided)'}`,
    `Current text: ${currentValue || '(empty)'}`,
    'Rules:',
    '- Keep it warm, modern, and personal.',
    `- Keep under ${maxWords} words.`,
    '- Avoid repetitive cliches and overusing emojis.',
    '- Output exactly one polished suggestion.',
  ].join('\n');

  try {
    const openAiResponse = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        input: prompt,
        max_output_tokens: 180,
      }),
    });

    const openAiJson = await openAiResponse.json().catch(() => ({}));
    if (!openAiResponse.ok) {
      const apiError = normalizeText(openAiJson?.error?.message) || 'OpenAI request failed.';
      return res.status(openAiResponse.status).json({ error: apiError });
    }

    const suggestion = getSuggestionText(openAiJson);
    if (!suggestion) {
      return res.status(502).json({ error: 'AI returned an empty suggestion.' });
    }

    return res.status(200).json({ suggestion });
  } catch (error) {
    console.error('Vercel AI suggestion error:', error);
    return res.status(500).json({ error: 'Failed to generate suggestion.' });
  }
}
