import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Complaint, ComplaintStatus } from '../../types';

const ComplaintDetailModal: React.FC<{
    complaint: Complaint;
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<Complaint>) => void;
}> = ({ complaint, onClose, onUpdate }) => {
    const [status, setStatus] = useState(complaint.status);
    const [response, setResponse] = useState(complaint.response || '');

    const handleSave = () => {
        onUpdate(complaint.id, { status, response });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-4">Complaint Details</h3>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <p><strong>Student:</strong> {complaint.studentName}</p>
                    <p><strong>Date:</strong> {new Date(complaint.date).toLocaleString()}</p>
                    <p><strong>Title:</strong> {complaint.title}</p>
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <p className="font-semibold">Description:</p>
                        <p className="whitespace-pre-wrap">{complaint.description}</p>
                    </div>
                    <div>
                        <label className="label">Update Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value as ComplaintStatus)} className="form-select">
                            {Object.values(ComplaintStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="label">Response (optional)</label>
                        <textarea rows={4} value={response} onChange={e => setResponse(e.target.value)} className="form-input" />
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-4 mt-4 border-t dark:border-gray-700">
                    <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    <button type="button" onClick={handleSave} className="btn-primary">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

const ManageComplaints: React.FC = () => {
    const { complaints, updateComplaint } = useData();
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

    const getStatusColor = (status: ComplaintStatus) => {
        switch (status) {
            case ComplaintStatus.RESOLVED: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case ComplaintStatus.IN_REVIEW: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case ComplaintStatus.PENDING: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };
    
    const sortedComplaints = [...complaints].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <>
            {selectedComplaint && <ComplaintDetailModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} onUpdate={updateComplaint} />}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Manage Student Complaints</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Student</th>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedComplaints.map(c => (
                                <tr key={c.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td className="px-6 py-4">{new Date(c.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{c.studentName}</td>
                                    <td className="px-6 py-4 truncate max-w-xs">{c.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(c.status)}`}>{c.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => setSelectedComplaint(c)} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                            View & Respond
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {complaints.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-4">No complaints have been submitted.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ManageComplaints;
