const LT_HOSTS = [
  'https://translate.terraprint.co',
  'https://libretranslate.de',
  'https://lt.vern.cc',
];

const MYMEMORY_BASE = 'https://api.mymemory.translated.net';

async function ltTranslate(host, q, source, target) {
  const res = await fetch(`${host}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q, source, target, format: 'text' }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.translatedText || null;
}

async function ltDetect(host, text) {
  const res = await fetch(`${host}/detect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data : null;
}

async function mmTranslate(q, source, target) {
  const langpair = `${source === 'auto' ? 'autodetect' : source}|${target}`;
  const res = await fetch(`${MYMEMORY_BASE}/get?q=${encodeURIComponent(q)}&langpair=${langpair}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.responseStatus === 200 ? data.responseData.translatedText : null;
}

export async function detectLanguage(text) {
  for (const host of LT_HOSTS) {
    try {
      const result = await ltDetect(host, text);
      if (result) return result;
    } catch { /* try next */ }
  }
  // MyMemory fallback: returns detected language in translate response
  try {
    const res = await fetch(`${MYMEMORY_BASE}/get?q=${encodeURIComponent(text)}&langpair=autodetect|en`);
    if (res.ok) {
      const data = await res.json();
      if (data.detectedLanguage?.language) {
        return [{ language: data.detectedLanguage.language, confidence: (data.detectedLanguage.confidence || 80) / 100 }];
      }
    }
  } catch { /* ignore */ }
  return null;
}

export async function translate({ q, source = 'auto', target = 'en' }) {
  if (!q || !q.trim()) return '';

  let srcLang = source;
  if (source === 'auto') {
    const detected = await detectLanguage(q);
    srcLang = detected?.[0]?.language || 'en';
  }

  for (const host of LT_HOSTS) {
    try {
      const result = await ltTranslate(host, q, srcLang, target);
      if (result) return { translatedText: result, detectedLang: srcLang };
    } catch { /* try next */ }
  }

  try {
    const result = await mmTranslate(q, srcLang, target);
    if (result) return { translatedText: result, detectedLang: srcLang };
  } catch { /* ignore */ }

  return null;
}

export const LANGUAGES = [
  { code: 'ar', name: 'Arabic' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'zh', name: 'Chinese' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'en', name: 'English' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'id', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'es', name: 'Spanish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
];
