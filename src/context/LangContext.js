import { createContext, useContext } from 'react';
export const LangContext = createContext('es');
export const useLang = () => useContext(LangContext);
