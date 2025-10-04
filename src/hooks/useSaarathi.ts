// src/hooks/useSaarathi.ts
import { useState } from 'react';
import {
  getSaarathiMessageFromBackend,
  SaarathiResult,
} from '../services/saarathiApi';

type Msg = {
  id: string;
  role: 'user' | 'saarathi';
  text: string;
  time?: string;
};

export function useSaarathi() {
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);

  async function askSaarathi(query: string): Promise<Msg> {
    setLoading(true);
    setTyping(true);

    try {
      const res = await getSaarathiMessageFromBackend(query);

      // Build a nice readable text output for the bubble
      // Prefer showing Sanskrit, then transliteration, then meaning
      const lines: string[] = [];

      if (res.sanskrit && res.sanskrit.trim()) {
        lines.push(res.sanskrit.trim());
      }
      if (res.transliteration && res.transliteration.trim()) {
        lines.push(res.transliteration.trim());
      }
      if (res.meaning && res.meaning.trim()) {
        lines.push('');
        lines.push(res.meaning.trim());
      }
      if (res.chapter || res.verse) {
        const chapverse = `(${res.chapter || '?'}${
          res.verse ? `:${res.verse}` : ''
        })`;
        lines.push('');
        lines.push(`Source ${chapverse}`);
      }

      const text = lines.join('\n');

      return {
        id: `${Date.now()}_a`,
        role: 'saarathi',
        text: text || "Sorry — I couldn't find a suitable shloka.",
        time: new Date().toISOString(),
      };
    } catch (err) {
      console.error('useSaarathi error:', err);
      return {
        id: `${Date.now()}_err`,
        role: 'saarathi',
        text: 'Connection error — please check your backend.',
        time: new Date().toISOString(),
      };
    } finally {
      setLoading(false);
      setTyping(false);
    }
  }

  return { askSaarathi, loading, typing };
}
