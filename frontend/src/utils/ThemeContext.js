import { createContext, useContext, useState, useEffect } from 'react';
const Ctx = createContext({});
export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('hx-theme') !== 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('hx-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return <Ctx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);