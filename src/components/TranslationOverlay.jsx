import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { translate, LANGUAGES } from '../services/TranslationService';
import './TranslationOverlay.css';

const SOURCE_LANGS = [{ code: 'auto', name: 'Auto-detect' }, ...LANGUAGES];
const TARGET_LANGS = LANGUAGES;

export function TranslateFab() {
  const { overlayOpen, setOverlayOpen } = useTranslation();
  return (
    <button
      className="translate-fab"
      onClick={() => setOverlayOpen(o => !o)}
      title={overlayOpen ? 'Close translator' : 'Open translator'}
      aria-label="Translation overlay"
    >
      🌐
    </button>
  );
}

export default function TranslationOverlay() {
  const { overlayOpen, setOverlayOpen, sourceLang, setSourceLang, targetLang, setTargetLang, prefillText } = useTranslation();

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [detectedLang, setDetectedLang] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const dragging = useRef(false);
  const dragOrigin = useRef({ x: 0, y: 0 });
  const panelRef = useRef(null);

  useEffect(() => {
    if (prefillText) {
      setInputText(prefillText);
      setOutputText('');
      setDetectedLang(null);
    }
  }, [prefillText]);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setError('');
    setOutputText('');
    try {
      const result = await translate({ q: inputText.trim(), source: sourceLang, target: targetLang });
      if (result) {
        setOutputText(result.translatedText);
        if (result.detectedLang && sourceLang === 'auto') {
          const match = LANGUAGES.find(l => l.code === result.detectedLang);
          setDetectedLang(match ? match.name : result.detectedLang);
        }
      } else {
        setError('Translation failed. Check your connection and try again.');
      }
    } catch {
      setError('Translation failed. Check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, sourceLang, targetLang]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleTranslate();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleTranslate]);

  function handleSwap() {
    if (sourceLang === 'auto') return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
    setDetectedLang(null);
  }

  function handleCopy() {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  function startDrag(clientX, clientY) {
    dragging.current = true;
    dragOrigin.current = { x: clientX - offset.x, y: clientY - offset.y };
  }

  useEffect(() => {
    function onMove(e) {
      if (!dragging.current) return;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      setOffset({ x: cx - dragOrigin.current.x, y: cy - dragOrigin.current.y });
    }
    function onUp() { dragging.current = false; }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };
  }, [offset]);

  if (!overlayOpen) return null;

  const panelStyle = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
  };

  return (
    <div className="translation-overlay" ref={panelRef} style={panelStyle}>
      <div
        className="overlay-drag-handle"
        onMouseDown={e => startDrag(e.clientX, e.clientY)}
        onTouchStart={e => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
      >
        <span className="overlay-title">
          <span className="overlay-title-icon">🌐</span>
          Translate
        </span>
        <div className="overlay-header-btns">
          <button className="overlay-icon-btn" onClick={() => setOverlayOpen(false)} title="Close">✕</button>
        </div>
      </div>

      <div className="overlay-lang-row">
        <select
          className="overlay-lang-select"
          value={sourceLang}
          onChange={e => { setSourceLang(e.target.value); setDetectedLang(null); }}
        >
          {SOURCE_LANGS.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>

        <button
          className="overlay-swap-btn"
          onClick={handleSwap}
          disabled={sourceLang === 'auto'}
          title="Swap languages"
        >
          ⇄
        </button>

        <select
          className="overlay-lang-select"
          value={targetLang}
          onChange={e => setTargetLang(e.target.value)}
        >
          {TARGET_LANGS.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
      </div>

      {detectedLang && (
        <div className="overlay-detected-badge">Detected: {detectedLang}</div>
      )}

      <div className="overlay-body">
        <div className="overlay-input-area">
          <textarea
            className="overlay-textarea"
            placeholder="Type or paste text to translate… (Ctrl+Enter to go)"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            rows={3}
          />
          <div className="overlay-input-actions">
            <button
              className="overlay-translate-btn"
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading ? <span className="overlay-spinner" /> : '🌐'} Translate
            </button>
          </div>
        </div>

        {error && <div className="overlay-error">{error}</div>}

        <div className="overlay-output-area">
          <p className={`overlay-output-text${outputText ? '' : ' placeholder'}`}>
            {outputText || 'Translation will appear here…'}
          </p>
          {outputText && (
            <div className="overlay-output-actions">
              <button
                className={`overlay-copy-btn${copied ? ' copied' : ''}`}
                onClick={handleCopy}
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overlay-footer">
        <span className="overlay-footer-text">Powered by LibreTranslate · Free &amp; Open</span>
        <a className="overlay-footer-link" href="/privacy-policy.html" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
