import type { Question } from "@/lib/data";

// Render a road sign for the quiz / lesson screens.
export function RoadSign({ kind, label, size = 140 }: { kind: NonNullable<Question["signKind"]>; label: string; size?: number }) {
  if (kind === "stop") {
    const r = size / 2;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <polygon
          points={Array.from({ length: 8 }, (_, i) => {
            const a = (Math.PI / 4) * i - Math.PI / 8;
            return `${(r + r * 0.95 * Math.cos(a)).toFixed(1)},${(r + r * 0.95 * Math.sin(a)).toFixed(1)}`;
          }).join(" ")}
          fill="oklch(0.55 0.22 25)" stroke="white" strokeWidth="4"
        />
        <text x={r} y={r + 8} textAnchor="middle" fill="white" fontWeight="900" fontSize={size * 0.26}>STOP</text>
      </svg>
    );
  }
  if (kind === "give-way") {
    return (
      <svg width={size} height={size} viewBox="0 0 140 140">
        <polygon points="70,130 132,18 8,18" fill="white" stroke="oklch(0.55 0.22 25)" strokeWidth="9" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "regulatory") {
    return (
      <svg width={size} height={size} viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="58" fill="white" stroke="oklch(0.55 0.22 25)" strokeWidth="10" />
        <text x="70" y="92" textAnchor="middle" fill="black" fontWeight="900" fontSize="58">{label}</text>
      </svg>
    );
  }
  // warning
  return (
    <svg width={size} height={size} viewBox="0 0 140 140">
      <polygon points="70,8 132,124 8,124" fill="white" stroke="oklch(0.55 0.22 25)" strokeWidth="9" strokeLinejoin="round" />
      <text x="70" y="100" textAnchor="middle" fill="black" fontWeight="900" fontSize="58">{label}</text>
    </svg>
  );
}
