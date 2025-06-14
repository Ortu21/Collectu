import { createContext } from 'react';

export type ThemeType = 'light' | 'dark';

export const ThemeContext = createContext<{
  theme: ThemeType;
  toggleTheme: () => void;
}>({
  theme: 'dark',
  toggleTheme: () => {},
});
