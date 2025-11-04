import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { UserRole } from '../../types';
import AdmissionForm from '../receptionist/AdmissionForm';
import NoticeBoard from '../common/NoticeBoard';
import EntranceForm from '../receptionist/EntranceForm';
import ManageSubmissions from '../admin/ManageSubmissions';
import FeeCollection from '../receptionist/FeeCollection';
import Chat from '../common/Chat';
import Gallery from '../common/Gallery';
import { useLanguage } from '../../contexts/LanguageContext';

const ReceptionistDashboard: React.FC = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const { t } = useLanguage();

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <div><h1 className="text-2xl font-bold mb-4">{t('dashboard.receptionist.title')}</h1><p>{t('dashboard.receptionist.welcome')}</p></div>;
            case 'chat':
                return <Chat />;
            case 'admission':
                return <AdmissionForm />;
            case 'entrance':
                return <EntranceForm />;
            case 'exam-applications':
                return <ManageSubmissions />;
            case 'fee-collection':
                return <FeeCollection />;
            case 'gallery':
                return <Gallery />;
            case 'notices':
                return <NoticeBoard />;
            default:
                return <div>Select a page</div>;
        }
    };

    return (
        <div className="flex flex-1">
            <Sidebar userRole={UserRole.RECEPTIONIST} activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1 p-6 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default ReceptionistDashboard;