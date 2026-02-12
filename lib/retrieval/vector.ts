export const embedText = (text: string, dims = 128): number[] => {
  const vector = new Array(dims).fill(0);
  for (let i = 0; i < text.length; i += 1) {
    vector[i % dims] += text.charCodeAt(i) / 255;
  }
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / norm);
};

export const cosineSimilarity = (a: number[], b: number[]) => {
  let dot = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) dot += a[i] * b[i];
  return dot;
};
