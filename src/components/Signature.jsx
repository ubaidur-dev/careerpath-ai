export default function Signature({ width = 210 }) {
  return (
    <svg width={width} height={Math.round(width * 64 / 210)} viewBox="0 0 210 64" fill="none" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Signature">
      <path d="M12 44 C 16 22, 30 10, 36 18 C 42 26, 26 46, 20 50 C 14 54, 22 36, 34 34 C 44 32, 44 44, 50 44 C 56 44, 58 30, 62 30 C 66 30, 62 44, 68 44 C 74 44, 76 26, 82 24 C 86 23, 84 40, 90 42 C 96 44, 100 30, 106 30 C 112 30, 108 44, 116 44 C 124 44, 128 20, 134 14 C 138 10, 140 18, 136 30 C 132 42, 134 46, 142 42 C 150 38, 154 30, 160 32 C 166 34, 162 44, 170 42 C 178 40, 186 30, 196 28" />
      <path d="M30 56 C 80 50, 140 49, 200 46" strokeWidth="1.6" />
    </svg>
  );
}
