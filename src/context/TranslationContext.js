import { createContext, useContext, useState, createElement } from 'react';

export const TranslationContext = createContext(null);

export function TranslationProvider({ children }) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [prefillText, setPrefillText] = useState('');

  return createElement(
    TranslationContext.Provider,
    { value: { overlayOpen, setOverlayOpen, sourceLang, setSourceLang, targetLang, setTargetLang, prefillText, setPrefillText } },
    children
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
