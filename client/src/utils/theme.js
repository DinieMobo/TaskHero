/**
 * Initializes the theme based on user preference or system preference
 */
export const initializeTheme = () => {
  // Check if user has previously selected a theme
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // Use system preference if no theme is saved
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }
  
  // Add listener for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) { // Only react if user hasn't set preference
      if (e.matches) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      // Dispatch event so components can update
      dispatchThemeChangeEvent(e.matches ? 'dark' : 'light');
    }
  });
};

/**
 * Gets the current theme
 * @returns {string} 'dark' or 'light'
 */
export const getCurrentTheme = () => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

/**
 * Toggles between light and dark theme
 * @returns {boolean} New theme state (true = dark, false = light)
 */
export const toggleTheme = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  if (isDarkMode) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    dispatchThemeChangeEvent('light');
    return false;
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    dispatchThemeChangeEvent('dark');
    return true;
  }
};

/**
 * Sets the theme explicitly
 * @param {string} theme - 'dark' or 'light'
 */
export const setTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
  dispatchThemeChangeEvent(theme);
};

/**
 * Dispatches a custom event when theme changes
 * @param {string} theme - The new theme ('dark' or 'light')
 */
const dispatchThemeChangeEvent = (theme) => {
  window.dispatchEvent(
    new CustomEvent('themeChanged', { detail: { theme } })
  );
};
