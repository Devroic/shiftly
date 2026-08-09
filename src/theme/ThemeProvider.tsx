import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme, type ThemeColors } from './colors';
import { spacing } from './spacing';

export type ThemeScheme = 'light' | 'dark';
export type ThemeOverride = ThemeScheme | null;

// Key kept as-is post-rename (app was originally "ShiftPlan"): changing it would silently
// reset every existing install's theme choice back to "System".
const THEME_STORAGE_KEY = 'shiftplan.theme-override';

interface ThemeContextValue {
  colors: ThemeColors;
  spacing: typeof spacing;
  /** The scheme actually in effect right now (override, or the device's if there isn't one). */
  scheme: ThemeScheme;
  /** The user's manual choice, or null to follow the device's setting. */
  override: ThemeOverride;
  setOverride: (override: ThemeOverride) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [override, setOverrideState] = useState<ThemeOverride>(null);

  useEffect(() => {
    void AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') {
        setOverrideState(stored);
      }
    });
  }, []);

  const setOverride = useCallback((next: ThemeOverride) => {
    setOverrideState(next);
    if (next === null) {
      void AsyncStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      void AsyncStorage.setItem(THEME_STORAGE_KEY, next);
    }
  }, []);

  const scheme: ThemeScheme = override ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: scheme === 'dark' ? darkTheme : lightTheme,
      spacing,
      scheme,
      override,
      setOverride,
    }),
    [scheme, override, setOverride],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
