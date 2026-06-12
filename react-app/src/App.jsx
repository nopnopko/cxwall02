import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ConfigProvider } from 'antd';
import { THEME_CFG } from './theme.js';
import { DASH } from './data.js';
import { I18N } from './i18n.js';
import { Header, KpiBar, ChannelRow, QueuePanel, AvgCards, IvrPanel } from './components/Panels.jsx';
import { ChartPanel, GaugeRow } from './components/Kpis.jsx';
import { SettingsDrawer } from './components/SettingsDrawer.jsx';
import { Ico } from './components/icons.jsx';

const ALL_KEYS = DASH.CHANNELS.map((c) => c.key);
const LS = (k, def) => { try { const v = localStorage.getItem('cc_' + k); return v == null ? def : JSON.parse(v); } catch { return def; } };
const save = (k, v) => { try { localStorage.setItem('cc_' + k, JSON.stringify(v)); } catch { /* ignore */ } };

export default function App() {
  const [lang, setLangS] = useState(() => LS('lang', 'th'));
  const [theme, setThemeS] = useState(() => LS('theme', 'light'));
  const [displayMode, setDisplayModeS] = useState(() => LS('displayMode', 'modern'));
  const [order, setOrder] = useState(() => { const o = LS('order', ALL_KEYS); return ALL_KEYS.every((k) => o.includes(k)) ? o : ALL_KEYS; });
  const [visibleChannels, setVisible] = useState(() => LS('visible', ALL_KEYS));
  const [queueChannels, setQueue] = useState(() => LS('queueCh', ALL_KEYS));
  const [dataStart, setDataStartS] = useState(() => LS('dataStart', '00:00'));
  const [refreshRate, setRefreshS] = useState(() => LS('refresh', 15));
  const [customDate, setCustomDateS] = useState(() => LS('customDate', '2025-05-20'));
  const [showCustom, setShowCustomS] = useState(() => LS('showCustom', true));
  const [showYesterday, setShowYestS] = useState(() => LS('showYest', true));
  const [showToday, setShowTodayS] = useState(() => LS('showToday', true));
  const [modes, setModesS] = useState(() => LS('modes', { csl: 'gauge', nps: 'gauge', sat: 'donut' }));
  const [thresholds, setThresholdsS] = useState(() => LS('thresholds', { csl: [80, 85], nps: [29, 37], sat: [80, 90] }));
  const [maxIvr, setMaxIvrS] = useState(() => LS('maxIvr', 8));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chromeHidden, setChromeHidden] = useState(false);

  const [state, setState] = useState(() => DASH.initialState());
  const [now, setNow] = useState(() => new Date());
  const t = I18N[lang];

  const setLang = (v) => { setLangS(v); save('lang', v); };
  const setTheme = (v) => { setThemeS(v); save('theme', v); };
  const setDisplayMode = (v) => { setDisplayModeS(v); save('displayMode', v); };
  const setDataStart = (v) => { setDataStartS(v); save('dataStart', v); };
  const setRefreshRate = (v) => { setRefreshS(v); save('refresh', v); };
  const setCustomDate = (v) => { setCustomDateS(v); save('customDate', v); };
  const setShowCustom = (v) => { setShowCustomS(v); save('showCustom', v); };
  const setShowYesterday = (v) => { setShowYestS(v); save('showYest', v); };
  const setShowToday = (v) => { setShowTodayS(v); save('showToday', v); };
  const setMaxIvr = (v) => { setMaxIvrS(v); save('maxIvr', v); };
  const setMode = (k, v) => setModesS((prev) => { const n = { ...prev, [k]: v }; save('modes', n); return n; });
  const setThreshold = (k, b) => setThresholdsS((prev) => { const n = { ...prev, [k]: b }; save('thresholds', n); return n; });
  const reorder = (a) => { setOrder(a); save('order', a); };
  const toggleChannel = (k) => setVisible((prev) => { const next = prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]; save('visible', next); return next; });
  const toggleQueueChannel = (k) => setQueue((prev) => { const next = prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]; save('queueCh', next); return next; });

  useEffect(() => { document.getElementById('board').setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => { document.getElementById('board').setAttribute('data-style', displayMode); }, [displayMode]);
  useEffect(() => { document.body.setAttribute('data-lang', lang); document.documentElement.lang = lang; }, [lang]);
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => { const id = setInterval(() => setState((s) => DASH.tick(s)), refreshRate * 1000); return () => clearInterval(id); }, [refreshRate]);
  useEffect(() => {
    const board = document.getElementById('board');
    const fit = () => { const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080); board.style.transformOrigin = 'center center'; board.style.transform = `scale(${s})`; };
    fit(); window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit);
  }, []);

  useEffect(() => {
    const onFsChange = () => { if (!document.fullscreenElement) setChromeHidden(false); };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);
  useEffect(() => { document.getElementById('board').setAttribute('data-chrome', chromeHidden ? 'hidden' : 'shown'); }, [chromeHidden]);

  const toggleFullscreen = () => { if (!document.fullscreenElement) { document.documentElement.requestFullscreen?.(); } setChromeHidden(true); };
  const exitChrome = () => { if (document.fullscreenElement) { document.exitFullscreen?.(); } setChromeHidden(false); };

  const nowFrac = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400;
  const [sh, sm] = dataStart.split(':').map(Number);
  const startFrac = ((sh || 0) * 3600 + (sm || 0) * 60) / 86400;
  const series = DASH.liveSeries(nowFrac, startFrac);
  const shownChannels = state.channels.filter((c) => visibleChannels.includes(c.key));
  const onRefresh = () => { DASH.regenSeries(); setState((s) => DASH.tick(s)); };

  return (
    <ConfigProvider getPopupContainer={() => document.getElementById('board') || document.body} theme={{ ...THEME_CFG[theme], token: { ...THEME_CFG[theme].token, fontFamily: 'inherit', borderRadius: 8 } }}>
      {!chromeHidden && (
        <Header t={t} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} now={now}
          openSettings={() => setSettingsOpen(true)} toggleFullscreen={toggleFullscreen} />
      )}
      <KpiBar t={t} agents={state.agents} />
      <ChannelRow t={t} channels={shownChannels} order={order} onReorder={reorder} />
      <div className="main">
        <div className="col-left">
          <QueuePanel t={t} channels={state.channels} order={order} queueChannels={queueChannels} flat={displayMode === 'flat'} />
        </div>
        <div className="col-right">
          <div className="charts-row">
            <ChartPanel t={t} series={series} refreshRate={refreshRate} setRefreshRate={setRefreshRate}
              showYesterday={showYesterday} setShowYesterday={setShowYesterday}
              showToday={showToday} setShowToday={setShowToday}
              showCustom={showCustom} setShowCustom={setShowCustom} customDate={customDate} setCustomDate={setCustomDate}
              onRefresh={onRefresh} />
            <IvrPanel t={t} ivr={state.ivr} maxIvr={maxIvr} />
          </div>
          <div className="bottom-row">
            <AvgCards t={t} avg={state.avg} />
            <GaugeRow t={t} gauge={state.gauge} modes={modes} thresholds={thresholds} />
          </div>
        </div>
      </div>
      <SettingsDrawer t={t} open={settingsOpen} onClose={() => setSettingsOpen(false)}
        displayMode={displayMode} setDisplayMode={setDisplayMode}
        theme={theme} setTheme={setTheme} lang={lang} setLang={setLang}
        dataStart={dataStart} setDataStart={setDataStart}
        refreshRate={refreshRate} setRefreshRate={setRefreshRate}
        customDate={customDate} setCustomDate={setCustomDate}
        showCustom={showCustom} setShowCustom={setShowCustom}
        channels={state.channels} visibleChannels={visibleChannels} toggleChannel={toggleChannel}
        queueChannels={queueChannels} toggleQueueChannel={toggleQueueChannel}
        modes={modes} setMode={setMode} thresholds={thresholds} setThreshold={setThreshold}
        maxIvr={maxIvr} setMaxIvr={setMaxIvr} />
      {chromeHidden && createPortal(
        <button className="fs-restore" onClick={exitChrome} title={t.restoreMenu} aria-label={t.restoreMenu}>
          {Ico.x(20)}
        </button>, document.body)}
    </ConfigProvider>
  );
}
