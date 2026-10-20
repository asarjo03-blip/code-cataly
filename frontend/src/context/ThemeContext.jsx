import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readJson, writeJson } from '../utils/storage.js';

const DEFAULT_THEME_COLOR = '#1f9a52';
const FONT_SIZE_SCALE = { small: 0.9, medium: 1, large: 1.15 };
const ThemeContext = createContext(null);

export const THEME_COLORS = [
  { name: 'Leaf green', value: DEFAULT_THEME_COLOR },
  { name: 'Ocean blue', value: '#1877a8' },
  { name: 'Sunset orange', value: '#d55c20' },
  { name: 'Hibiscus pink', value: '#c43f73' },
  { name: 'Harvest gold', value: '#a97808' },
  { name: 'Indigo', value: '#6354b5' },
  { name: 'Teal', value: '#087e78' },
  { name: 'Cocoa', value: '#805238' },
  { name: 'Dark green', value: '#14532d' },
  { name: 'Black', value: '#111111' },
];

function isHexColor(value) {
  return typeof value === 'string' && /^#[\da-f]{6}$/i.test(value);
}

function contrastColor(hex) {
  const channels = hex.match(/\w\w/g).map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  return luminance > 0.179 ? '#141816' : '#ffffff';
}

export function ThemeProvider({ children }) {
  const [color, setColor] = useState(() => {
    const savedColor = readJson('themeColor', DEFAULT_THEME_COLOR);
    return isHexColor(savedColor) ? savedColor : DEFAULT_THEME_COLOR;
  });
  const [fontSize, setFontSize] = useState(() => {
    const savedSize = readJson('fontSize', 'medium');
    return Object.hasOwn(FONT_SIZE_SCALE, savedSize) ? savedSize : 'medium';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-color', color);
    root.style.setProperty('--color-primary', 'var(--theme-color)');
    root.style.setProperty('--color-primary-dark', 'color-mix(in srgb, var(--theme-color) 72%, #000)');
    root.style.setProperty('--color-primary-soft', 'color-mix(in srgb, var(--theme-color) 12%, #fff)');
    root.style.setProperty('--color-primary-ring', 'color-mix(in srgb, var(--theme-color) 22%, transparent)');
    root.style.setProperty('--color-primary-contrast', contrastColor(color));
    writeJson('themeColor', color);
  }, [color]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${FONT_SIZE_SCALE[fontSize] * 100}%`;
    writeJson('fontSize', fontSize);
  }, [fontSize]);

  const value = useMemo(() => ({ color, setColor, fontSize, setFontSize }), [color, fontSize]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
