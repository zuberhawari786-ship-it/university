import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme, availableThemes } = useTheme();

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Appearance</h3>
            <div className="grid grid-cols-2 gap-4">
                {availableThemes.map((t) => (
                    <button
                        key={t.name}
                        onClick={() => setTheme(t.name)}
                        className={`p-3 border-2 rounded-lg transition-all duration-200 ${
                            theme.name === t.name ? 'border-[var(--primary-500)] ring-2 ring-[var(--primary-500)]' : 'border-gray-300 dark:border-gray-600 hover:border-[var(--primary-400)]'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                             <span className="font-semibold text-sm" style={{ color: t.textMain }}>{t.name}</span>
                             <div className="flex -space-x-1">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.primary400 }}></div>
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.primary500 }}></div>
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.accent500 }}></div>
                             </div>
                        </div>
                        <div className="h-10 rounded" style={{ backgroundColor: t.bodyBg }}></div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ThemeSwitcher;
