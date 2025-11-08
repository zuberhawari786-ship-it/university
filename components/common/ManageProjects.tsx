import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { ProjectSubmission } from '../../types';

const GradeModal: React.FC<{
    submission: ProjectSubmission;
    onClose: () => void;
    onSave: (id: string, grade: string, feedback: string) => void;
}> = ({ submission, onClose, onSave }) => {
    const [grade, setGrade] = useState(submission.grade || '');
    const [feedback, setFeedback] = useState(submission.feedback || '');
    
    const handleSave = () => {
        onSave(submission.id, grade, feedback);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="card p-6 w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4">Grade Submission</h3>
                <div className="space-y-4">
                    <p><strong>Student:</strong> {submission.studentName}</p>
                    <p><strong>Project:</strong> {submission.title}</p>
                    <div>
                        <label className="label">Grade</label>
                        <input type="text" value={grade} onChange={e => setGrade(e.target.value)} className="form-input" placeholder="e.g., A+, B, 85/100" />
                    </div>
                    <div>
                        <label className="label">Feedback</label>
                        <textarea value={feedback} onChange={e => setFeedback(e.target.value)} className="form-input" rows={4} placeholder="Provide constructive feedback..."/>
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-6">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={handleSave} className="btn-primary">Save Grade</button>
                </div>
            </div>
        </div>
    );
};

const ManageProjects: React.FC = () => {
    const { projectSubmissions, gradeProjectSubmission } = useData();
    const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);

    return (
        <div className="space-y-6">
            {selectedSubmission && (
                <GradeModal 
                    submission={selectedSubmission}
                    onClose={() => setSelectedSubmission(null)}
                    onSave={gradeProjectSubmission}
                />
            )}
            <h2 className="text-2xl font-bold">Project Submissions</h2>

            <div className="card p-6">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-xs text-gray-400 uppercase">
                            <tr>
                                <th className="p-2">Date</th>
                                <th className="p-2">Student</th>
                                <th className="p-2">Subject</th>
                                <th className="p-2">Title</th>
                                <th className="p-2">File</th>
                                <th className="p-2">Grade</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectSubmissions.map(sub => (
                                <tr key={sub.id} className="border-t border-[var(--border-color)]">
                                    <td className="p-2">{new Date(sub.submissionDate).toLocaleDateString()}</td>
                                    <td className="p-2">{sub.studentName}</td>
                                    <td className="p-2">{sub.subject}</td>
                                    <td className="p-2">{sub.title}</td>
                                    <td className="p-2">
                                        <a href={sub.fileUrl} download={sub.fileName} className="text-cyan-400 hover:underline">Download</a>
                                    </td>
                                    <td className="p-2 font-bold">{sub.grade || 'N/A'}</td>
                                    <td className="p-2">
                                        <button onClick={() => setSelectedSubmission(sub)} className="btn-primary btn-sm">
                                            {sub.grade ? 'Edit Grade' : 'Grade'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {projectSubmissions.length === 0 && <p className="text-center py-8 text-gray-400">No projects have been submitted yet.</p>}
                 </div>
            </div>
        </div>
    );
};

export default ManageProjects;