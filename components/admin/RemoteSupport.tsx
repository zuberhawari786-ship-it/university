import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, UserRole } from '../../types';
import SimulatedStudentView from './SimulatedStudentView';

const RemoteSupport: React.FC = () => {
    const { users } = useAuth();
    const [targetUsername, setTargetUsername] = useState('');
    const [connectedStudent, setConnectedStudent] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => { // Simulate network delay
            const student = users.find(u => u.role === UserRole.STUDENT && u.username.toLowerCase() === targetUsername.toLowerCase());
            if (student) {
                setConnectedStudent(student);
            } else {
                setError(`No student found with username "${targetUsername}". Please check the username and try again.`);
            }
            setIsLoading(false);
        }, 1500);
    };

    const handleDisconnect = () => {
        setConnectedStudent(null);
        setTargetUsername('');
        setError('');
    };

    if (connectedStudent) {
        return (
            <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Remote Session Active</h2>
                     <button onClick={handleDisconnect} className="btn-primary bg-red-600 hover:bg-red-700">
                        Disconnect
                    </button>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg shadow-inner">
                     <p className="text-center text-sm text-gray-300 mb-2">Controlling desktop for <span className="font-bold text-white">{connectedStudent.name}</span> ({connectedStudent.username})</p>
                    <div className="border-4 border-gray-600 rounded-md overflow-hidden">
                        <SimulatedStudentView student={connectedStudent} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="card p-8 text-center">
                 <svg className="mx-auto h-16 w-16 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">AnyDesk Remote Support</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Enter the student's username to start a remote support session.</p>
                <form onSubmit={handleConnect} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="username" className="sr-only">Student Username</label>
                        <input
                            type="text"
                            id="username"
                            value={targetUsername}
                            onChange={(e) => setTargetUsername(e.target.value)}
                            className="form-input text-center text-lg tracking-wider"
                            placeholder="e.g., alice"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="btn-primary w-full" disabled={isLoading}>
                        {isLoading ? 'Connecting...' : 'Connect'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RemoteSupport;
