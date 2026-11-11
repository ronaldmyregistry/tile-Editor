import LZString from 'lz-string';
import { TileFXBundle } from '../types/tilefx';

export const STORAGE_KEY = 'TileFX_Studio_Settings_v4';

// Safe UTF-8 Base64 encoding
export function safeBtoa(str: string): string {
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (_, p1) {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  } catch {
    return btoa(str);
  }
}

// Safe UTF-8 Base64 decoding
export function safeAtob(b64: string): string {
  try {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(b64), function (c: string) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  } catch {
    return atob(b64);
  }
}

export function encodeBundle(bundle: TileFXBundle): string {
  const json = JSON.stringify(bundle);
  // Compress using LZString for compact URL
  const compressed = LZString.compressToEncodedURIComponent(json);
  return compressed;
}

export function decodeBundle(encodedStr: string): TileFXBundle | null {
  if (!encodedStr) return null;

  // 1. Try LZString decompression
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encodedStr);
    if (decompressed) {
      const parsed = JSON.parse(decompressed);
      if (parsed && Array.isArray(parsed.themes)) {
        return parsed as TileFXBundle;
      }
    }
  } catch {
    // Continue to next attempt
  }

  // 2. Try raw safeAtob Base64 decoding
  try {
    const decoded = safeAtob(decodeURIComponent(encodedStr));
    if (decoded) {
      const parsed = JSON.parse(decoded);
      if (parsed && Array.isArray(parsed.themes)) {
        return parsed as TileFXBundle;
      }
    }
  } catch {
    // Continue to next attempt
  }

  // 3. Try standard JSON parse if passed directly
  try {
    const parsed = JSON.parse(decodeURIComponent(encodedStr));
    if (parsed && Array.isArray(parsed.themes)) {
      return parsed as TileFXBundle;
    }
  } catch {
    // Fail gracefully
  }

  return null;
}

// Save bundle to backend storage /api/share
export async function saveBundleToServer(bundle: TileFXBundle): Promise<string | null> {
  try {
    const response = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bundle),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    return data.id || null;
  } catch (err) {
    console.warn('Could not save to /api/share server:', err);
    return null;
  }
}

// Load bundle from backend storage /api/share/:id
export async function loadBundleFromServer(shareId: string): Promise<TileFXBundle | null> {
  try {
    const response = await fetch(`/api/share/${encodeURIComponent(shareId)}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.success && data.bundle) {
      return data.bundle as TileFXBundle;
    }
    return null;
  } catch (err) {
    console.warn('Failed to load from server /api/share:', err);
    return null;
  }
}

/**
 * Generates the clean base URL using the active workspace origin.
 */
export function getCleanBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin + window.location.pathname;
}

export function buildShareUrl(
  bundle: TileFXBundle,
  shareId?: string | null,
  previewMode: boolean = true
): string {
  const baseUrl = getCleanBaseUrl();
  const modeParam = previewMode ? 'mode=preview' : 'mode=edit';

  if (shareId) {
    // Clean, short cloud review link (~75 chars)
    return `${baseUrl}?share=${encodeURIComponent(shareId)}&${modeParam}`;
  }

  // Fallback purely hash-based URL only if server share was not generated
  const compactHash = encodeBundle(bundle);
  return `${baseUrl}?${modeParam}#preset=${compactHash}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback using textarea
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch {
    return false;
  }
}
