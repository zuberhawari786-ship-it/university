import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
// FIX: Import UserRole to use enum member.
import { ApplicationStatus, UserRole } from '../../types';

const AdmissionForm: React.FC = () => {
    const { entranceApplications, updateEntranceApplicationStatus, addStudentProfile } = useData();
    const { addUser } = useAuth();
    const [selectedAppId, setSelectedAppId] = useState('');
    const [feedback, setFeedback] = useState('');

    const approvedApps = entranceApplications.filter(app => app.status === ApplicationStatus.APPROVED);
    const selectedApp = approvedApps.find(app => app.id === selectedAppId);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedApp) {
            setFeedback('Please select an applicant.');
            return;
        }

        const username = selectedApp.email.split('@')[0].toLowerCase();
        const result = addUser({
            name: selectedApp.applicantName,
            username: username,
            // FIX: Use UserRole.STUDENT enum member instead of string literal.
            role: UserRole.STUDENT,
        });

        if (result.success && result.newUser) {
            addStudentProfile(result.newUser, { type: 'mobile', value: selectedApp.phone });
            // This marks the application as processed. A new status like 'ADMITTED' could be used.
            updateEntranceApplicationStatus(selectedApp.id, ApplicationStatus.ADMITTED); 
            setFeedback(`Student profile for ${selectedApp.applicantName} created with username '${username}' and default password. The student can now log in and complete registration.`);
            setSelectedAppId('');
        } else {
            setFeedback(result.message || 'An error occurred.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Student Admission</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label">Select Approved Applicant</label>
                    <select value={selectedAppId} onChange={e => setSelectedAppId(e.target.value)} className="form-select" required>
                        <option value="" disabled>-- Select Applicant --</option>
                        {approvedApps.map(app => <option key={app.id} value={app.id}>{app.applicantName} ({app.email})</option>)}
                    </select>
                </div>
                {selectedApp && (
                    <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md text-sm">
                        <p><strong>Applicant:</strong> {selectedApp.applicantName}</p>
                        <p><strong>Course:</strong> {selectedApp.courseId.toUpperCase()}</p>
                        <p>A new student account will be created. The student will need to log in to complete their registration.</p>
                    </div>
                )}
                 {approvedApps.length === 0 && <p className="text-sm text-gray-500">No approved entrance applications available for admission.</p>}
                <div className="flex justify-end items-center pt-2">
                    {feedback && <p className="text-green-600 dark:text-green-400 text-sm mr-4">{feedback}</p>}
                    <button type="submit" className="btn-primary" disabled={!selectedAppId}>Admit Student</button>
                </div>
            </form>
        </div>
    );
};

export default AdmissionForm;