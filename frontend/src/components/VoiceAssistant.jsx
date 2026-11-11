import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import {
  assistantSuggestions,
  interpret,
  resolveIntent,
} from '../data/assistant.js';
import {
  speakText,
  stopSpeaking,
  useVoiceInput,
} from '../hooks/useVoice.js';
import { CloseIcon, MicIcon, SearchIcon, VolumeOffIcon, VolumeOnIcon } from './Icons.jsx';
import { readJson, writeJson } from '../utils/storage.js';
import './VoiceAssistant.css';

function errorMessageFor(code, t) {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return t('assistantMicBlocked');
    case 'no-speech':
      return t('assistantNoSpeech');
    case 'audio-capture':
      return t('assistantNoMic');
    case 'network':
      return t('assistantNetwork');
    case 'language-not-supported':
      return t('assistantLanguage');
    case 'unsupported':
    case 'start-failed':
      return t('assistantNotSupported');
    default:
      return t('assistantTryAgain');
  }
}

export default function VoiceAssistant({ raised = false }) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [heard, setHeard] = useState('');
  const [answer, setAnswer] = useState('');
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [replies, setReplies] = useState(() => readJson('voiceReplies', true));
  const repliesRef = useRef(replies);
  const bodyRef = useRef(null);

  useEffect(() => {
    repliesRef.current = replies;
  }, [replies]);

  const handleQuery = useCallback(
    async (text) => {
      const clean = String(text || '').trim();
      if (!clean) return;
      setBusy(true);
      setAnswer('');
      setResults([]);
      try {
        const intent = interpret(clean, { user });
        const resolved = await resolveIntent(intent, { language, user, t });
        setAnswer(resolved.speech);
        setResults(resolved.results || []);
        if (resolved.path) navigate(resolved.path);
        if (repliesRef.current) speakText(resolved.speech, language);
      } catch {
        const message = t('assistantError');
        setAnswer(message);
        if (repliesRef.current) speakText(message, language);
      } finally {
        setBusy(false);
      }
    },
    [language, navigate, t, user],
  );

  const voice = useVoiceInput({
    language,
    onResult: (text) => {
      setHeard(text);
      handleQuery(text);
    },
  });

  const { supported, listening, interim, error: voiceError, start, stop, clearError } = voice;

  useEffect(() => {
    if (open && bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [answer, results, busy, open]);

  const closePanel = useCallback(() => {
    stop();
    stopSpeaking();
    setOpen(false);
    setTyped('');
    setHeard('');
    setAnswer('');
    setResults([]);
    clearError();
  }, [clearError, stop]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closePanel, open]);

  const openPanel = () => {
    setOpen(true);
    setTyped('');
    setHeard('');
    setAnswer('');
    setResults([]);
    clearError();
    if (supported) start();
  };

  const ask = (query, label) => {
    stop();
    setHeard(label || query);
    setTyped('');
    handleQuery(query);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const text = typed.trim();
    if (!text) return;
    setHeard(text);
    setTyped('');
    stop();
    handleQuery(text);
  };

  const toggleReplies = () => {
    const next = !replies;
    setReplies(next);
    writeJson('voiceReplies', next);
    if (!next) stopSpeaking();
  };

  const suggestions = assistantSuggestions(language, user);
  const status = busy
    ? t('assistantThinking')
    : listening
      ? interim || t('assistantListening')
      : '';

  if (!open) {
    return (
      <div className={`voice-launcher ${raised ? 'voice-launcher--raised' : ''}`}>
        <button
          type="button"
          className="voice-fab"
          onClick={openPanel}
          aria-label={t('assistantOpen')}
          title={t('assistantTitle')}
        >
          <MicIcon size={27} />
        </button>
      </div>
    );
  }

  return (
    <section
      className={`voice-panel ${raised ? 'voice-panel--raised' : ''}`}
      role="dialog"
      aria-label={t('assistantTitle')}
    >
      <header className="voice-panel__head">
        <div>
          <h2>{t('assistantTitle')}</h2>
          <p>{t('assistantHint')}</p>
        </div>
        <div className="voice-panel__tools">
          <button
            type="button"
            onClick={toggleReplies}
            aria-pressed={replies}
            aria-label={replies ? t('assistantMute') : t('assistantUnmute')}
            title={replies ? t('assistantMute') : t('assistantUnmute')}
          >
            {replies ? <VolumeOnIcon size={20} /> : <VolumeOffIcon size={20} />}
          </button>
          <button type="button" onClick={closePanel} aria-label={t('assistantClose')} title={t('assistantClose')}>
            <CloseIcon size={20} />
          </button>
        </div>
      </header>

      <div className="voice-panel__body" ref={bodyRef}>
        <button
          type="button"
          className={`voice-mic ${listening ? 'is-listening' : ''}`}
          onClick={listening ? stop : start}
          disabled={!supported || busy}
          aria-pressed={listening}
        >
          <MicIcon size={30} />
          <span>{listening ? t('assistantStop') : t('assistantSpeak')}</span>
        </button>

        <p className="voice-panel__status" aria-live="polite">
          {status || (heard || answer ? '' : t('assistantTapToSpeak'))}
        </p>

        {!supported ? <p className="voice-panel__note">{t('assistantNotSupported')}</p> : null}
        {voiceError ? (
          <p className="voice-panel__error" role="alert">
            {errorMessageFor(voiceError, t)}
          </p>
        ) : null}

        {!heard && !answer && !voiceError ? <p className="voice-panel__intro">{t('assistantIntro')}</p> : null}

        {heard ? (
          <p className="voice-panel__heard">
            <span>{t('assistantYouSaid')}</span> &ldquo;{heard}&rdquo;
          </p>
        ) : null}

        {answer ? (
          <p className="voice-panel__answer" aria-live="polite">
            {answer}
          </p>
        ) : null}

        {results.length ? (
          <div className="voice-panel__results">
            <p className="voice-panel__results-title">{t('assistantResults')}</p>
            <ul>
              {results.map((item) => (
                <li key={item.id}>
                  <Link to={item.to} onClick={closePanel}>
                    <strong>{item.title}</strong>
                    {item.detail ? <span>{item.detail}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {!busy ? (
          <div className="voice-panel__chips" aria-label={t('assistantSuggestions')}>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.query}
                type="button"
                className="voice-chip"
                onClick={() => ask(suggestion.query, suggestion.label)}
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <footer className="voice-panel__footer">
        <form className="voice-panel__form" onSubmit={onSubmit}>
          <input
            type="text"
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            placeholder={t('assistantTypeInstead')}
            aria-label={t('assistantTypeInstead')}
            autoFocus={!supported}
          />
          <button type="submit" disabled={!typed.trim() || busy} aria-label={t('assistantSend')}>
            <SearchIcon size={18} />
          </button>
        </form>
        <p className="voice-panel__privacy">{t('assistantPrivacy')}</p>
      </footer>
    </section>
  );
}
