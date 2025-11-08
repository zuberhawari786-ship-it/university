export interface Theme {
    name: string;
    primary400: string;
    primary500: string;
    accent500: string;
    cardBg: string;
    bodyBg: string;
    textMain: string;
    textMuted: string;
    borderColor: string;
    accentShadowColor: string;
    primaryShadowColor: string;
    btnPrimaryText: string;
    inputBg: string;
    inputBgFocus: string;
    formSectionBg: string;
}

export const themes: Theme[] = [
    {
        name: 'Default Dark',
        primary400: '#40E0D0', // Turquoise
        primary500: '#00BFFF', // DeepSkyBlue
        accent500: '#C71585',  // MediumVioletRed
        cardBg: 'rgba(20, 20, 30, 0.6)',
        bodyBg: '#0A0A10',
        textMain: '#FFFFFF',
        textMuted: '#A0A0B0',
        borderColor: 'rgba(0, 191, 255, 0.3)',
        accentShadowColor: 'rgba(0, 191, 255, 0.1)',
        primaryShadowColor: 'rgba(64, 224, 208, 0.6)',
        btnPrimaryText: '#0A0A10',
        inputBg: 'rgba(0, 30, 40, 0.7)',
        inputBgFocus: 'rgba(0, 40, 50, 0.8)',
        formSectionBg: 'rgba(0, 191, 255, 0.03)',
    },
    {
        name: 'Arcade Neon',
        primary400: '#F3F31A', // Neon Yellow
        primary500: '#FF00FF', // Magenta
        accent500: '#00FFFF',  // Cyan
        cardBg: 'rgba(25, 0, 35, 0.7)',
        bodyBg: '#100018',
        textMain: '#F5F5F5',
        textMuted: '#C0C0C0',
        borderColor: 'rgba(255, 0, 255, 0.4)',
        accentShadowColor: 'rgba(255, 0, 255, 0.2)',
        primaryShadowColor: 'rgba(0, 255, 255, 0.6)',
        btnPrimaryText: '#100018',
        inputBg: 'rgba(40, 0, 50, 0.8)',
        inputBgFocus: 'rgba(50, 0, 60, 0.9)',
        formSectionBg: 'rgba(255, 0, 255, 0.05)',
    },
    {
        name: 'Solarized Light',
        primary400: '#268bd2', // blue
        primary500: '#2aa198', // cyan
        accent500: '#d33682',  // magenta
        cardBg: 'rgba(253, 246, 227, 0.8)', // base3
        bodyBg: '#eee8d5', // base2
        textMain: '#586e75', // base01
        textMuted: '#839496', // base0
        borderColor: 'rgba(147, 161, 161, 0.4)', // base00
        accentShadowColor: 'rgba(88, 110, 117, 0.1)',
        primaryShadowColor: 'rgba(42, 161, 152, 0.3)',
        btnPrimaryText: '#fdf6e3',
        inputBg: 'rgba(238, 232, 213, 0.9)', // base2
        inputBgFocus: '#ffffff',
        formSectionBg: 'rgba(238, 232, 213, 0.7)',
    },
    {
        name: 'Oceanic Blue',
        primary400: '#0077b6',
        primary500: '#0096c7',
        accent500: '#023e8a',
        cardBg: 'rgba(255, 255, 255, 0.8)',
        bodyBg: '#caf0f8',
        textMain: '#03045e',
        textMuted: '#4895ef',
        borderColor: 'rgba(144, 224, 239, 0.8)',
        accentShadowColor: 'rgba(0, 119, 182, 0.1)',
        primaryShadowColor: 'rgba(0, 150, 199, 0.4)',
        btnPrimaryText: '#ffffff',
        inputBg: 'rgba(222, 245, 249, 0.9)',
        inputBgFocus: '#ffffff',
        formSectionBg: 'rgba(202, 240, 248, 0.6)',
    },
];
