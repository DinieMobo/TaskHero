import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentTheme, setTheme as setThemeUtil } from '../utils/theme';

// Create theme context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getCurrentTheme());

  // Function to update theme
  const setTheme = (newTheme) => {
    setThemeUtil(newTheme);
    setThemeState(newTheme);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    return newTheme === 'dark';
  };

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = (e) => {
      setThemeState(e.detail.theme);
    };
    
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};
