/* Brand channel glyphs (custom SVG) + UI icons from @ant-design/icons */
import React from 'react';
import {
  CustomerServiceOutlined, PhoneFilled, UserOutlined, UserDeleteOutlined,
  ClockCircleOutlined, CalendarOutlined, SettingOutlined, GlobalOutlined,
  BgColorsOutlined, FullscreenOutlined, ReloadOutlined, HolderOutlined,
  DownOutlined, CheckOutlined, TeamOutlined, CloseOutlined, HourglassOutlined,
} from '@ant-design/icons';

export function ChannelGlyph({ ch, size = 18 }) {
  const sw = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (ch) {
    case 'voice':
      return <svg {...sw} fill="currentColor" stroke="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z"/></svg>;
    case 'line':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.63 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.63V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>;
    case 'mail':
      return <svg {...sw}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>;
    case 'pantip':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2c-5 0-9 3-9 6.9 0 3.5 3.2 6.4 7.5 6.8l-.7 3.3c-.1.4.4.7.7.4l4-3.6c3.7-.7 6.5-3.4 6.5-7.3 0-3.9-4-6.9-9-6.9z"/><path d="M9.2 7.8h3.2c1.8 0 3 1.1 3 2.8s-1.2 2.8-3.1 2.8h-1.4v2.2H9.2V7.8zm1.7 4.1h1.1c.8 0 1.3-.4 1.3-1.2s-.5-1.2-1.3-1.2h-1.1v2.4z" fill="#7c4dff"/></svg>;
    case 'facebook':
      return <svg {...sw} fill="currentColor" stroke="none"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.75-1.6 1.5V12h2.7l-.43 2.9h-2.27v7A10 10 0 0 0 22 12z"/></svg>;
    case 'traffy':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H10l-4 3.4c-.4.3-1 0-1-.5V16A2.5 2.5 0 0 1 4 13.5v-8z"/><circle cx="9" cy="9" r="1.15" fill="#e8662a"/><circle cx="15" cy="9" r="1.15" fill="#e8662a"/><path d="M9 11.4c.7.9 1.8 1.4 3 1.4s2.3-.5 3-1.4" stroke="#e8662a" strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>;
    case 'twitter':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.06-6.933Zm-1.291 19.49h2.039L6.486 3.24H4.298l13.312 17.403Z"/></svg>;
    default: return null;
  }
}

export function ChannelBadge({ ch, color, size = 32, radius = 9, glyph = 18 }) {
  return (
    <span style={{ width: size, height: size, borderRadius: radius, background: color, color: '#fff' }} className="ch-badge">
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        <ChannelGlyph ch={ch} size={glyph} />
      </span>
    </span>
  );
}

const W = (Comp) => (s = 18) => <Comp style={{ fontSize: s, lineHeight: 0, display: 'flex' }} />;
export const Ico = {
  headset:   W(CustomerServiceOutlined),
  talk:      W(PhoneFilled),
  user:      W(UserOutlined),
  userOff:   W(UserDeleteOutlined),
  clock:     W(ClockCircleOutlined),
  calendar:  W(CalendarOutlined),
  gear:      W(SettingOutlined),
  globe:     W(GlobalOutlined),
  palette:   W(BgColorsOutlined),
  expand:    W(FullscreenOutlined),
  refresh:   W(ReloadOutlined),
  grip:      W(HolderOutlined),
  chevron:   W(DownOutlined),
  check:     W(CheckOutlined),
  queue:     W(TeamOutlined),
  x:         W(CloseOutlined),
  hourglass: W(HourglassOutlined),
};
