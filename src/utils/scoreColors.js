export const getScoreColorClass = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'text-gray-400';
  const score = Number(value);
  if (score >= 90) return 'text-[#05A660]';
  if (score >= 80) return 'text-[#0047FF]';
  if (score >= 70) return 'text-[#E88B00]';
  return 'text-red-500';
};
