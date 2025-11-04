import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { UserRole } from '../../types';
import Chat from '../common/Chat';
import ManageProducts from '../shopkeeper/ManageProducts';
import { useLanguage } from '../../contexts/LanguageContext';

const ShopkeeperDashboard: React.FC = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const { t } = useLanguage();

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <div><h1 className="text-2xl font-bold mb-4">{t('dashboard.shopkeeper.title')}</h1><p>{t('dashboard.shopkeeper.welcome')}</p></div>;
            case 'products':
                return <ManageProducts />;
            case 'chat':
                return <Chat />;
            default:
                return <div>Select a page</div>;
        }
    };

    return (
        <div className="flex flex-1">
            <Sidebar userRole={UserRole.SHOPKEEPER} activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1 p-6 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default ShopkeeperDashboard;