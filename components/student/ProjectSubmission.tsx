import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Student } from '../../types';

const ProjectSubmission: React.FC = () => {
    const { user } = useAuth();
    const { students, courses, projectSubmissions, addProjectSubmission } = useData();
    const [formState, setFormState] = useState({ subject: '', title: '', description: '', fileUrl: '', fileName: '' });
    const [feedback, setFeedback] = useState('');

    const student = useMemo(() => students.find(s => s.id === user?.id) as Student, [students, user]);
    
    const studentSubmissions = useMemo(() => {
        return projectSubmissions
            .filter(p => p.studentId === student?.id)
            .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    }, [projectSubmissions, student]);

    const studentCourse = useMemo(() => {
        if (!student || !student.details) return null;
        return courses.find(c => c.id === student.details!.courseId);
    }, [student, courses]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                setFormState(prev => ({ ...prev, fileUrl: url, fileName: file.name }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.subject || !formState.title || !formState.fileUrl || !studentCourse) {
            setFeedback('Please fill all fields and upload a file.');
            return;
        }
        addProjectSubmission({
            studentId: student.id,
            studentName: student.name,
            courseId: studentCourse.id,
            ...formState,
        });
        setFeedback('Project submitted successfully!');
        setFormState({ subject: '', title: '', description: '', fileUrl: '', fileName: '' });
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setFeedback(''), 3000);
    };
    
    if (!student?.isRegistered) {
         return (
            <div className="card p-8 text-center">
                <h2 className="text-xl font-bold mb-2">Registration Required</h2>
                <p>Please complete your registration to submit project work.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="card p-8">
                <h2 className="text-2xl font-bold mb-6">Submit Project Work</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-section">
                        <h3 className="form-section-title">Submission Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Subject</label>
                                <select value={formState.subject} onChange={e => setFormState({...formState, subject: e.target.value})} className="form-select" required>
                                    <option value="">-- Select a subject --</option>
                                    {studentCourse?.subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Project Title</label>
                                <input type="text" value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} className="form-input" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Description (Optional)</label>
                                <textarea value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} className="form-input" rows={3}/>
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Upload Project File</label>
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    className="file-input" 
                                    required 
                                    accept=".pdf,.doc,.docx,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                />
                                {formState.fileName ? (
                                    <p className="text-xs text-gray-400 mt-1">Selected: {formState.fileName}</p>
                                ) : (
                                    <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX, Images.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center">
                        {feedback && <p className="text-green-400 text-sm mr-4">{feedback}</p>}
                        <button type="submit" className="btn-primary">Submit Project</button>
                    </div>
                </form>
            </div>
            
            <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">My Submissions</h3>
                <div className="space-y-4">
                    {studentSubmissions.length > 0 ? studentSubmissions.map(sub => (
                        <div key={sub.id} className="border border-[var(--border-color)] rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-lg">{sub.title}</h4>
                                    <p className="text-sm text-cyan-400">{sub.subject}</p>
                                    <p className="text-xs text-gray-400">Submitted on: {new Date(sub.submissionDate).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-xl">{sub.grade || 'Not Graded'}</p>
                                </div>
                            </div>
                             {sub.feedback && (
                                <div className="mt-3 pt-3 border-t border-gray-700 bg-gray-900/50 p-3 rounded-md">
                                    <p className="font-semibold text-sm">Feedback:</p>
                                    <p className="text-sm whitespace-pre-wrap">{sub.feedback}</p>
                                </div>
                            )}
                        </div>
                    )) : <p className="text-center text-gray-400 py-4">You have not submitted any projects yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default ProjectSubmission;