import { useLanguage } from '../context/LanguageContext.jsx';
import './LanguageSwitcher.css';

export default function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage, languages } = useLanguage();

  return (
    <label className={`lang-switch ${compact ? 'lang-switch--compact' : ''}`}>
      <span className="sr-only">Language</span>
      <select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Language">
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {compact ? lang.code.toUpperCase() : lang.label}
          </option>
        ))}
      </select>
    </label>
  );
}
