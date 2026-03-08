import { writable, type Writable } from 'svelte/store';

interface ThemeState {
  theme: 'light' | 'dark' | 'system' | 'oled';
  isDark: boolean;
}

function createThemeStore() {
  const initialStore: ThemeState = {
    theme: 'system',
    isDark: false
  };
  
  const { subscribe, update, set } = writable<ThemeState>(initialStore);
  
  // Initialize theme based on system preference
  if (typeof window !== 'undefined') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    set({
      theme: 'system',
      isDark: systemPrefersDark
    });
  }
  
  return {
    subscribe,
    
    setTheme(theme: ThemeState['theme']) {
      update((state) => {
        let isDark = state.theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        if (theme === 'oled') {
          isDark = true;
        }
        
        // Update document class
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        return {
          ...state,
          theme,
          isDark
        };
      });
    },
    
    toggleTheme() {
      update((state) => {
        let nextTheme: ThemeState['theme'] = 'system';
        
        if (state.theme === 'system') {
          nextTheme = 'dark';
        } else if (state.theme === 'dark') {
          nextTheme = 'light';
        } else if (state.theme === 'light') {
          nextTheme = 'oled';
        } else {
          nextTheme = 'system';
        }
        
        this.setTheme(nextTheme);
        
        return {
          ...state,
          theme: nextTheme
        };
      });
    }
  };
}

export const themeStore = createThemeStore();
