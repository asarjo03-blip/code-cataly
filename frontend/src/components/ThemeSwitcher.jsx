import { useTheme, THEME_COLORS } from '../context/ThemeContext.jsx';
import './ThemeSwitcher.css';

export default function ThemeSwitcher() {
  const { color, setColor } = useTheme();

  return (
    <div className="theme-switcher">
      <h5>Theme</h5>
      <div className="theme-switcher__colors" aria-label="Color themes">
        {THEME_COLORS.map((theme) => (
          <button
            key={theme.value}
            type="button"
            className="theme-switcher__swatch"
            style={{ '--swatch-color': theme.value }}
            aria-label={theme.name}
            aria-pressed={color.toLowerCase() === theme.value}
            title={theme.name}
            onClick={() => setColor(theme.value)}
          />
        ))}
      </div>
      <label className="theme-switcher__custom">
        Custom color
        <input
          type="color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
        />
      </label>
    </div>
  );
}
