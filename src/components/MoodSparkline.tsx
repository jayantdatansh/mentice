interface Point {
  date: string;
  mood: number;
}

interface Props {
  data: Point[];
  width?: number;
  height?: number;
}

export function MoodSparkline({ data, width = 320, height = 80 }: Props) {
  if (data.length < 2) {
    return (
      <p className="text-sm text-slate-500 italic">
        Check in at least 2 days to see your trend.
      </p>
    );
  }

  const padX = 12;
  const padY = 8;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const xs = data.map((_, i) => padX + (i / (data.length - 1)) * innerW);
  const ys = data.map((d) => padY + innerH - ((d.mood - 1) / 4) * innerH);

  const polyline = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  const area = `M${xs[0]},${ys[0]} ` +
    xs.slice(1).map((x, i) => `L${x},${ys[i + 1]}`).join(" ") +
    ` L${xs[xs.length - 1]},${padY + innerH} L${xs[0]},${padY + innerH} Z`;

  // Y-axis labels
  const labels = [
    { y: padY, text: "5" },
    { y: padY + innerH / 2, text: "3" },
    { y: padY + innerH, text: "1" },
  ];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      aria-label="Mood trend over last 7 days"
      role="img"
      className="overflow-visible"
    >
      <title>Mood trend over last 7 days</title>
      {/* Grid lines */}
      {labels.map((l) => (
        <line key={l.y} x1={padX} x2={width - padX} y1={l.y} y2={l.y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 2" />
      ))}
      {/* Y labels */}
      {labels.map((l) => (
        <text key={`label-${l.y}`} x={padX - 4} y={l.y + 4} fontSize="9" fill="#94a3b8" textAnchor="end" aria-hidden="true">
          {l.text}
        </text>
      ))}
      {/* Area fill */}
      <path d={area} fill="url(#sparkGrad)" opacity="0.4" />
      {/* Line */}
      <polyline points={polyline} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="3" fill="#6366f1" stroke="#fff" strokeWidth="1.5" aria-label={`Day ${i + 1}: mood ${data[i].mood}`} />
      ))}
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
