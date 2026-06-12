/* SVG LineChart (custom) + AntD Progress gauge/donut */
import React, { useRef, useState, useLayoutEffect } from 'react';
import { Progress } from 'antd';

function useMeasure() {
  const ref = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);
  return [ref, size];
}

function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function LineChart({ series, t, showYesterday = true, showToday = true, showCustom }) {
  const [ref, { w, h }] = useMeasure();
  const padL = 52, padR = 16, padT = 12, padB = 36;
  const plotW = Math.max(10, w - padL - padR);
  const plotH = Math.max(10, h - padT - padB);
  const N = series.points;
  const maxY = 600;
  const yTicks = [0, 100, 200, 300, 400, 500, 600];
  const X = (i) => padL + (i / (N - 1)) * plotW;
  const Y = (v) => padT + plotH - (v / maxY) * plotH;
  const toPts = (arr) => arr.map((v, i) => (v == null ? null : { x: X(i), y: Y(v) })).filter(Boolean);
  const yPts = toPts(series.yesterday);
  const tPts = toPts(series.today);
  const cPts = toPts(series.custom);
  let areaD = '';
  if (tPts.length > 1) {
    areaD = smoothPath(tPts) + ` L ${tPts[tPts.length - 1].x.toFixed(1)} ${Y(0)} L ${tPts[0].x.toFixed(1)} ${Y(0)} Z`;
  }
  const nowX = series.cutoff != null ? X(series.cutoff) : null;

  return (
    <div className="chart-box" ref={ref} style={{ flex: 1, minHeight: 0, position: 'relative' }}>
      {w > 0 && (
        <svg width={w} height={h} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="todayFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--talk)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--talk)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {yTicks.map((v) => (
            <g key={v}>
              <line x1={padL} y1={Y(v)} x2={padL + plotW} y2={Y(v)} stroke="var(--grid)" strokeWidth="1" />
              <text x={padL - 9} y={Y(v) + 4} textAnchor="end" fontSize="11.5" fontWeight="600" fill="var(--text-dim)">{v}</text>
            </g>
          ))}
          {Array.from({ length: 13 }).map((_, k) => {
            const i = k * 4;
            const hh = String(k * 2).padStart(2, '0');
            return (
              <g key={k}>
                <line x1={X(i)} y1={padT + plotH} x2={X(i)} y2={padT + plotH + 4} stroke="var(--axis)" strokeWidth="1" />
                <text x={X(i)} y={padT + plotH + 18} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="var(--text-dim)">{hh}.00</text>
              </g>
            );
          })}
          <text x={padL - 38} y={padT + plotH / 2} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--text-2)"
            transform={`rotate(-90 ${padL - 38} ${padT + plotH / 2})`}>{t.yAxis}</text>
          <text x={padL + plotW} y={h - 2} textAnchor="end" fontSize="11.5" fontWeight="700" fill="var(--text-2)">{t.xAxis}</text>
          {nowX != null && (
            <line x1={nowX} y1={padT} x2={nowX} y2={padT + plotH} stroke="var(--talk)" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
          )}
          {showYesterday && <path d={smoothPath(yPts)} fill="none" stroke="var(--axis)" strokeWidth="2.2" strokeDasharray="7 5" strokeLinecap="round" opacity="0.85" />}
          {showCustom && <path d={smoothPath(cPts)} fill="none" stroke="var(--avail)" strokeWidth="2.6" strokeLinecap="round" />}
          {showToday && <path d={areaD} fill="url(#todayFill)" />}
          {showToday && <path d={smoothPath(tPts)} fill="none" stroke="var(--talk)" strokeWidth="3" strokeLinecap="round" />}
          {showToday && tPts.length > 0 && (
            <circle cx={tPts[tPts.length - 1].x} cy={tPts[tPts.length - 1].y} r="4.5" fill="var(--talk)" stroke="var(--panel)" strokeWidth="2" />
          )}
        </svg>
      )}
    </div>
  );
}

export function resolveColor(c) {
  if (typeof c === 'string' && c.startsWith('var(')) {
    const name = c.slice(4, -1).trim();
    const board = document.getElementById('board');
    if (board) {
      const v = getComputedStyle(board).getPropertyValue(name).trim();
      if (v) return v;
    }
  }
  return c;
}

const Readout = ({ display, sub }) => (
  <div className="prog-readout">
    <div className="gv">{display}</div>
    {sub && <div className="gsub">{sub}</div>}
  </div>
);

export function Gauge({ value, min = 0, max = 100, color, display, sub, size = 168 }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <div className="gauge-prog">
      <Progress type="dashboard" gapDegree={140} percent={pct} size={size} strokeWidth={9}
        strokeColor={resolveColor(color)} trailColor={resolveColor('var(--panel-2)')}
        format={() => <Readout display={display} sub={sub} />} />
    </div>
  );
}

export function Donut({ value, max = 100, color, display, sub, size = 168 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="donut-prog">
      <Progress type="circle" percent={pct} size={size} strokeWidth={8} strokeLinecap="round"
        strokeColor={resolveColor(color)} trailColor={resolveColor('var(--panel-2)')}
        format={() => <Readout display={display} sub={sub} />} />
    </div>
  );
}
