// src/composables/useTheme.js
import { ref, onMounted, watch, computed } from 'vue';

export function useTheme() {
  const theme = ref(localStorage.getItem('theme') || 'light');
  const htmlElement = document.documentElement;

  const applyTheme = (newTheme) => {
    htmlElement.classList.toggle('dark', newTheme === 'dark');
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  onMounted(() => {
    applyTheme(theme.value);
  });

  watch(theme, (newTheme) => {
    applyTheme(newTheme);
  });

  const toggleTheme = () => {
    applyTheme(theme.value === 'light' ? 'dark' : 'light');
  };

  const isDarkMode = computed(() => theme.value === 'dark');

  return {
    theme,
    toggleTheme,
    isDarkMode,
  };
}