import React, { useMemo } from 'react';

interface BondingCurveGraphProps {
  totalRaised: number;
  softCap: number;
  hardCap: number;
}

/**
 * BondingCurveGraph — Pure SVG visualization of the $ARCA presale bonding curve.
 *
 * Curve: multiplier = 1 + 0.5 * (1 - totalRaised / hardCap)²
 *   - At 0 ETH    → 1.5x
 *   - At 6.25 ETH → 1.125x
 *   - At 12.5 ETH → 1.0x
 */
export default function BondingCurveGraph({
  totalRaised,
  softCap,
  hardCap,
}: BondingCurveGraphProps) {
  // ─── Layout ───────────────────────────────────────────────────
  const svgWidth = 600;
  const svgHeight = 340;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  // ─── Axis ranges ──────────────────────────────────────────────
  const xMin = 0;
  const xMax = hardCap;
  const yMin = 1.0;
  const yMax = 1.5;

  // ─── Helpers ──────────────────────────────────────────────────
  const multiplierAt = (x: number) => 1 + 0.5 * Math.pow(1 - x / hardCap, 2);
  const toSvgX = (val: number) => padding.left + ((val - xMin) / (xMax - xMin)) * chartW;
  const toSvgY = (val: number) => padding.top + chartH - ((val - yMin) / (yMax - yMin)) * chartH;

  // ─── Curve path ───────────────────────────────────────────────
  const curvePath = useMemo(() => {
    const steps = 200;
    const points: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * hardCap;
      const y = multiplierAt(x);
      const sx = toSvgX(x);
      const sy = toSvgY(y);
      points.push(`${i === 0 ? 'M' : 'L'}${sx.toFixed(2)},${sy.toFixed(2)}`);
    }
    return points.join(' ');
  }, [hardCap]);

  // ─── Filled area under curve ──────────────────────────────────
  const areaPath = useMemo(() => {
    const clampedRaised = Math.min(totalRaised, hardCap);
    if (clampedRaised <= 0) return '';
    const steps = 100;
    const points: string[] = [];
    // Start at bottom-left of the filled region
    points.push(`M${toSvgX(0).toFixed(2)},${toSvgY(yMin).toFixed(2)}`);
    // Trace up to the curve
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * clampedRaised;
      const y = multiplierAt(x);
      points.push(`L${toSvgX(x).toFixed(2)},${toSvgY(y).toFixed(2)}`);
    }
    // Close back down
    points.push(`L${toSvgX(clampedRaised).toFixed(2)},${toSvgY(yMin).toFixed(2)}`);
    points.push('Z');
    return points.join(' ');
  }, [totalRaised, hardCap]);

  // ─── Current position ─────────────────────────────────────────
  const clampedRaised = Math.min(totalRaised, hardCap);
  const currentMult = multiplierAt(clampedRaised);
  const dotX = toSvgX(clampedRaised);
  const dotY = toSvgY(currentMult);

  // ─── Soft cap line ────────────────────────────────────────────
  const softCapX = toSvgX(softCap);

  // ─── Grid lines ───────────────────────────────────────────────
  const xTicks = [0, 2.5, 5, 7.5, 10, 12.5];
  const yTicks = [1.0, 1.1, 1.2, 1.3, 1.4, 1.5];

  // ─── Label positioning for "YOU ARE HERE" ─────────────────────
  // Flip label side if dot is too close to right edge or top
  const labelOnLeft = dotX > padding.left + chartW * 0.65;
  const labelOnBottom = dotY < padding.top + chartH * 0.3;
  const labelOffsetX = labelOnLeft ? -14 : 14;
  const labelOffsetY = labelOnBottom ? 28 : -16;
  const labelAnchor = labelOnLeft ? 'end' : 'start';

  const colors = {
    gold: '#fbbf24',
    goldDim: 'rgba(251,191,36,0.15)',
    goldSoft: 'rgba(251,191,36,0.35)',
    gridLine: 'rgba(255,255,255,0.08)',
    axisLabel: 'rgba(255,255,255,0.5)',
    tickLabel: 'rgba(255,255,255,0.6)',
    white: '#ffffff',
    softCapLine: 'rgba(251,191,36,0.4)',
    dotGlow: 'rgba(251,191,36,0.6)',
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 640,
        margin: '0 auto',
        fontFamily: "'Inter', 'SF Pro', system-ui, -apple-system, sans-serif",
      }}
    >
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient for the filled area */}
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.gold} stopOpacity={0.25} />
            <stop offset="100%" stopColor={colors.gold} stopOpacity={0.02} />
          </linearGradient>
          {/* Glow filter for the dot */}
          <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ─── Grid lines ───────────────────────────────────────── */}
        {xTicks.map((val) => (
          <line
            key={`gx-${val}`}
            x1={toSvgX(val)}
            y1={padding.top}
            x2={toSvgX(val)}
            y2={padding.top + chartH}
            stroke={colors.gridLine}
            strokeWidth={1}
          />
        ))}
        {yTicks.map((val) => (
          <line
            key={`gy-${val}`}
            x1={padding.left}
            y1={toSvgY(val)}
            x2={padding.left + chartW}
            y2={toSvgY(val)}
            stroke={colors.gridLine}
            strokeWidth={1}
          />
        ))}

        {/* ─── Axes ─────────────────────────────────────────────── */}
        {/* X axis */}
        <line
          x1={padding.left}
          y1={padding.top + chartH}
          x2={padding.left + chartW}
          y2={padding.top + chartH}
          stroke={colors.axisLabel}
          strokeWidth={1}
        />
        {/* Y axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartH}
          stroke={colors.axisLabel}
          strokeWidth={1}
        />

        {/* ─── X axis labels ────────────────────────────────────── */}
        {xTicks.map((val) => (
          <text
            key={`xl-${val}`}
            x={toSvgX(val)}
            y={padding.top + chartH + 20}
            textAnchor="middle"
            fill={colors.tickLabel}
            fontSize={11}
          >
            {val}
          </text>
        ))}
        <text
          x={padding.left + chartW / 2}
          y={svgHeight - 6}
          textAnchor="middle"
          fill={colors.axisLabel}
          fontSize={12}
          fontWeight={500}
        >
          ETH Raised
        </text>

        {/* ─── Y axis labels ────────────────────────────────────── */}
        {yTicks.map((val) => (
          <text
            key={`yl-${val}`}
            x={padding.left - 10}
            y={toSvgY(val) + 4}
            textAnchor="end"
            fill={colors.tickLabel}
            fontSize={11}
          >
            {val.toFixed(1)}x
          </text>
        ))}
        <text
          x={14}
          y={padding.top + chartH / 2}
          textAnchor="middle"
          fill={colors.axisLabel}
          fontSize={12}
          fontWeight={500}
          transform={`rotate(-90, 14, ${padding.top + chartH / 2})`}
        >
          Multiplier
        </text>

        {/* ─── Filled area (totalRaised so far) ─────────────────── */}
        {areaPath && (
          <path d={areaPath} fill="url(#areaGradient)" />
        )}

        {/* ─── Soft cap dashed line ─────────────────────────────── */}
        <line
          x1={softCapX}
          y1={padding.top}
          x2={softCapX}
          y2={padding.top + chartH}
          stroke={colors.softCapLine}
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />
        <text
          x={softCapX}
          y={padding.top - 8}
          textAnchor="middle"
          fill={colors.goldSoft}
          fontSize={10}
          fontWeight={500}
        >
          Soft Cap ({softCap} ETH)
        </text>

        {/* ─── Curve line ───────────────────────────────────────── */}
        <path
          d={curvePath}
          fill="none"
          stroke={colors.gold}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ─── "YOU ARE HERE" dot ───────────────────────────────── */}
        {/* Outer glow */}
        <circle cx={dotX} cy={dotY} r={10} fill={colors.dotGlow} opacity={0.4} />
        {/* Pulse ring */}
        <circle
          cx={dotX}
          cy={dotY}
          r={8}
          fill="none"
          stroke={colors.gold}
          strokeWidth={1.5}
          opacity={0.5}
        >
          <animate
            attributeName="r"
            values="8;14;8"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;0;0.5"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Solid dot */}
        <circle cx={dotX} cy={dotY} r={5} fill={colors.gold} filter="url(#dotGlow)" />

        {/* ─── Label near dot ───────────────────────────────────── */}
        <text
          x={dotX + labelOffsetX}
          y={dotY + labelOffsetY}
          textAnchor={labelAnchor}
          fill={colors.white}
          fontSize={11}
          fontWeight={700}
        >
          YOU ARE HERE
        </text>
        <text
          x={dotX + labelOffsetX}
          y={dotY + labelOffsetY + 15}
          textAnchor={labelAnchor}
          fill={colors.gold}
          fontSize={12}
          fontWeight={600}
        >
          {currentMult.toFixed(3)}x
        </text>

        {/* ─── Vertical line from dot to x-axis ─────────────────── */}
        <line
          x1={dotX}
          y1={dotY + 6}
          x2={dotX}
          y2={padding.top + chartH}
          stroke={colors.gold}
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.3}
        />
      </svg>

      {/* ─── Rate text below graph ──────────────────────────────── */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          padding: '10px 16px',
          background: 'rgba(251,191,36,0.08)',
          borderRadius: 8,
          border: '1px solid rgba(251,191,36,0.15)',
        }}
      >
        <span
          style={{
            color: colors.gold,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          Current rate: {currentMult.toFixed(3)}x
        </span>
        <span
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 14,
            marginLeft: 8,
          }}
        >
          — contribute now before it drops
        </span>
      </div>
    </div>
  );
}
