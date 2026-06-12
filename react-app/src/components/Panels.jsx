/* Header, KpiBar, ChannelRow, QueuePanel, AvgCards, IvrPanel */
import React, { useState } from 'react';
import { Dropdown, Button, Avatar, Tooltip, Statistic, Progress, Collapse } from 'antd';
import { Ico, ChannelBadge } from './icons.jsx';
import { resolveColor } from './Charts.jsx';
import { DASH } from '../data.js';

/* ---------- HEADER ---------- */
export function Header({ t, lang, setLang, theme, setTheme, now, openSettings, toggleFullscreen }) {
  const langs = [['th', 'ไทย'], ['en', 'English'], ['zh', '中文'], ['lo', 'ລາວ']];
  const themes = [['light', t.themeLight, '#1c6fe0'], ['dark', t.themeDark, '#0f1626'], ['midnight', t.themeMidnight, '#0a1f52'], ['teal', t.themeTeal, '#0f5f57']];
  const time = DASH.fmtClock(now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds());
  const dateStr = `${now.getDate()} ${t.monthsShort[now.getMonth()]} ${now.getFullYear() + t.yearOffset}`;
  const checkmark = <span style={{ marginLeft: 'auto', display: 'flex', color: 'var(--talk)' }}>{Ico.check(15)}</span>;

  const langItems = langs.map(([k, label]) => ({
    key: k,
    label: <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 150, fontWeight: lang === k ? 700 : 500 }}>{label}{lang === k && checkmark}</span>,
  }));
  const themeItems = themes.map(([k, label, sw]) => ({
    key: k,
    label: (<span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 160, fontWeight: theme === k ? 700 : 500 }}>
      <span className="dd-sw" style={{ background: sw }} /><span>{label}</span>{theme === k && checkmark}</span>),
  }));
  const profileItems = [
    { key: 'profile', icon: Ico.user(16), label: t.profile },
    { key: 'settings', icon: Ico.gear(16), label: t.settings },
    { type: 'divider' },
    { key: 'logout', icon: Ico.x(16), label: t.logout, danger: true },
  ];

  return (
    <header className="hd">
      <div className="hd-brand">
        <div className="hd-logo"><image-slot id="nhso-logo" shape="rounded" radius="10" placeholder="โลโก้"></image-slot></div>
        <div className="hd-title">{t.appTitle}<small>{t.appSub}</small></div>
      </div>
      <div className="hd-spacer" />
      <div className="hd-live"><span className="hd-dot" />{t.live}</div>
      <div className="hd-clock">
        <span style={{ opacity: .7, display: 'flex' }}>{Ico.clock(18)}</span>
        <span className="hd-time mono">{time}</span>
      </div>
      <div className="hd-date">{Ico.calendar(16)}<span>{dateStr}</span></div>
      <div className="hd-grp">
        <Dropdown trigger={['click']} placement="bottomRight" menu={{ items: langItems, onClick: ({ key }) => setLang(key), selectedKeys: [lang] }}>
          <Tooltip title={t.language}><Button className="hd-icobtn" type="text" icon={Ico.globe(18)} /></Tooltip>
        </Dropdown>
        <Dropdown trigger={['click']} placement="bottomRight" menu={{ items: themeItems, onClick: ({ key }) => setTheme(key), selectedKeys: [theme] }}>
          <Tooltip title={t.theme}><Button className="hd-icobtn" type="text" icon={Ico.palette(18)} /></Tooltip>
        </Dropdown>
        <Tooltip title={t.fullscreen}><Button className="hd-icobtn" type="text" icon={Ico.expand(18)} onClick={toggleFullscreen} /></Tooltip>
        <Tooltip title={t.settings}><Button className="hd-icobtn" type="text" icon={Ico.gear(18)} onClick={openSettings} /></Tooltip>
        <Dropdown trigger={['click']} placement="bottomRight" menu={{ items: profileItems, onClick: ({ key }) => { if (key === 'settings') openSettings(); } }}>
          <div className="hd-profile">
            <Avatar size={30} className="hd-avatar">{t.profileName.slice(0, 1)}</Avatar>
            <div><div className="nm">{t.profileName}</div><div className="ro">{t.profileRole}</div></div>
            {Ico.chevron(15)}
          </div>
        </Dropdown>
      </div>
    </header>
  );
}

/* ---------- KPI BAR ---------- */
export function KpiBar({ t, agents }) {
  const cards = [
    { k: 'talk', cls: 'talk', ico: Ico.talk(26), label: t.talking, val: agents.talking, color: 'var(--talk)' },
    { k: 'avail', cls: 'avail', ico: Ico.user(26), label: t.available, val: agents.available, color: 'var(--avail)' },
    { k: 'unavail', cls: 'unavail', ico: Ico.userOff(26), label: t.unavailable, val: agents.unavailable, color: 'var(--unavail)' },
  ];
  return (
    <div className="kpibar">
      {cards.map((c) => (
        <div key={c.k} className={'kpi ' + c.cls}>
          <span className="kpi-ico">{c.ico}</span>
          <span className="kpi-label">{c.label}</span>
          <span className="kpi-val"><Statistic value={c.val} valueStyle={{ fontSize: 56, fontWeight: 800, lineHeight: 1, color: c.color }} /></span>
        </div>
      ))}
    </div>
  );
}

/* ---------- CHANNEL ROW (draggable) ---------- */
export function ChannelRow({ t, channels, order, onReorder }) {
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);
  const visible = order.filter((k) => channels.find((c) => c.key === k));
  const byKey = Object.fromEntries(channels.map((c) => [c.key, c]));

  const handleDrop = (target) => {
    if (!drag || drag === target) { setDrag(null); setOver(null); return; }
    const arr = [...order];
    const from = arr.indexOf(drag), to = arr.indexOf(target);
    arr.splice(to, 0, arr.splice(from, 1)[0]);
    onReorder(arr);
    setDrag(null); setOver(null);
  };

  const cell = (cls, color, label, val, sep) => (
    <div className={'chk-cell ' + cls}>
      <span className="lab">{label}</span>
      <Statistic value={val} groupSeparator={sep ? ',' : ''} valueStyle={{ color }} />
    </div>
  );

  return (
    <div className="chrow" style={{ gridTemplateColumns: `repeat(${visible.length},1fr)` }}>
      {visible.map((key) => {
        const c = byKey[key];
        return (
          <div key={key} className={'chcard' + (drag === key ? ' dragging' : '') + (over === key ? ' dragover' : '')}
            draggable
            onDragStart={() => setDrag(key)}
            onDragOver={(e) => { e.preventDefault(); setOver(key); }}
            onDragLeave={() => setOver((o) => (o === key ? null : o))}
            onDrop={() => handleDrop(key)}
            onDragEnd={() => { setDrag(null); setOver(null); }}>
            <div className="chcard-top">
              <ChannelBadge ch={c.key} color={c.color} size={32} glyph={17} />
              <span className="chcard-name">{t.channels[c.key]}</span>
              <span className="chcard-grip">{Ico.grip(15)}</span>
            </div>
            <div className="chcard-kpis">
              {cell('total', 'var(--text)', t.total, c.total, true)}
              {cell('answered', 'var(--c-answered)', t.answered, c.answered, true)}
              {cell('abandoned', 'var(--c-abandoned)', t.abandoned, c.abandoned, false)}
              {cell('overflow', 'var(--text-2)', t.overflow, c.overflow, false)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- QUEUE PANEL ---------- */
export function QueuePanel({ t, channels, order, queueChannels, flat }) {
  const byKey = Object.fromEntries(channels.map((c) => [c.key, c]));
  const keys = order.filter((k) => byKey[k] && queueChannels.includes(k));
  return (
    <div className="panel queue-panel">
      <div className="panel-hd">
        <span style={{ color: 'var(--talk)', display: 'flex' }}>{Ico.queue(19)}</span>
        <h3>{t.queueTitle}</h3><span className="sub">· {t.queueSub}</span>
      </div>
      <div className="panel-body">
        <div className={'queue-scroll' + (flat ? ' flat' : '')}>
          {flat ? (
            <Collapse ghost defaultActiveKey={keys} className="q-collapse"
              items={keys.map((key) => {
                const c = byKey[key];
                const subLabels = t.qsub[key] || [];
                return {
                  key,
                  label: (
                    <div className="q-head">
                      <ChannelBadge ch={key} color={c.color} size={26} radius={13} glyph={14} />
                      <span className="q-name">{t.channels[key]} = <b className="num">{c.queue}</b></span>
                    </div>
                  ),
                  children: (
                    <ul className="q-bullets">
                      {subLabels.map((lab, i) => (<li key={i}>{lab} = <b className="num">{c.sub[i] ?? 0}</b></li>))}
                    </ul>
                  ),
                };
              })} />
          ) : keys.map((key) => {
            const c = byKey[key];
            const subLabels = t.qsub[key] || [];
            return (
              <div className="q-item" key={key}>
                <ChannelBadge ch={key} color={c.color} size={26} radius={8} glyph={14} />
                <div className="q-main">
                  <div className="q-name">{t.channels[key]} <span className="tot num">{c.queue}</span></div>
                  <div className="q-sub">
                    {subLabels.map((lab, i) => (<span key={i}>{lab} <b className="num">{c.sub[i] ?? 0}</b></span>))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- AVG CARDS ---------- */
export function AvgCards({ t, avg }) {
  const monoStyle = (color) => ({ fontFamily: '"IBM Plex Mono","Noto Sans",monospace', fontSize: 34, fontWeight: 800, lineHeight: 1, color });
  return (
    <div className="avg-stack">
      <div className="avg-card avg-talk">
        <div className="lab">{t.avgTalk}</div>
        <div className="v"><span style={{ color: 'var(--talk)', display: 'flex' }}>{Ico.clock(22)}</span>
          <Statistic value={DASH.fmtClock(avg.talk)} valueStyle={monoStyle('var(--talk)')} /></div>
      </div>
      <div className="avg-card avg-wait">
        <div className="lab">{t.avgWait}</div>
        <div className="v"><span style={{ color: 'var(--avail)', display: 'flex' }}>{Ico.hourglass(20)}</span>
          <Statistic value={DASH.fmtClock(avg.wait)} valueStyle={monoStyle('var(--avail)')} /></div>
      </div>
    </div>
  );
}

/* ---------- IVR PANEL ---------- */
export function IvrPanel({ t, ivr, maxIvr }) {
  let items = t.ivrItems.map((label, i) => ({ label, val: ivr[i] }));
  items.sort((a, b) => b.val - a.val);
  items = items.slice(0, maxIvr || items.length);
  const max = Math.max(...items.map((i) => i.val), 1);
  const maxAxis = Math.ceil(max / 500) * 500;
  const talk = resolveColor('var(--talk)');
  const packed = items.length < 8;
  return (
    <div className="panel">
      <div className="panel-hd">
        <h3>{t.ivrTitle}</h3><span className="sub">· {t.ivrSub}</span>
      </div>
      <div className="panel-body">
        <div className="ivr-list" style={{ justifyContent: packed ? 'flex-start' : 'space-between', gap: packed ? 14 : 4 }}>
          {items.map((it, i) => (
            <div className="ivr-row" key={i}>
              <div className="ivr-lab"><b className="num">{i + 1}.</b>{it.label}</div>
              <div className="ivr-bar-wrap">
                <Progress percent={(it.val / maxAxis) * 100} showInfo={false} strokeColor={talk} />
                <span className="ivr-val num">{it.val.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', marginTop: 6, paddingLeft: 230 }}>
          <span>0</span><span>{(maxAxis / 2).toLocaleString()}</span><span>{maxAxis.toLocaleString()} {t.ivrAxis}</span>
        </div>
      </div>
    </div>
  );
}
