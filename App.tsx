import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/dashboards/AdminDashboard';
import TeacherDashboard from './components/dashboards/TeacherDashboard';
import StudentDashboard from './components/dashboards/StudentDashboard';
import ReceptionistDashboard from './components/dashboards/ReceptionistDashboard';
import ShopkeeperDashboard from './components/dashboards/ShopkeeperDashboard';
import ExaminerDashboard from './components/dashboards/ExaminerDashboard';
import AccountingDashboard from './components/dashboards/AccountingDashboard';
import ResearcherDashboard from './components/dashboards/ResearcherDashboard';
import PublicPortal from './components/public/PublicPortal';
import { UserRole } from './types';
import Header from './components/Header';
import { Theme } from './themes';

const DynamicTheme: React.FC = () => {
    const { theme } = useTheme();

    const generateCssVariables = (theme: Theme) => {
        return `
      :root {
        --primary-400: ${theme.primary400};
        --primary-500: ${theme.primary500};
        --accent-500: ${theme.accent500};
        --card-bg: ${theme.cardBg};
        --body-bg: ${theme.bodyBg};
        --text-main: ${theme.textMain};
        --text-muted: ${theme.textMuted};
        --border-color: ${theme.borderColor};
        --accent-shadow-color: ${theme.accentShadowColor};
        --primary-shadow-color: ${theme.primaryShadowColor};
        --btn-primary-text: ${theme.btnPrimaryText};
        --input-bg: ${theme.inputBg};
        --input-bg-focus: ${theme.inputBgFocus};
        --form-section-bg: ${theme.formSectionBg};
      }
    `;
    };

    return <style>{generateCssVariables(theme)}</style>;
};


const AppContent: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [isPublicView, setIsPublicView] = useState(false);

    const renderDashboard = () => {
        switch (user?.role) {
            case UserRole.ADMIN:
                return <AdminDashboard />;
            case UserRole.TEACHER:
                return <TeacherDashboard />;
            case UserRole.STUDENT:
                return <StudentDashboard />;
            case UserRole.RECEPTIONIST:
                return <ReceptionistDashboard />;
            case UserRole.SHOPKEEPER:
                return <ShopkeeperDashboard />;
            case UserRole.EXAMINER:
                return <ExaminerDashboard />;
            case UserRole.ACCOUNTING:
                return <AccountingDashboard />;
            case UserRole.RESEARCHER:
                return <ResearcherDashboard />;
            default:
                return <LoginPage onEnterPublicPortal={() => setIsPublicView(true)} />;
        }
    };

    if (isPublicView) {
        return <PublicPortal onExit={() => setIsPublicView(false)} />;
    }

    if (!isAuthenticated) {
        return <LoginPage onEnterPublicPortal={() => setIsPublicView(true)} />;
    }

    return (
        <div className="app-container">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                {renderDashboard()}
            </div>
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AuthProvider>
            <LanguageProvider>
                <DataProvider>
                    <ThemeProvider>
                        <DynamicTheme />
                        <AppContent />
                    </ThemeProvider>
                </DataProvider>
            </LanguageProvider>
        </AuthProvider>
    );
};

export default App;