# 1330 Contact Center Wallboard — React + Ant Design 5

A real-time contact-center wallboard (1920×1080, auto-scaled to fit any screen) rebuilt
in **React 18** with **Ant Design 5**. It preserves the original look while using AntD
components under the hood (Dropdown, Drawer, Statistic, Progress, Segmented, Select,
Switch, InputNumber, DatePicker/TimePicker, Avatar, Tooltip, Collapse, ConfigProvider).

## Features (full parity with the original)

- **Real-time simulation** — agent counts, channel totals, queue, KPIs and IVR figures
  tick on the chosen refresh interval.
- **Settings drawer** — display mode, theme, language, data-start time, refresh rate,
  comparison date, per-KPI gauge/donut toggle + colour thresholds, max IVR menus,
  visible channels, queue channels.
- **Draggable channel cards** — reorder the 7 channels by dragging.
- **Gauge ↔ Donut** — each KPI (CSL / NPS / Satisfaction) renders as an AntD `Progress`
  dashboard gauge or circle donut, coloured by its red/amber/green thresholds.
- **Daily call-volume line chart** — hand-built SVG (yesterday / today / selected date).
- **IVR menu bar chart** — AntD `Progress` line bars, sorted, top-N.
- **Queue panel** — card list (modern) or collapsible list (flat mode).
- **4 themes** — Light, Dark, Midnight, Teal (AntD light/dark algorithm + tokens).
- **4 languages** — Thai, English, Chinese, Lao.

All preferences persist to `localStorage` (`cc_*` keys).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the build
```

## Project structure

```
react-app/
├─ index.html                 # mounts #board, loads Google fonts + image-slot.js
├─ vite.config.js
├─ public/
│  └─ image-slot.js           # optional drag-drop logo web component
└─ src/
   ├─ main.jsx                # ReactDOM root → #board
   ├─ App.jsx                 # state, layout, ConfigProvider theming
   ├─ theme.js                # AntD theme config per wallboard theme
   ├─ data.js                 # mock data + real-time generators (DASH)
   ├─ i18n.js                 # TH / EN / ZH / LO strings (I18N)
   ├─ styles.css              # bespoke tokens, layout, AntD integration overrides
   └─ components/
      ├─ icons.jsx            # brand channel glyphs + @ant-design/icons UI icons
      ├─ Charts.jsx           # SVG LineChart + AntD Progress Gauge/Donut
      ├─ Panels.jsx           # Header, KpiBar, ChannelRow, QueuePanel, AvgCards, IvrPanel
      ├─ Kpis.jsx             # ChartPanel + KPI gauge cards
      └─ SettingsDrawer.jsx   # AntD Drawer settings
```

## Notes

- Channel logos (Voice/LINE/Mail/Pantip/Facebook/Traffy/X) are custom brand-accurate SVGs
  — Ant Design has no brand marks. Every other icon comes from `@ant-design/icons`.
- The board is a fixed 1920×1080 canvas scaled with `transform: scale()` to fit the
  viewport; designed for large wall displays.
- Replace the mock generators in `data.js` with your live API/WebSocket feed; the UI
  reads from the `state` object shape returned by `DASH.initialState()` / `DASH.tick()`.
- A single-file, build-free version (CDN React + AntD UMD) also exists as
  `CX Wallboard (AntD).html` in the parent project if you just want to open it in a browser.
```
