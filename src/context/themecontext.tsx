import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Primary_theme, Secondary_theme, Tertiary_theme } from '../colors/color';

type ThemeType = typeof Secondary_theme;

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: (themeName: 'Hidro' | 'Light' | 'Dark') => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: Secondary_theme,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(Secondary_theme);

  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('userMode');
        if (savedTheme) {
          const selectedTheme =
            savedTheme === 'Hidro' ? Primary_theme :
            savedTheme === 'Light' ? Secondary_theme :
            Tertiary_theme;
          setTheme(selectedTheme);
        }
      } catch (error) {
        console.error('Erro ao carregar o tema:', error);
      }
    };

    loadSavedTheme();
  }, []);

  const toggleTheme = async (themeName: 'Hidro' | 'Light' | 'Dark') => {
    const selectedTheme =
      themeName === 'Hidro' ? Primary_theme :
      themeName === 'Light' ? Secondary_theme :
      Tertiary_theme;
    setTheme(selectedTheme);

    try {
      await AsyncStorage.setItem('userMode', themeName);
    } catch (error) {
      console.error('Erro ao salvar o tema:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};