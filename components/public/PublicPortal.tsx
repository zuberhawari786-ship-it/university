import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import PublicNoticeBoard from './PublicNoticeBoard';
import PublicResultSearch from './PublicResultSearch';
import EntranceForm from '../receptionist/EntranceForm';

interface PublicPortalProps {
    onExit: () => void;
}

const PublicPortal: React.FC<PublicPortalProps> = ({ onExit }) => {
    const { universityInfo } = useData();
    const [activeTab, setActiveTab] = useState<'notices' | 'results' | 'entrance'>('notices');

    const renderContent = () => {
        switch (activeTab) {
            case 'notices':
                return <PublicNoticeBoard />;
            case 'results':
                return <PublicResultSearch />;
            case 'entrance':
                return <EntranceForm />;
            default:
                return null;
        }
    };

    return (
        <div className="app-container">
            <header className="flex items-center justify-between p-4 bg-transparent border-b border-gray-700">
                <div className="flex items-center">
                    <img src={universityInfo.logo} alt="Logo" className="h-8 w-auto mr-4"/>
                    <h1 className="text-xl font-bold">{universityInfo.name} - Public Portal</h1>
                </div>
                <button onClick={onExit} className="btn-secondary">
                    &larr; Back to Login
                </button>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 bg-transparent border-r border-[var(--border-color)] flex-shrink-0 p-4 overflow-y-auto">
                    <nav>
                        <ul>
                            <li><button onClick={() => setActiveTab('notices')} className={`w-full text-left px-4 py-2.5 my-1 rounded-md text-sm font-medium transition-colors ${activeTab === 'notices' ? 'bg-[rgba(0,191,255,0.15)] text-white' : 'text-white hover:bg-[rgba(0,191,255,0.1)]'}`}>Notice Board</button></li>
                            <li><button onClick={() => setActiveTab('results')} className={`w-full text-left px-4 py-2.5 my-1 rounded-md text-sm font-medium transition-colors ${activeTab === 'results' ? 'bg-[rgba(0,191,255,0.15)] text-white' : 'text-white hover:bg-[rgba(0,191,255,0.1)]'}`}>Check Results</button></li>
                            <li><button onClick={() => setActiveTab('entrance')} className={`w-full text-left px-4 py-2.5 my-1 rounded-md text-sm font-medium transition-colors ${activeTab === 'entrance' ? 'bg-[rgba(0,191,255,0.15)] text-white' : 'text-white hover:bg-[rgba(0,191,255,0.1)]'}`}>Apply for Entrance</button></li>
                        </ul>
                    </nav>
                </aside>
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default PublicPortal;
