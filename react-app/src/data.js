/* ============ Mock data + real-time generators ============ */
export const DASH = (function () {
  const rnd = (a, b) => a + Math.random() * (b - a);
  const ri = (a, b) => Math.round(rnd(a, b));

  // ---- channel definitions (order is default; user can reorder/hide) ----
  const CHANNELS = [
    { key: "voice",    color: "#16a34a", total: 2917, answered: 2762, abandoned: 155, overflow: 0, queue: 80,  sub: [50, 20, 10] },
    { key: "line",     color: "#06c755", total: 890,  answered: 795,  abandoned: 95,  overflow: 0, queue: 95,  sub: [60, 25, 10] },
    { key: "mail",     color: "#2b7fff", total: 420,  answered: 370,  abandoned: 50,  overflow: 0, queue: 50,  sub: [30, 15, 5] },
    { key: "pantip",   color: "#7c4dff", total: 210,  answered: 185,  abandoned: 25,  overflow: 0, queue: 25,  sub: [15, 10] },
    { key: "facebook", color: "#1877f2", total: 1150, answered: 1030, abandoned: 120, overflow: 0, queue: 120, sub: [80, 40] },
    { key: "traffy",   color: "#e8662a", total: 320,  answered: 280,  abandoned: 40,  overflow: 0, queue: 40,  sub: [30, 10] },
    { key: "twitter",  color: "#0f1419", total: 260,  answered: 230,  abandoned: 30,  overflow: 0, queue: 30,  sub: [20, 10] },
  ];

  // ---- voice agent KPIs ----
  const AGENTS = { talking: 16, available: 6, unavailable: 23 };

  // ---- avg times (seconds) ----
  const AVG = { talk: 650 /*00:10:50*/, wait: 28 /*00:00:28*/ };

  // ---- IVR menu counts ----
  const IVR = [2350, 1890, 1320, 980, 760, 520, 310, 220];

  // ---- gauge KPIs ----
  const GAUGE = { csl: 91.64, nps: 37, satisfaction: 91.34 };

  // ---- daily call-volume curve: two humps (morning + evening) over 24h ----
  // produce 'n' points; value 0..~480
  function dayCurve(points, peak1, peak2, scale, noise) {
    const out = [];
    for (let i = 0; i < points; i++) {
      const h = (i / (points - 1)) * 24;
      const g1 = Math.exp(-Math.pow(h - 9.5, 2) / (2 * 6.5));   // morning hump
      const g2 = Math.exp(-Math.pow(h - 18, 2) / (2 * 5));      // evening hump
      let v = (g1 * peak1 + g2 * peak2) * scale;
      // overnight near zero before 5am
      if (h < 5) v *= Math.max(0, (h - 1) / 4);
      v += rnd(-noise, noise);
      out.push(Math.max(0, Math.round(v)));
    }
    return out;
  }

  const POINTS = 49; // every 30 min, 00:00 -> 24:00
  const series = {
    yesterday: dayCurve(POINTS, 430, 470, 1.0, 18),
    today:     dayCurve(POINTS, 390, 360, 1.0, 14),
    custom:    dayCurve(POINTS, 470, 450, 1.0, 16),
  };

  function fmtClock(totalSec) {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = Math.floor(totalSec % 60);
    return [h, m, s].map((x) => String(x).padStart(2, "0")).join(":");
  }

  // mm:ss (no hours) for avg times
  function fmtMS(totalSec) {
    const m = Math.floor(totalSec / 60);
    const s = Math.floor(totalSec % 60);
    return [m, s].map((x) => String(x).padStart(2, "0")).join(":");
  }

  // tick: nudge live numbers a little to simulate real-time
  function tick(state) {
    const s = JSON.parse(JSON.stringify(state));
    // agents shuffle between states, keep ~45 total
    const delta = ri(-2, 2);
    s.agents.talking = Math.max(0, s.agents.talking + delta);
    s.agents.available = Math.max(0, s.agents.available + ri(-1, 1));
    s.agents.unavailable = Math.max(0, s.agents.unavailable - delta + ri(-1, 1));

    s.channels.forEach((c) => {
      const inc = ri(0, 6);
      c.total += inc;
      c.answered += Math.round(inc * rnd(0.8, 0.96));
      if (Math.random() < 0.25) c.abandoned += 1;
      // queue drifts
      c.queue = Math.max(0, c.queue + ri(-6, 6));
      const qsum = c.queue;
      // redistribute sub-queue proportionally
      const parts = c.sub.length;
      let left = qsum;
      c.sub = c.sub.map((_, idx) => {
        if (idx === parts - 1) return left;
        const v = Math.max(0, Math.round(qsum * (idx === 0 ? 0.55 : 0.3) + ri(-3, 3)));
        left -= v;
        return Math.max(0, v);
      });
      if (left < 0) c.sub[parts - 1] = 0;
    });

    s.avg.talk = Math.max(120, s.avg.talk + ri(-8, 8));
    s.avg.wait = Math.max(0, s.avg.wait + ri(-3, 3));

    s.gauge.csl = Math.min(99.9, Math.max(60, s.gauge.csl + rnd(-0.6, 0.6)));
    s.gauge.nps = Math.min(60, Math.max(15, s.gauge.nps + rnd(-0.4, 0.4)));
    s.gauge.satisfaction = Math.min(99.9, Math.max(70, s.gauge.satisfaction + rnd(-0.4, 0.4)));

    s.ivr = s.ivr.map((v) => Math.max(50, v + ri(-15, 25)));
    return s;
  }

  function initialState() {
    return {
      agents: { ...AGENTS },
      channels: JSON.parse(JSON.stringify(CHANNELS)),
      avg: { ...AVG },
      gauge: { ...GAUGE },
      ivr: [...IVR],
    };
  }

  // grow "today" line up to current time index; mask before startFraction
  function liveSeries(nowFraction, startFraction) {
    const cutoff = Math.round(nowFraction * (POINTS - 1));
    const startIdx = Math.round((startFraction || 0) * (POINTS - 1));
    const today = series.today.map((v, i) => (i >= startIdx && i <= cutoff ? v : null));
    return { yesterday: series.yesterday, today, custom: series.custom, points: POINTS, cutoff };
  }

  return {
    CHANNELS, POINTS,
    initialState, tick, fmtClock, fmtMS, liveSeries,
    regenSeries: function () {
      series.yesterday = dayCurve(POINTS, 430, 470, 1.0, 18);
      series.today = dayCurve(POINTS, 390, 360, 1.0, 14);
      series.custom = dayCurve(POINTS, 470, 450, 1.0, 16);
    },
  };
})();
