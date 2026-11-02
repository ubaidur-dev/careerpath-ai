export const SCALES = [
  { key: '4', label: '4.0', tab: 'CGPA', max: 4, step: 0.1, decimals: 2 },
  { key: '%', label: 'Percentage', tab: 'Percentage', max: 100, step: 1, decimals: 2 },
];

export const parseCgpa = (raw) => {
  const text = String(raw || '').trim();
  if (!text) return { scale: SCALES[0], value: '' };
  if (text.endsWith('%')) return { scale: SCALES[1], value: text.slice(0, -1).trim() };
  const [value, max] = text.split('/').map((p) => p.trim());
  const num = parseFloat(value);
  const scale = SCALES.find((s) => s.key === String(parseFloat(max)))
    || (num > 4 ? SCALES[1] : SCALES[0]);
  return { scale, value };
};
