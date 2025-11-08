import React, { createContext, useContext, useState, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { themes, Theme } from '../themes';

interface ThemeContextType {
    theme: Theme;
    setTheme: (themeName: string) => void;
    availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [themeName, setThemeName] = useLocalStorage<string>('ggu-theme', 'Default Dark');

    const theme = themes.find(t => t.name === themeName) || themes[0];

    const setTheme = (name: string) => {
        if (themes.some(t => t.name === name)) {
            setThemeName(name);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, availableThemes: themes }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
