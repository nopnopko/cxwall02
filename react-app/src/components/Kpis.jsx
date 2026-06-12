/* ChartPanel + KPI gauge cards */
import React from 'react';
import { Segmented, Button, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { LineChart, Gauge, Donut } from './Charts.jsx';
import { Ico } from './icons.jsx';

export function zoneColor(v, breaks) {
  if (v < breaks[0]) return 'var(--bad)';
  if (v < breaks[1]) return 'var(--warn)';
  return 'var(--good)';
}

export function ChartPanel({ t, series, refreshRate, setRefreshRate, showYesterday, setShowYesterday,
  showToday, setShowToday, showCustom, setShowCustom, customDate, setCustomDate, onRefresh }) {
  return (
    <div className="panel">
      <div className="panel-hd">
        <h3>{t.chartTitle}</h3>
        <div className="right">
          <div className="legend">
            <span className={'lg toggle' + (showYesterday ? '' : ' off')} onClick={() => setShowYesterday(!showYesterday)}>
              <span className="ln dash" style={{ borderColor: 'var(--axis)' }} />{t.legYesterday}</span>
            <span className={'lg toggle' + (showToday ? '' : ' off')} onClick={() => setShowToday(!showToday)}>
              <span className="ln" style={{ borderColor: 'var(--talk)' }} />{t.legToday}</span>
            <span className={'lg date-chip toggle' + (showCustom ? '' : ' off')}>
              <span className="ln" style={{ borderColor: 'var(--avail)', cursor: 'pointer' }} onClick={() => setShowCustom(!showCustom)} />
              <span style={{ cursor: 'pointer' }} onClick={() => setShowCustom(!showCustom)}>{t.legCustom}</span>
              <DatePicker size="small" value={customDate ? dayjs(customDate) : null} allowClear={false} suffixIcon={null}
                style={{ width: 128 }} onChange={(d) => { setCustomDate(d ? d.format('YYYY-MM-DD') : ''); setShowCustom(true); }} />
            </span>
          </div>
          <Segmented size="small" className="seg-refresh" value={refreshRate} onChange={setRefreshRate}
            options={[5, 15, 30].map((r) => ({ label: r + 's', value: r }))} />
          <Button size="small" type="text" className="icon-btn" title={t.refresh} icon={Ico.refresh(15)} onClick={onRefresh} />
        </div>
      </div>
      <div className="panel-body">
        <LineChart series={series} t={t} showYesterday={showYesterday} showToday={showToday} showCustom={showCustom} />
      </div>
    </div>
  );
}

export function KpiCard({ title, desc, value, max, breaks, mode, display }) {
  const color = zoneColor(value, breaks);
  return (
    <div className="panel gauge-card">
      <div className="panel-hd" style={{ flexDirection: 'column', alignItems: 'center', gap: 1, paddingBottom: 0 }}>
        <h3 style={{ color: 'var(--talk)', fontSize: 16, whiteSpace: 'nowrap' }}>{title}</h3>
        {desc && <span className="kpi-desc">{desc}</span>}
      </div>
      <div className="panel-body" style={{ paddingTop: 0, justifyContent: 'center' }}>
        <div className="gauge-wrap">
          {mode === 'donut'
            ? <Donut value={value} max={max} color={color} display={display} size={176} />
            : <Gauge value={value} min={0} max={max} color={color} display={display} size={172} />}
        </div>
      </div>
    </div>
  );
}

export function GaugeRow({ t, gauge, modes, thresholds }) {
  return (
    <>
      <KpiCard title={t.csl} desc={t.cslSub} value={gauge.csl} max={100} breaks={thresholds.csl} mode={modes.csl} display={`${gauge.csl.toFixed(2)}%`} />
      <KpiCard title={t.nps} value={gauge.nps} max={60} breaks={thresholds.nps} mode={modes.nps} display={`${gauge.nps >= 0 ? '+' : '\u2212'}${Math.abs(gauge.nps).toFixed(2)}`} />
      <KpiCard title={t.satisfaction} value={gauge.satisfaction} max={100} breaks={thresholds.sat} mode={modes.sat} display={`${gauge.satisfaction.toFixed(2)}%`} />
    </>
  );
}
