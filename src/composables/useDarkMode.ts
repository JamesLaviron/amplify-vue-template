import { ref, onMounted, watch } from 'vue';
import { getCurrentUser } from 'aws-amplify/auth';

const isDarkMode = ref(false);
const currentUser = ref<any>(null);

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
  };

  const setDarkMode = (dark: boolean) => {
    isDarkMode.value = dark;
  };

  const getStorageKey = () => {
    return currentUser.value
      ? `theme_${currentUser.value.userId || currentUser.value.username}`
      : 'theme_guest';
  };

  const saveToStorage = (theme: 'dark' | 'light') => {
    // Store in both localStorage and sessionStorage
    const key = getStorageKey();
    localStorage.setItem(key, theme);
    sessionStorage.setItem(key, theme);

    // Also store in global theme for fallback
    localStorage.setItem('theme', theme);
    sessionStorage.setItem('theme', theme);
  };

  const getFromStorage = (): 'dark' | 'light' | null => {
    // Check sessionStorage first (current session preference)
    const key = getStorageKey();
    let theme = sessionStorage.getItem(key) as 'dark' | 'light' | null;

    if (!theme) {
      // Fallback to localStorage (persistent preference)
      theme = localStorage.getItem(key) as 'dark' | 'light' | null;
    }

    if (!theme) {
      // Fallback to global theme
      theme = (sessionStorage.getItem('theme') || localStorage.getItem('theme')) as
        | 'dark'
        | 'light'
        | null;
    }

    return theme;
  };

  const saveUserPreference = async (theme: 'dark' | 'light') => {
    if (!currentUser.value) {
      return;
    }

    try {
      // Save theme preference in localStorage only since UserProfile model doesn't have preferences field
      const key = getStorageKey();
      localStorage.setItem(key, theme);
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Failed to save user theme preference:', error);
    }
  };

  const loadUserPreference = async (): Promise<'dark' | 'light' | null> => {
    if (!currentUser.value) {
      return null;
    }

    try {
      // Load theme preference from localStorage since UserProfile model doesn't have preferences field
      const key = getStorageKey();
      const theme = localStorage.getItem(key) as 'dark' | 'light' | null;
      return theme;
    } catch (error) {
      console.warn('Failed to load user theme preference:', error);
    }

    return null;
  };

  const initializeDarkMode = async () => {
    // Get current user
    try {
      currentUser.value = await getCurrentUser();
    } catch {
      currentUser.value = null;
    }

    let theme: 'dark' | 'light' | null = null;

    // Priority order:
    // 1. Session/Local storage (current session preference)
    // 2. User preferences from database (for authenticated users)
    // 3. System preference

    theme = getFromStorage();

    if (!theme && currentUser.value) {
      // Try to load from user preferences
      theme = await loadUserPreference();
    }

    if (!theme) {
      // Fallback to system preference
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    isDarkMode.value = theme === 'dark';
    updateTheme();
  };

  const updateTheme = async () => {
    const root = document.documentElement;
    const theme = isDarkMode.value ? 'dark' : 'light';

    if (isDarkMode.value) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save to storage
    saveToStorage(theme);

    // Save to user preferences if authenticated
    if (currentUser.value) {
      await saveUserPreference(theme);
    }
  };

  // Watch for changes to isDarkMode and update the DOM
  watch(isDarkMode, updateTheme, { immediate: false });

  // Listen for system theme changes
  onMounted(() => {
    initializeDarkMode();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only follow system preference if user hasn't manually set a preference
      const userTheme = getFromStorage();
      if (!userTheme) {
        isDarkMode.value = e.matches;
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Update current user when auth state changes
    const checkAuthState = async () => {
      try {
        const user = await getCurrentUser();
        if (
          user &&
          (user.userId || user.username) !==
            (currentUser.value?.userId || currentUser.value?.username)
        ) {
          currentUser.value = user;
          // Reload preferences for new user
          const userTheme = await loadUserPreference();
          if (userTheme) {
            isDarkMode.value = userTheme === 'dark';
          }
        }
      } catch {
        if (currentUser.value) {
          currentUser.value = null;
        }
      }
    };

    // Check auth state periodically
    const authCheckInterval = setInterval(checkAuthState, 5000);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearInterval(authCheckInterval);
    };
  });

  return {
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
    currentUser,
  };
}
