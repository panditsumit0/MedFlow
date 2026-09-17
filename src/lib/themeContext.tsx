'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Resolve which actual theme to apply
  function resolve(t: Theme, systemDark: boolean): 'light' | 'dark' {
    if (t === 'system') return systemDark ? 'dark' : 'light';
    return t;
  }

  useEffect(() => {
    // Read saved preference from localStorage
    const saved = (localStorage.getItem('medflow-theme') as Theme) || 'system';
    setThemeState(saved);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (systemDark: boolean, t: Theme) => {
      const resolved = resolve(t, systemDark);
      setResolvedTheme(resolved);
      document.documentElement.classList.toggle('dark', resolved === 'dark');
    };

    apply(mq.matches, saved);

    const listener = (e: MediaQueryListEvent) => {
      // Only react to system changes if user hasn't locked to a specific theme
      const current = (localStorage.getItem('medflow-theme') as Theme) || 'system';
      if (current === 'system') apply(e.matches, 'system');
    };
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem('medflow-theme', t);
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = resolve(t, systemDark);
    setResolvedTheme(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
