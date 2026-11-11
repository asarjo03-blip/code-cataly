import { useCallback, useEffect, useRef, useState } from 'react';

const RECOGNITION_LANGS = {
  en: 'en-GB',
  mnk: 'en-GB',
  wo: 'wo-SN',
};

function getRecognitionClass() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function voiceInputSupported() {
  return Boolean(getRecognitionClass());
}

function pickVoice(voices, tag) {
  const lowerTag = tag.toLowerCase();
  return (
    voices.find((item) => item.lang?.toLowerCase() === lowerTag) ||
    voices.find((item) => item.lang?.toLowerCase().replace('_', '-').startsWith(lowerTag.slice(0, 2))) ||
    voices.find((item) => item.lang?.toLowerCase().startsWith('en'))
  );
}

export function speakText(text, language = 'en') {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  if (typeof window.SpeechSynthesisUtterance !== 'function') return;
  const synth = window.speechSynthesis;
  const tag = RECOGNITION_LANGS[language] || 'en-GB';
  let spoken = false;

  const speak = () => {
    if (spoken) return;
    spoken = true;
    try {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = tag;
      utterance.rate = 0.95;
      const voice = pickVoice(synth.getVoices?.() || [], tag);
      if (voice) utterance.voice = voice;
      synth.speak(utterance);
    } catch {
      // Speech is a bonus: never block the text answer when the browser fails.
    }
  };

  // Some browsers load the voice list after the first call. Wait for it briefly.
  if (!(synth.getVoices?.() || []).length && typeof synth.addEventListener === 'function') {
    let timer = 0;
    const onVoices = () => {
      synth.removeEventListener?.('voiceschanged', onVoices);
      if (timer) window.clearTimeout(timer);
      speak();
    };
    synth.addEventListener('voiceschanged', onVoices);
    timer = window.setTimeout(() => {
      synth.removeEventListener?.('voiceschanged', onVoices);
      speak();
    }, 800);
    return;
  }

  speak();
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function useVoiceInput({ language = 'en', onResult }) {
  const [supported] = useState(() => voiceInputSupported());
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);
  const languageRef = useRef(language);
  const languageFallbackRef = useRef(false);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    languageRef.current = language;
    languageFallbackRef.current = false;
  }, [language]);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // Recognition may already be stopped.
      }
    }
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const Recognition = getRecognitionClass();
    if (!Recognition) {
      setError('unsupported');
      return;
    }

    stopSpeaking();
    setError('');
    setInterim('');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore an already closed recogniser.
      }
      recognitionRef.current = null;
    }

    const recognition = new Recognition();
    const preferred = RECOGNITION_LANGS[languageRef.current] || 'en-GB';
    recognition.lang = languageFallbackRef.current ? 'en-GB' : preferred;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setError('');
    };

    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result[0]?.transcript || '';
        if (result.isFinal) finalText += transcript;
        else interimText += transcript;
      }
      if (interimText) setInterim(interimText.trim());
      if (finalText.trim()) {
        setInterim('');
        onResultRef.current?.(finalText.trim());
      }
    };

    recognition.onerror = (event) => {
      setListening(false);
      setInterim('');
      if (event.error === 'language-not-supported') {
        languageFallbackRef.current = true;
      }
      setError(event.error || 'unknown');
    };

    recognition.onend = () => {
      setListening(false);
      setInterim('');
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError('start-failed');
      recognitionRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      if (recognition) {
        try {
          recognition.abort();
        } catch {
          // Ignore cleanup errors.
        }
      }
      stopSpeaking();
    },
    [],
  );

  return {
    supported,
    listening,
    interim,
    error,
    start,
    stop,
    clearError: useCallback(() => setError(''), []),
  };
}
