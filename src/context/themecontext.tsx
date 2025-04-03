import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hidro, light, dark } from '../colors/color';

type ThemeName = 'hidro' | 'light' | 'dark';
type ThemeType = typeof light;

const themes: Record<ThemeName, ThemeType> = {
  hidro: hidro,
  light: light,
  dark: dark
};

interface ThemeContextValue {
  theme: ThemeType;
  toggleTheme: (themeName: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: light, 
  toggleTheme: () => {}
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeType>(light);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('userMode') as ThemeName | null;
      if (savedTheme) setTheme(themes[savedTheme]);
    };
    loadTheme();
  }, []);

  const toggleTheme = async (themeName: ThemeName) => {
    setTheme(themes[themeName]);
    await AsyncStorage.setItem('userMode', themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);