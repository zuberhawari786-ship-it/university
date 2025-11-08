import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { UserRole } from '../../types';
import Chat from '../common/Chat';
import Gallery from '../common/Gallery';
import CampusPulse from '../common/CampusPulse';
import AcademicCalendar from '../common/AcademicCalendar';
import NoticeBoard from '../common/NoticeBoard';
import ResourceCenter from '../common/ResourceCenter';
import ResearchPortal from '../researcher/ResearchPortal';
import { useLanguage } from '../../contexts/LanguageContext';
import UserProfile from '../common/UserProfile';

const ResearcherDashboard: React.FC = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const { t } = useLanguage();

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <div><h1 className="text-2xl font-bold mb-4">Researcher Dashboard</h1><p>Welcome, Researcher! Access research tools and resources from the sidebar.</p></div>;
            case 'research-portal':
                return <ResearchPortal />;
            case 'resource-center':
                return <ResourceCenter />;
            case 'campus-pulse':
                return <CampusPulse />;
            case 'chat':
                return <Chat />;
            case 'calendar':
                return <AcademicCalendar />;
            case 'gallery':
                return <Gallery />;
            case 'notices':
                return <NoticeBoard />;
            case 'profile':
                return <UserProfile />;
            default:
                return <div>Select a page</div>;
        }
    };

    return (
        <div className="flex flex-1">
            <Sidebar userRole={UserRole.RESEARCHER} activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1 p-6 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default ResearcherDashboard;