

import React, { useState, ChangeEvent } from 'react';
import { useData } from '../../contexts/DataContext';
import { UniversityInfo } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const UniversitySettings: React.FC = () => {
    const { universityInfo, updateUniversityInfo, courses, students, exams, results, notices, attendanceRecords, examApplications, entranceApplications, feeStructures, feePayments } = useData();
    const { users } = useAuth();
    const [formState, setFormState] = useState<UniversityInfo>(universityInfo);
    const [feedback, setFeedback] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormState(prev => ({ ...prev, logo: event.target?.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUniversityInfo(formState);
        setFeedback('University information updated successfully!');
        setTimeout(() => setFeedback(''), 3000);
    };

    const handleExportData = () => {
        const fullData = {
            universityInfo,
            users,
            courses,
            students,
            exams,
            results,
            notices,
            attendanceRecords,
            examApplications,
            entranceApplications,
            feeStructures,
            feePayments,
        };

        const jsonString = JSON.stringify(fullData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        const filename = `gemini-university-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">University Settings</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="label">University Name</label>
                        <input type="text" name="name" id="name" value={formState.name} onChange={handleInputChange} className="form-input"/>
                    </div>
                    <div>
                        <label htmlFor="address" className="label">Address</label>
                        <input type="text" name="address" id="address" value={formState.address} onChange={handleInputChange} className="form-input"/>
                    </div>
                     <div>
                        <label htmlFor="contact" className="label">Contact Info</label>
                        <input type="text" name="contact" id="contact" value={formState.contact} onChange={handleInputChange} className="form-input"/>
                    </div>
                     <div>
                        <label className="label">University Logo</label>
                        <div className="mt-1 flex items-center space-x-4">
                            <img src={formState.logo} alt="Current Logo" className="h-16 w-auto bg-gray-200 p-1 rounded"/>
                            <input type="file" accept="image/*" onChange={handleLogoChange} className="file-input"/>
                        </div>
                    </div>
                    <div className="pt-4 border-t dark:border-gray-700">
                         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Bank Details for Fee Vouchers</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="bankName" className="label">Bank Name</label>
                                <input type="text" name="bankName" id="bankName" value={formState.bankName} onChange={handleInputChange} className="form-input"/>
                            </div>
                             <div>
                                <label htmlFor="accountNumber" className="label">Account Number</label>
                                <input type="text" name="accountNumber" id="accountNumber" value={formState.accountNumber} onChange={handleInputChange} className="form-input"/>
                            </div>
                             <div className="md:col-span-2">
                                <label htmlFor="branchName" className="label">Branch Name</label>
                                <input type="text" name="branchName" id="branchName" value={formState.branchName} onChange={handleInputChange} className="form-input"/>
                            </div>
                         </div>
                    </div>
                    <div className="flex justify-end items-center">
                        {feedback && <p className="text-green-600 dark:text-green-400 text-sm mr-4">{feedback}</p>}
                        <button type="submit" className="btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Management</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Download a complete backup of all university data. This includes users, courses, students, results, and all other records.</p>
                <div className="text-right">
                     <button
                        onClick={handleExportData}
                        className="btn-primary"
                    >
                        Download All University Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UniversitySettings;