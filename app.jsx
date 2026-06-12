/* ============ App: chart panel, gauges, settings (AntD), root ============ */
const { ConfigProvider, theme: antdTheme, Drawer, Segmented, Select, Switch, InputNumber, DatePicker, TimePicker } = antd;
const dayjs = window.dayjs;

/* ---------- threshold helpers ---------- */
function zoneColor(v, breaks) {
  if (v < breaks[0]) return "var(--bad)";
  if (v < breaks[1]) return "var(--warn)";
  return "var(--good)";
}

/* ---------- CHART PANEL ---------- */
function ChartPanel({ t, series, refreshRate, setRefreshRate, showYesterday, setShowYesterday, showToday, setShowToday, showCustom, setShowCustom, customDate, setCustomDate, customLabel, onRefresh }) {
  return (
    <div className="panel">
      <div className="panel-hd">
        <h3>{t.chartTitle}</h3>
        <div className="right">
          <div className="legend">
            <span className={"lg toggle"+(showYesterday?"":" off")} onClick={()=>setShowYesterday(!showYesterday)}>
              <span className="ln dash" style={{borderColor:"var(--axis)"}}></span>{t.legYesterday}</span>
            <span className={"lg toggle"+(showToday?"":" off")} onClick={()=>setShowToday(!showToday)}>
              <span className="ln" style={{borderColor:"var(--talk)"}}></span>{t.legToday}</span>
            <span className={"lg date-chip toggle"+(showCustom?"":" off")}>
              <span className="ln" style={{borderColor:"var(--avail)", cursor:"pointer"}} onClick={()=>setShowCustom(!showCustom)}></span>
              <span style={{cursor:"pointer"}} onClick={()=>setShowCustom(!showCustom)}>{t.legCustom}</span>
              <DatePicker size="small" value={customDate?dayjs(customDate):null} allowClear={false} suffixIcon={null}
                style={{width:128}} onChange={(d)=>{ setCustomDate(d?d.format("YYYY-MM-DD"):""); setShowCustom(true); }} />
            </span>
          </div>
          <Segmented size="small" className="seg-refresh" value={refreshRate} onChange={setRefreshRate}
            options={[5,15,30].map(r=>({label:r+"s", value:r}))} />
          <Button size="small" type="text" className="icon-btn" title={t.refresh} icon={Ico.refresh(15)} onClick={onRefresh} />
        </div>
      </div>
      <div className="panel-body">
        <LineChart series={series} t={t} showYesterday={showYesterday} showToday={showToday} showCustom={showCustom} customLabel={customLabel} />
      </div>
    </div>
  );
}

/* ---------- GAUGE / DONUT KPI CARD ---------- */
function KpiCard({ title, desc, value, max, breaks, mode, display }) {
  const color = zoneColor(value, breaks);
  return (
    <div className="panel gauge-card">
      <div className="panel-hd" style={{flexDirection:"column",alignItems:"center",gap:1,paddingBottom:0}}>
        <h3 style={{color:"var(--talk)",fontSize:16,whiteSpace:"nowrap"}}>{title}</h3>
        {desc && <span className="kpi-desc">{desc}</span>}
      </div>
      <div className="panel-body" style={{paddingTop:0,justifyContent:"center"}}>
        <div className="gauge-wrap">
          {mode==="donut"
            ? <Donut value={value} max={max} color={color} display={display} size={176} />
            : <Gauge value={value} min={0} max={max} color={color} display={display} size={172} />}
        </div>
      </div>
    </div>
  );
}

function GaugeRow({ t, gauge, modes, thresholds }) {
  return (
    <React.Fragment>
      <KpiCard title={t.csl} desc={t.cslSub} value={gauge.csl} max={100} breaks={thresholds.csl} mode={modes.csl} display={`${gauge.csl.toFixed(2)}%`} />
      <KpiCard title={t.nps} value={gauge.nps} max={60} breaks={thresholds.nps} mode={modes.nps} display={`${gauge.nps>=0?"+":"\u2212"}${Math.abs(gauge.nps).toFixed(2)}`} />
      <KpiCard title={t.satisfaction} value={gauge.satisfaction} max={100} breaks={thresholds.sat} mode={modes.sat} display={`${gauge.satisfaction.toFixed(2)}%`} />
    </React.Fragment>
  );
}

/* ---------- SETTINGS DRAWER (AntD) ---------- */
function ThresholdRow({ t, breaks, max, setBreaks }) {
  return (
    <div className="thr-row">
      <span className="thr-field"><i className="dot" style={{background:"var(--bad)"}}></i>{t.redBelow}
        <InputNumber size="small" min={0} max={max} value={breaks[0]} style={{width:72}}
          onChange={(v)=>setBreaks([Number(v)||0, breaks[1]])} /></span>
      <span className="thr-field"><i className="dot" style={{background:"var(--good)"}}></i>{t.greenAbove}
        <InputNumber size="small" min={0} max={max} value={breaks[1]} style={{width:72}}
          onChange={(v)=>setBreaks([breaks[0], Number(v)||0])} /></span>
    </div>
  );
}

function SettingsDrawer(props) {
  const { t, open, onClose, displayMode, setDisplayMode, theme, setTheme, lang, setLang,
    dataStart, setDataStart, refreshRate, setRefreshRate, customDate, setCustomDate, showCustom, setShowCustom,
    channels, visibleChannels, toggleChannel, queueChannels, toggleQueueChannel,
    modes, setMode, thresholds, setThreshold, maxIvr, setMaxIvr } = props;
  const themes = [["light",t.themeLight,"#1c6fe0"],["dark",t.themeDark,"#11192b"],["midnight",t.themeMidnight,"#0a1f52"],["teal",t.themeTeal,"#0f5f57"]];
  const kpis = [["csl",t.csl,100],["nps",t.nps,60],["sat",t.satisfaction,100]];
  const [sh,sm] = (dataStart||"00:00").split(":").map(Number);

  return (
    <Drawer title={t.settings} placement="right" width={440} open={open} onClose={onClose}
      getContainer={false} rootClassName="cc-settings-drawer" closeIcon={Ico.x(18)}>
      {/* display mode */}
      <div className="set-grp">
        <h4>{t.displayMode}</h4>
        <Segmented block value={displayMode} onChange={setDisplayMode}
          options={[{label:t.modern,value:"modern"},{label:t.flat,value:"flat"}]} />
      </div>
      {/* theme */}
      <div className="set-grp">
        <h4>{t.theme}</h4>
        <div className="theme-grid">
          {themes.map(([k,label,sw])=>(
            <div key={k} className={"theme-opt"+(theme===k?" on":"")} onClick={()=>setTheme(k)}>
              <span className="theme-sw" style={{background:sw}}></span><span className="tn">{label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* language */}
      <div className="set-grp">
        <h4>{t.language}</h4>
        <div className="set-row">
          <label>{t.language}</label>
          <Select value={lang} style={{width:170}} onChange={setLang}
            options={[{value:"th",label:"ไทย"},{value:"en",label:"English"},{value:"zh",label:"中文"},{value:"lo",label:"ລາວ"}]} />
        </div>
      </div>
      {/* display data */}
      <div className="set-grp">
        <h4>{t.display}</h4>
        <div className="set-row"><label>{t.dataStart}</label>
          <TimePicker format="HH:mm" allowClear={false} style={{width:120}}
            value={dayjs().hour(sh||0).minute(sm||0).second(0)}
            onChange={(d)=>setDataStart(d?d.format("HH:mm"):"00:00")} /></div>
        <div className="set-row"><label>{t.refreshRate}</label>
          <Select value={refreshRate} style={{width:120}} onChange={setRefreshRate}
            options={[5,10,15,30,60].map(r=>({value:r,label:String(r)}))} /></div>
        <div className="set-row"><label>{t.compareDate}</label>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Switch checked={showCustom} onChange={setShowCustom} />
            <DatePicker disabled={!showCustom} allowClear={false} style={{width:140}}
              value={customDate?dayjs(customDate):null}
              onChange={(d)=>setCustomDate(d?d.format("YYYY-MM-DD"):"")} /></div></div>
      </div>
      {/* KPI settings */}
      <div className="set-grp">
        <h4>{t.kpiSettings}</h4>
        {kpis.map(([k,label,max])=>(
          <div className="kpi-set" key={k}>
            <div className="kpi-set-top">
              <span className="kpi-set-name">{label}</span>
              <Segmented size="small" value={modes[k]} onChange={(v)=>setMode(k,v)}
                options={[{label:t.gaugeType,value:"gauge"},{label:t.donutType,value:"donut"}]} />
            </div>
            <ThresholdRow t={t} breaks={thresholds[k]} max={max} setBreaks={(b)=>setThreshold(k,b)} />
          </div>
        ))}
      </div>
      {/* IVR */}
      <div className="set-grp">
        <h4>{t.ivrTitle}</h4>
        <div className="set-row"><label>{t.maxMenus}</label>
          <Select value={maxIvr} style={{width:120}} onChange={setMaxIvr}
            options={[3,4,5,6,7,8].map(n=>({value:n,label:String(n)}))} /></div>
      </div>
      {/* channels visible */}
      <div className="set-grp">
        <h4>{t.channelsVisible}</h4>
        {channels.map(c=>(
          <div className="chan-toggle" key={c.key}>
            <span className="l"><span className="ci" style={{background:c.color}}><ChannelGlyph ch={c.key} size={13} /></span>{t.channels[c.key]}</span>
            <Switch checked={visibleChannels.includes(c.key)} onChange={()=>toggleChannel(c.key)} />
          </div>
        ))}
      </div>
      {/* queue channels */}
      <div className="set-grp">
        <h4>{t.queueChannels}</h4>
        {channels.map(c=>(
          <div className="chan-toggle" key={c.key}>
            <span className="l"><span className="ci" style={{background:c.color}}><ChannelGlyph ch={c.key} size={13} /></span>{t.channels[c.key]}</span>
            <Switch checked={queueChannels.includes(c.key)} onChange={()=>toggleQueueChannel(c.key)} />
          </div>
        ))}
      </div>
    </Drawer>
  );
}

/* ---------- THEME CONFIG (AntD ConfigProvider) ---------- */
const THEME_CFG = {
  light:    { algorithm: antdTheme.defaultAlgorithm, token: { colorPrimary:"#1c6fe0" } },
  teal:     { algorithm: antdTheme.defaultAlgorithm, token: { colorPrimary:"#0f5f57" } },
  dark:     { algorithm: antdTheme.darkAlgorithm,    token: { colorPrimary:"#3d8bff", colorBgContainer:"#131b2c", colorBgElevated:"#131b2c", colorBgLayout:"#0a0f1a" } },
  midnight: { algorithm: antdTheme.darkAlgorithm,    token: { colorPrimary:"#3d8bff", colorBgContainer:"#0f1d45", colorBgElevated:"#0f1d45", colorBgLayout:"#060f2b" } },
};

/* ---------- ROOT APP ---------- */
const ALL_KEYS = window.DASH.CHANNELS.map(c=>c.key);
const LS = (k,def)=>{ try{const v=localStorage.getItem("cc_"+k); return v==null?def:JSON.parse(v);}catch(e){return def;} };
const save = (k,v)=>{ try{localStorage.setItem("cc_"+k,JSON.stringify(v));}catch(e){} };

function App() {
  const [lang, setLangS] = useState(()=>LS("lang","th"));
  const [theme, setThemeS] = useState(()=>LS("theme","light"));
  const [displayMode, setDisplayModeS] = useState(()=>LS("displayMode","modern"));
  const [order, setOrder] = useState(()=>{ const o=LS("order",ALL_KEYS); return ALL_KEYS.every(k=>o.includes(k))?o:ALL_KEYS; });
  const [visibleChannels, setVisible] = useState(()=>LS("visible",ALL_KEYS));
  const [queueChannels, setQueue] = useState(()=>LS("queueCh",ALL_KEYS));
  const [dataStart, setDataStartS] = useState(()=>LS("dataStart","00:00"));
  const [refreshRate, setRefreshS] = useState(()=>LS("refresh",15));
  const [customDate, setCustomDateS] = useState(()=>LS("customDate","2025-05-20"));
  const [showCustom, setShowCustomS] = useState(()=>LS("showCustom",true));
  const [showYesterday, setShowYestS] = useState(()=>LS("showYest",true));
  const [showToday, setShowTodayS] = useState(()=>LS("showToday",true));
  const [modes, setModesS] = useState(()=>LS("modes",{csl:"gauge",nps:"gauge",sat:"donut"}));
  const [thresholds, setThresholdsS] = useState(()=>LS("thresholds",{csl:[80,85],nps:[29,37],sat:[80,90]}));
  const [maxIvr, setMaxIvrS] = useState(()=>LS("maxIvr",8));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chromeHidden, setChromeHidden] = useState(false);

  const [state, setState] = useState(()=>window.DASH.initialState());
  const [now, setNow] = useState(()=>new Date());
  const t = window.I18N[lang];

  const setLang=(v)=>{setLangS(v);save("lang",v);};
  const setTheme=(v)=>{setThemeS(v);save("theme",v);};
  const setDisplayMode=(v)=>{setDisplayModeS(v);save("displayMode",v);};
  const setDataStart=(v)=>{setDataStartS(v);save("dataStart",v);};
  const setRefreshRate=(v)=>{setRefreshS(v);save("refresh",v);};
  const setCustomDate=(v)=>{setCustomDateS(v);save("customDate",v);};
  const setShowCustom=(v)=>{setShowCustomS(v);save("showCustom",v);};
  const setShowYesterday=(v)=>{setShowYestS(v);save("showYest",v);};
  const setShowToday=(v)=>{setShowTodayS(v);save("showToday",v);};
  const setMaxIvr=(v)=>{setMaxIvrS(v);save("maxIvr",v);};
  const setMode=(k,v)=>{ setModesS(prev=>{ const n={...prev,[k]:v}; save("modes",n); return n; }); };
  const setThreshold=(k,b)=>{ setThresholdsS(prev=>{ const n={...prev,[k]:b}; save("thresholds",n); return n; }); };
  const reorder=(a)=>{setOrder(a);save("order",a);};
  const toggleChannel=(k)=>{ setVisible(prev=>{ const next=prev.includes(k)?prev.filter(x=>x!==k):[...prev,k]; save("visible",next); return next; }); };
  const toggleQueueChannel=(k)=>{ setQueue(prev=>{ const next=prev.includes(k)?prev.filter(x=>x!==k):[...prev,k]; save("queueCh",next); return next; }); };

  useEffect(()=>{ document.getElementById("board").setAttribute("data-theme",theme); },[theme]);
  useEffect(()=>{ document.getElementById("board").setAttribute("data-style",displayMode); },[displayMode]);
  useEffect(()=>{ document.body.setAttribute("data-lang",lang); document.documentElement.lang=lang; },[lang]);
  useEffect(()=>{ const id=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(id); },[]);
  useEffect(()=>{ const id=setInterval(()=>setState(s=>window.DASH.tick(s)), refreshRate*1000); return ()=>clearInterval(id); },[refreshRate]);
  useEffect(()=>{
    const board=document.getElementById("board");
    const fit=()=>{ const s=Math.min(window.innerWidth/1920, window.innerHeight/1080); board.style.transformOrigin="center center"; board.style.transform=`scale(${s})`; };
    fit(); window.addEventListener("resize",fit); return ()=>window.removeEventListener("resize",fit);
  },[]);

  useEffect(()=>{
    const onFsChange=()=>{ if(!document.fullscreenElement) setChromeHidden(false); };
    document.addEventListener("fullscreenchange", onFsChange);
    return ()=>document.removeEventListener("fullscreenchange", onFsChange);
  },[]);
  useEffect(()=>{ document.getElementById("board").setAttribute("data-chrome", chromeHidden?"hidden":"shown"); },[chromeHidden]);

  const toggleFullscreen=()=>{ if(!document.fullscreenElement){document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();} setChromeHidden(true); };
  const exitChrome=()=>{ if(document.fullscreenElement){document.exitFullscreen&&document.exitFullscreen();} setChromeHidden(false); };

  const nowFrac = (now.getHours()*3600+now.getMinutes()*60+now.getSeconds())/86400;
  const [sh,sm] = dataStart.split(":").map(Number);
  const startFrac = ((sh||0)*3600+(sm||0)*60)/86400;
  const series = window.DASH.liveSeries(nowFrac, startFrac);
  const customLabel = (()=>{ try{ const d=new Date(customDate); return `${d.getDate()} ${t.monthsShort[d.getMonth()]} ${d.getFullYear()+t.yearOffset}`; }catch(e){ return customDate; } })();

  const shownChannels = state.channels.filter(c=>visibleChannels.includes(c.key));
  const onRefresh=()=>{ window.DASH.regenSeries(); setState(s=>window.DASH.tick(s)); };

  return (
    <ConfigProvider getPopupContainer={()=>document.getElementById("board")||document.body} theme={{ ...THEME_CFG[theme], token:{ ...THEME_CFG[theme].token, fontFamily:'inherit', borderRadius:8 } }}>
      {!chromeHidden && (
        <Header t={t} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} now={now}
          openSettings={()=>setSettingsOpen(true)} toggleFullscreen={toggleFullscreen} />
      )}
      <KpiBar t={t} agents={state.agents} />
      <ChannelRow t={t} channels={shownChannels} order={order} onReorder={reorder} />
      <div className="main">
        <div className="col-left">
          <QueuePanel t={t} channels={state.channels} order={order} queueChannels={queueChannels} flat={displayMode==="flat"} />
        </div>
        <div className="col-right">
          <div className="charts-row">
            <ChartPanel t={t} series={series} refreshRate={refreshRate} setRefreshRate={setRefreshRate}
              showYesterday={showYesterday} setShowYesterday={setShowYesterday}
              showToday={showToday} setShowToday={setShowToday}
              showCustom={showCustom} setShowCustom={setShowCustom} customDate={customDate} setCustomDate={setCustomDate}
              customLabel={customLabel} onRefresh={onRefresh} />
            <IvrPanel t={t} ivr={state.ivr} maxIvr={maxIvr} />
          </div>
          <div className="bottom-row">
            <AvgCards t={t} avg={state.avg} />
            <GaugeRow t={t} gauge={state.gauge} modes={modes} thresholds={thresholds} />
          </div>
        </div>
      </div>
      <SettingsDrawer t={t} open={settingsOpen} onClose={()=>setSettingsOpen(false)}
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
      {chromeHidden && ReactDOM.createPortal(
        <button className="fs-restore" onClick={exitChrome} title={t.restoreMenu} aria-label={t.restoreMenu}>
          {Ico.x(20)}
        </button>, document.body)}
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById("board")).render(<App />);
