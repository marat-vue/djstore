import { ref } from 'vue';
import { defineStore } from 'pinia';

type Theme = 'light' | 'dark';
const THEME_KEY = 'djstore-theme';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('dark');

  function apply(value: Theme) {
    theme.value = value;
    document.documentElement.classList.toggle('dark', value === 'dark');
    document.documentElement.style.colorScheme = value;
  }

  function initialize() {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    const systemTheme: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    apply(stored === 'dark' || stored === 'light' ? stored : systemTheme);
  }

  function toggle() {
    const next = theme.value === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    apply(next);
  }

  return { theme, initialize, toggle };
});
