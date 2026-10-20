import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import ThemeSwitcher from './ThemeSwitcher.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { removeAppData } from '../utils/storage.js';
import './SettingsMenu.css';

export default function SettingsMenu() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { t } = useLanguage();
  const { fontSize, setFontSize } = useTheme();
  const navigate = useNavigate();
  const [activeOption, setActiveOption] = useState(null);
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [privacyError, setPrivacyError] = useState('');
  const showPhoneOnListings = user?.privacy?.showPhoneOnListings ?? true;

  const signOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const updatePhonePrivacy = async (event) => {
    const showPhone = event.target.checked;
    setSavingPrivacy(true);
    setPrivacyError('');
    try {
      await updateProfile({
        privacy: { ...user?.privacy, showPhoneOnListings: showPhone },
      });
    } catch (error) {
      setPrivacyError(error?.response?.data?.message || 'Could not save your privacy setting.');
    } finally {
      setSavingPrivacy(false);
    }
  };

  const clearDeviceData = () => {
    const confirmed = window.confirm(
      'Clear AgriConnect data saved in this browser and sign out? This removes local demo accounts, listings, and preferences. It does not delete your server account or server data.',
    );
    if (!confirmed) return;
    removeAppData();
    logout();
    window.location.reload();
  };

  return (
    <details
      className="settings-menu"
      onToggle={(event) => {
        if (!event.currentTarget.open) setActiveOption(null);
      }}
    >
      <summary aria-label="Settings" title="Settings">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </summary>
      <div className="settings-menu__panel">
        {!activeOption ? (
          <>
            <h2>Settings</h2>
            <nav className="settings-menu__options" aria-label="Settings options">
              <button type="button" className="settings-menu__option" onClick={() => setActiveOption('language')}>
                <span>{t('language')}</span>
                <span aria-hidden="true">›</span>
              </button>
              <button type="button" className="settings-menu__option" onClick={() => setActiveOption('display')}>
                <span>Display</span>
                <span aria-hidden="true">›</span>
              </button>
              <button type="button" className="settings-menu__option" onClick={() => setActiveOption('privacy')}>
                <span>Privacy</span>
                <span aria-hidden="true">›</span>
              </button>
              <button type="button" className="settings-menu__option" onClick={() => setActiveOption('account')}>
                <span>Account</span>
                <span aria-hidden="true">›</span>
              </button>
            </nav>
          </>
        ) : (
          <>
            <div className="settings-menu__subhead">
              <button
                type="button"
                className="settings-menu__back"
                onClick={() => setActiveOption(null)}
                aria-label="Return to settings options"
                title="Return to settings options"
              >
                <span aria-hidden="true">←</span>
              </button>
              <h2>
                {activeOption === 'language'
                  ? t('language')
                  : activeOption === 'display'
                    ? 'Display'
                    : activeOption === 'privacy'
                      ? 'Privacy'
                      : 'Account'}
              </h2>
            </div>

            {activeOption === 'language' ? (
              <section className="settings-menu__content">
                <LanguageSwitcher />
              </section>
            ) : null}

            {activeOption === 'display' ? (
              <section className="settings-menu__content settings-menu__display">
                <ThemeSwitcher />
                <label className="settings-menu__font-size">
                  Font size
                  <select value={fontSize} onChange={(event) => setFontSize(event.target.value)}>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </label>
              </section>
            ) : null}

            {activeOption === 'privacy' ? (
              <section className="settings-menu__content settings-menu__privacy">
                <label className="settings-menu__privacy-toggle">
                  <input
                    type="checkbox"
                    checked={showPhoneOnListings}
                    onChange={updatePhonePrivacy}
                    disabled={!isAuthenticated || savingPrivacy}
                  />
                  <span>
                    <strong>Show my phone number on my listings</strong>
                    <small>
                      {isAuthenticated
                        ? 'Buyers can call or WhatsApp you from your public listings.'
                        : 'Sign in to manage whether buyers can see your phone number.'}
                    </small>
                  </span>
                </label>
                {privacyError ? <p className="settings-menu__error" role="alert">{privacyError}</p> : null}
                <p className="settings-menu__privacy-note">
                  Public listings show crop, quantity, price, location, availability and listing notes. Your phone
                  visibility is controlled above. Your email is not public, and passwords are never returned by the
                  app. Profile and listing information is stored on the server when connected; demo changes are stored
                  in this browser.
                </p>
                <button type="button" className="settings-menu__clear" onClick={clearDeviceData}>
                  Clear data saved on this device
                </button>
                <details className="settings-menu__privacy-subsection">
                  <summary>Copyright</summary>
                  <div className="settings-menu__info">
                    <p className="settings-menu__copyright">
                      © {new Date().getFullYear()} AgriConnect Gambia. All rights reserved.
                    </p>
                    <p>
                      Original application code, interface design, text and app-created graphics are protected by
                      applicable copyright laws. No permission is granted to reproduce or redistribute these materials
                      except as permitted by law or with permission from the relevant rights holder.
                    </p>
                    <p>
                      Third-party photographs, libraries, frameworks and other attributed materials remain the property
                      of their respective owners and are used under their applicable licenses. See the relevant photo
                      credits and project dependency licenses for details.
                    </p>
                    <p>
                      This notice does not claim ownership of user-submitted listings, profile information, or other
                      content provided by users.
                    </p>
                  </div>
                </details>
                <details className="settings-menu__privacy-subsection">
                  <summary>Authors</summary>
                  <div className="settings-menu__authors">
                    <ul>
                      <li>Abdoulie Sarjo</li>
                      <li>Malick Bah</li>
                      <li>Aminata Jallow</li>
                      <li>Abdoulie Faal</li>
                      <li>Aisha Jaiteh</li>
                    </ul>
                  </div>
                </details>
              </section>
            ) : null}

            {activeOption === 'account' ? (
              <section className="settings-menu__content settings-menu__account">
                {user?.name ? <p>Signed in as {user.name}</p> : null}
                <Link to="/login?switch=1">{isAuthenticated ? 'Log in / switch account' : t('login')}</Link>
                <Link to="/register?addAccount=1">Add another account</Link>
                {isAuthenticated ? (
                  <button type="button" onClick={signOut}>
                    {t('logout')}
                  </button>
                ) : null}
              </section>
            ) : null}

          </>
        )}
      </div>
    </details>
  );
}
