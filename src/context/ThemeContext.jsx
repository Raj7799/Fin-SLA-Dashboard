import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Restore from localStorage, default to dark
    return localStorage.getItem('fin-sla-theme') || 'dark';
  });

  useEffect(() => {
    // Apply to <html> so CSS variables respond globally
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fin-sla-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
