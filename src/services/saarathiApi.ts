// src/services/saarathiApi.ts
import { ENV } from '../utils/env'; // adjust path if needed

export type SaarathiResult = {
  sanskrit?: string;
  transliteration?: string;
  meaning?: string;
  chapter?: string;
  verse?: string;
};

export async function getSaarathiMessageFromBackend(
  query: string,
): Promise<SaarathiResult> {
  const res = await fetch(`${ENV.API_URL}/saarathi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: query }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Backend error ${res.status}: ${text}`);
  }

  // backend returns { success: true, results: { ... } } or similar
  const json = await res.json().catch(() => ({} as any));

  // normalize: 'results' may be object or text
  let payload: any = json.results ?? json;

  // If the provider returned a nested object with `text` or `message`, try to read it
  if (payload?.text && typeof payload.text === 'string') {
    // sometimes payload.text is a JSON string or raw text
    try {
      const parsed = JSON.parse(payload.text);
      payload = { ...parsed };
    } catch {
      // keep payload.text as fallback meaning
      payload = { meaning: payload.text };
    }
  }

  // If payload is a string that contains JSON, extract it
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      payload = { meaning: payload };
    }
  }

  // final safe shape
  return {
    sanskrit: payload.sanskrit ?? '',
    transliteration: payload.transliteration ?? '',
    meaning: payload.meaning ?? payload.text ?? '',
    chapter: payload.chapter ?? '',
    verse: payload.verse ?? '',
  };
}
