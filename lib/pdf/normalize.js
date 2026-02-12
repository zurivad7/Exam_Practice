export const normalizeText = (value) =>
  value
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

export const containsNormalizedSubstring = (haystack, needle) => normalizeText(haystack).includes(normalizeText(needle));
