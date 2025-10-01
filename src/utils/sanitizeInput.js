/**
 * Remove punctuation/control characters and whitespace.
 * Uses Unicode property escapes if available, otherwise falls back.
 * @param {string} str
 * @returns {string}
 */
export function sanitize(str) {
  if (!str) return "";
  try {
    // use Unicode-aware regex when available
    return str.replace(/[\p{P}\p{C}\s]/gu, "").toLowerCase();
  } catch {
    // fallback
    return str.replace(/[\W_]/g, "").toLowerCase();
  }
}
