// Dark/Light theme management utility
export const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }
  
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      dispatchThemeChangeEvent(e.matches ? 'dark' : 'light');
    }
  });
};

export const getCurrentTheme = () => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

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

const dispatchThemeChangeEvent = (theme) => {
  window.dispatchEvent(
    new CustomEvent('themeChanged', { detail: { theme } })
  );
};
