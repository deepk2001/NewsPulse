"use client";

import { barLabel, chartFrame } from "../styles";

export type PlotItem = {
  label: string;
  value: number;
  color?: string;
};

const ink = "#171410";
const gold = "#b0893e";
const brick = "#9c3b2d";
const muted = "#6b5e51";

function formatTick(value: number) {
  if (Math.abs(value) >= 10) {
    return String(Math.round(value));
  }

  return value.toFixed(Math.abs(value) < 1 ? 2 : 1).replace(/\.0$/, "");
}

export function HorizontalBars({
  items,
  max,
  unit,
  layout = "card",
}: {
  items: PlotItem[];
  max?: number;
  unit?: string;
  layout?: "card" | "wide";
}) {
  const wide = layout === "wide";
  const peak = max ?? Math.max(...items.map((item) => Math.abs(item.value)), 1);
  const rowHeight = wide ? 24 : 28;
  const width = wide ? 880 : 320;
  const height = Math.max(items.length * rowHeight, rowHeight);
  const labelWidth = wide ? 148 : 108;
  const valueWidth = wide ? 36 : 44;
  const trackWidth = width - labelWidth - valueWidth;
  const barHeight = wide ? 10 : 12;
  const barY = wide ? 7 : 8;
  const fontSize = wide ? 10 : 11;

  return (
    <svg
      css={chartFrame}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={wide ? "xMinYMin meet" : "xMidYMid meet"}
      role="img"
      aria-label="Horizontal bar chart"
    >
      {items.map((item, index) => {
        const y = index * rowHeight;
        const barWidth = Math.max(2, (Math.abs(item.value) / peak) * trackWidth);

        return (
          <g key={item.label} transform={`translate(0 ${y})`}>
            <foreignObject x={0} y={2} width={labelWidth - 10} height={rowHeight - 2}>
              <div css={barLabel} title={item.label}>
                {item.label}
              </div>
            </foreignObject>
            <rect
              x={labelWidth}
              y={barY}
              width={trackWidth}
              height={barHeight}
              fill="#efe6d8"
            />
            <rect
              x={labelWidth}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={item.color ?? gold}
            />
            <text
              x={labelWidth + trackWidth + 8}
              y={18}
              fill={ink}
              fontSize={fontSize}
              fontWeight={700}
              fontFamily="inherit"
            >
              {formatTick(item.value)}
              {unit ?? ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ColumnChart({ items }: { items: PlotItem[] }) {
  const peak = Math.max(...items.map((item) => item.value), 1);
  const width = 320;
  const height = 140;
  const bottom = 24;
  const top = 12;
  const plotHeight = height - bottom - top;
  const gap = 16;
  const barWidth = Math.min(
    48,
    (width - gap * (items.length + 1)) / Math.max(items.length, 1),
  );

  return (
    <svg
      css={chartFrame}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Column chart"
    >
      <line
        x1={0}
        x2={width}
        y1={height - bottom}
        y2={height - bottom}
        stroke={ink}
        strokeWidth={1.5}
      />
      {items.map((item, index) => {
        const x = gap + index * (barWidth + gap);
        const barHeight = (item.value / peak) * plotHeight;

        return (
          <g key={item.label}>
            <rect
              x={x}
              y={height - bottom - barHeight}
              width={barWidth}
              height={barHeight}
              fill={item.color ?? gold}
            />
            <text
              x={x + barWidth / 2}
              y={height - bottom - barHeight - 4}
              textAnchor="middle"
              fill={ink}
              fontSize="11"
              fontWeight={700}
              fontFamily="inherit"
            >
              {formatTick(item.value)}
            </text>
            <text
              x={x + barWidth / 2}
              y={height - 6}
              textAnchor="middle"
              fill={muted}
              fontSize="11"
              fontFamily="inherit"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ToneGauge({ value }: { value: number }) {
  const min = -5;
  const max = 5;
  const width = 320;
  const height = 56;
  const left = 16;
  const right = 16;
  const track = width - left - right;
  const ratio = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const x = left + ratio * track;
  const gradientId = `tone-track-${Math.round(value * 1000)}`;

  return (
    <svg
      css={chartFrame}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Average tone ${formatTick(value)}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor={brick} />
          <stop offset="50%" stopColor={gold} />
          <stop offset="100%" stopColor="#0a5c26" />
        </linearGradient>
      </defs>
      <rect
        x={left}
        y={18}
        width={track}
        height={10}
        rx={5}
        fill={`url(#${gradientId})`}
      />
      <circle cx={x} cy={23} r={8} fill={ink} />
      <text x={left} y={48} fill={muted} fontSize="11" fontFamily="inherit">
        Negative
      </text>
      <text
        x={width / 2}
        y={48}
        textAnchor="middle"
        fill={ink}
        fontSize="12"
        fontWeight={700}
        fontFamily="inherit"
      >
        {formatTick(value)}
      </text>
      <text
        x={width - right}
        y={48}
        textAnchor="end"
        fill={muted}
        fontSize="11"
        fontFamily="inherit"
      >
        Positive
      </text>
    </svg>
  );
}
