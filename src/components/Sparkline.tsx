import type { ReactNode } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
}

export default function Sparkline({
  data,
  width = 140,
  height = 42,
  positive = true,
}: SparklineProps): ReactNode {
  if (!data || data.length < 2) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center text-xs text-gray-500 font-mono"
      >
        —
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Generate SVG path points
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 6) + 3;
    const y = height - 4 - ((val - min) / range) * (height - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width - 3},${height} L 3,${height} Z`;

  const strokeColor = positive ? '#089981' : '#F23645';
  const gradId = `spark-grad-${positive ? 'up' : 'down'}-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible"
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
