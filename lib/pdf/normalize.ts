export const normalizeText = (value: string) =>
  value
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

export const containsNormalizedSubstring = (haystack: string, needle: string) => {
  const normalizedHaystack = normalizeText(haystack);
  const normalizedNeedle = normalizeText(needle);
  return normalizedHaystack.includes(normalizedNeedle);
};
