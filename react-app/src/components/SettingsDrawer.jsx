/* Settings drawer (Ant Design) */
import React from 'react';
import { Drawer, Segmented, Select, Switch, InputNumber, DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { Ico, ChannelGlyph } from './icons.jsx';

function ThresholdRow({ t, breaks, max, setBreaks }) {
  return (
    <div className="thr-row">
      <span className="thr-field"><i className="dot" style={{ background: 'var(--bad)' }} />{t.redBelow}
        <InputNumber size="small" min={0} max={max} value={breaks[0]} style={{ width: 72 }}
          onChange={(v) => setBreaks([Number(v) || 0, breaks[1]])} /></span>
      <span className="thr-field"><i className="dot" style={{ background: 'var(--good)' }} />{t.greenAbove}
        <InputNumber size="small" min={0} max={max} value={breaks[1]} style={{ width: 72 }}
          onChange={(v) => setBreaks([breaks[0], Number(v) || 0])} /></span>
    </div>
  );
}

export function SettingsDrawer(props) {
  const { t, open, onClose, displayMode, setDisplayMode, theme, setTheme, lang, setLang,
    dataStart, setDataStart, refreshRate, setRefreshRate, customDate, setCustomDate, showCustom, setShowCustom,
    channels, visibleChannels, toggleChannel, queueChannels, toggleQueueChannel,
    modes, setMode, thresholds, setThreshold, maxIvr, setMaxIvr } = props;
  const themes = [['light', t.themeLight, '#1c6fe0'], ['dark', t.themeDark, '#11192b'], ['midnight', t.themeMidnight, '#0a1f52'], ['teal', t.themeTeal, '#0f5f57']];
  const kpis = [['csl', t.csl, 100], ['nps', t.nps, 60], ['sat', t.satisfaction, 100]];
  const [sh, sm] = (dataStart || '00:00').split(':').map(Number);

  return (
    <Drawer title={t.settings} placement="right" width={440} open={open} onClose={onClose}
      getContainer={false} rootClassName="cc-settings-drawer" closeIcon={Ico.x(18)}>
      <div className="set-grp">
        <h4>{t.displayMode}</h4>
        <Segmented block value={displayMode} onChange={setDisplayMode}
          options={[{ label: t.modern, value: 'modern' }, { label: t.flat, value: 'flat' }]} />
      </div>
      <div className="set-grp">
        <h4>{t.theme}</h4>
        <div className="theme-grid">
          {themes.map(([k, label, sw]) => (
            <div key={k} className={'theme-opt' + (theme === k ? ' on' : '')} onClick={() => setTheme(k)}>
              <span className="theme-sw" style={{ background: sw }} /><span className="tn">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="set-grp">
        <h4>{t.language}</h4>
        <div className="set-row">
          <label>{t.language}</label>
          <Select value={lang} style={{ width: 170 }} onChange={setLang}
            options={[{ value: 'th', label: 'ไทย' }, { value: 'en', label: 'English' }, { value: 'zh', label: '中文' }, { value: 'lo', label: 'ລາວ' }]} />
        </div>
      </div>
      <div className="set-grp">
        <h4>{t.display}</h4>
        <div className="set-row"><label>{t.dataStart}</label>
          <TimePicker format="HH:mm" allowClear={false} style={{ width: 120 }}
            value={dayjs().hour(sh || 0).minute(sm || 0).second(0)}
            onChange={(d) => setDataStart(d ? d.format('HH:mm') : '00:00')} /></div>
        <div className="set-row"><label>{t.refreshRate}</label>
          <Select value={refreshRate} style={{ width: 120 }} onChange={setRefreshRate}
            options={[5, 10, 15, 30, 60].map((r) => ({ value: r, label: String(r) }))} /></div>
        <div className="set-row"><label>{t.compareDate}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch checked={showCustom} onChange={setShowCustom} />
            <DatePicker disabled={!showCustom} allowClear={false} style={{ width: 140 }}
              value={customDate ? dayjs(customDate) : null}
              onChange={(d) => setCustomDate(d ? d.format('YYYY-MM-DD') : '')} /></div></div>
      </div>
      <div className="set-grp">
        <h4>{t.kpiSettings}</h4>
        {kpis.map(([k, label, max]) => (
          <div className="kpi-set" key={k}>
            <div className="kpi-set-top">
              <span className="kpi-set-name">{label}</span>
              <Segmented size="small" value={modes[k]} onChange={(v) => setMode(k, v)}
                options={[{ label: t.gaugeType, value: 'gauge' }, { label: t.donutType, value: 'donut' }]} />
            </div>
            <ThresholdRow t={t} breaks={thresholds[k]} max={max} setBreaks={(b) => setThreshold(k, b)} />
          </div>
        ))}
      </div>
      <div className="set-grp">
        <h4>{t.ivrTitle}</h4>
        <div className="set-row"><label>{t.maxMenus}</label>
          <Select value={maxIvr} style={{ width: 120 }} onChange={setMaxIvr}
            options={[3, 4, 5, 6, 7, 8].map((n) => ({ value: n, label: String(n) }))} /></div>
      </div>
      <div className="set-grp">
        <h4>{t.channelsVisible}</h4>
        {channels.map((c) => (
          <div className="chan-toggle" key={c.key}>
            <span className="l"><span className="ci" style={{ background: c.color }}><ChannelGlyph ch={c.key} size={13} /></span>{t.channels[c.key]}</span>
            <Switch checked={visibleChannels.includes(c.key)} onChange={() => toggleChannel(c.key)} />
          </div>
        ))}
      </div>
      <div className="set-grp">
        <h4>{t.queueChannels}</h4>
        {channels.map((c) => (
          <div className="chan-toggle" key={c.key}>
            <span className="l"><span className="ci" style={{ background: c.color }}><ChannelGlyph ch={c.key} size={13} /></span>{t.channels[c.key]}</span>
            <Switch checked={queueChannels.includes(c.key)} onChange={() => toggleQueueChannel(c.key)} />
          </div>
        ))}
      </div>
    </Drawer>
  );
}
