import { theme as antdTheme } from 'antd';

/* AntD ConfigProvider theme per wallboard theme.
   Light/Teal use the default algorithm; Dark/Midnight use the dark algorithm. */
export const THEME_CFG = {
  light:    { algorithm: antdTheme.defaultAlgorithm, token: { colorPrimary: '#1c6fe0' } },
  teal:     { algorithm: antdTheme.defaultAlgorithm, token: { colorPrimary: '#0f5f57' } },
  dark:     { algorithm: antdTheme.darkAlgorithm,    token: { colorPrimary: '#3d8bff', colorBgContainer: '#131b2c', colorBgElevated: '#131b2c', colorBgLayout: '#0a0f1a' } },
  midnight: { algorithm: antdTheme.darkAlgorithm,    token: { colorPrimary: '#3d8bff', colorBgContainer: '#0f1d45', colorBgElevated: '#0f1d45', colorBgLayout: '#060f2b' } },
};
