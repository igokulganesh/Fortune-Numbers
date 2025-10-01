import { sanitize } from "./sanitizeInput";
import { ALPHABET } from "../constants/alphabet";

/**
 * Compute the numerological number for a string.
 * Keeps the original logic intact: digits are summed, letters mapped via ALPHABET.
 * @param {string} input
 * @returns {number}
 */
export function calculateNumber(input) {
  if (typeof input !== "string") return 0;

  const cleaned = sanitize(input).replace(/\s+/g, "");
  let sum = 0;

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];

    if (!isNaN(ch)) {
      // numeric character
      sum += Number(ch);
    } else {
      // alphabetic character mapped to ALPHABET
      const index = ch.charCodeAt(0) - "a".charCodeAt(0);
      if (index >= 0 && index < ALPHABET.length) {
        sum += ALPHABET[index];
      }
    }
  }

  return sum;
}
