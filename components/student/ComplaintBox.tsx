import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ComplaintStatus } from '../../types';

const ComplaintBox: React.FC = () => {
    const { user } = useAuth();
    const { complaints, addComplaint } = useData();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [feedback, setFeedback] = useState('');

    const studentComplaints = useMemo(() => {
        return complaints.filter(c => c.studentId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [complaints, user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !user) {
            setFeedback('Please fill in both title and description.');
            return;
        }
        addComplaint({
            studentId: user.id,
            studentName: user.name,
            title,
            description,
        });
        setFeedback('Your complaint has been submitted.');
        setTitle('');
        setDescription('');
        setTimeout(() => setFeedback(''), 3000);
    };

    const getStatusColor = (status: ComplaintStatus) => {
        switch (status) {
            case ComplaintStatus.RESOLVED: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case ComplaintStatus.IN_REVIEW: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case ComplaintStatus.PENDING: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="space-y-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Submit a Complaint</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">Complaint Title / Subject</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" required />
                    </div>
                    <div>
                        <label className="label">Detailed Description</label>
                        <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className="form-input" required />
                    </div>
                    <div className="flex justify-end items-center pt-2">
                        {feedback && <p className="text-green-600 dark:text-green-400 text-sm mr-4">{feedback}</p>}
                        <button type="submit" className="btn-primary">Submit Complaint</button>
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">My Complaint History</h3>
                <div className="space-y-4">
                    {studentComplaints.length > 0 ? studentComplaints.map(complaint => (
                        <div key={complaint.id} className="border dark:border-gray-700 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold">{complaint.title}</h4>
                                    <p className="text-xs text-gray-500">Submitted on: {new Date(complaint.date).toLocaleString()}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(complaint.status)}`}>{complaint.status}</span>
                            </div>
                            <p className="text-sm mt-2 whitespace-pre-wrap">{complaint.description}</p>
                            {complaint.response && (
                                <div className="mt-3 pt-3 border-t dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md">
                                    <p className="font-semibold text-sm">Response:</p>
                                    <p className="text-sm whitespace-pre-wrap">{complaint.response}</p>
                                </div>
                            )}
                        </div>
                    )) : <p className="text-center text-gray-500 py-4">You have not submitted any complaints.</p>}
                </div>
            </div>
        </div>
    );
};

export default ComplaintBox;
