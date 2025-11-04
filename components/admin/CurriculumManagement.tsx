

import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Course, Subject, SyllabusMaterial } from '../../types';

const AddSubjectForm: React.FC<{ courseId: string; onSubjectAdded: () => void }> = ({ courseId, onSubjectAdded }) => {
    const { addSubjectToCourse } = useData();
    const [formState, setFormState] = useState({ name: '', code: '', creditHours: 3, semester: 1 });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formState.name || !formState.code || formState.creditHours <= 0 || formState.semester <= 0) return;
        addSubjectToCourse(courseId, formState);
        setFormState({ name: '', code: '', creditHours: 3, semester: 1 });
        onSubjectAdded();
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
            <div className="col-span-full sm:col-span-2"><label className="label text-xs">Subject Name</label><input type="text" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="form-input text-sm" required /></div>
            <div><label className="label text-xs">Code</label><input type="text" value={formState.code} onChange={e => setFormState({...formState, code: e.target.value})} className="form-input text-sm" required /></div>
            <div><label className="label text-xs">Credits</label><input type="number" value={formState.creditHours} onChange={e => setFormState({...formState, creditHours: parseInt(e.target.value)})} className="form-input text-sm" required /></div>
            <div><button type="submit" className="btn-primary w-full">Add Subject</button></div>
        </form>
    );
};

const readFileAsDataURL = (file: File): Promise<{ dataUrl: string, name: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ dataUrl: reader.result as string, name: file.name });
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const SyllabusUploadModal: React.FC<{ 
    courseId: string;
    subject: Subject;
    onClose: () => void;
}> = ({ courseId, subject, onClose }) => {
    const { updateSubjectSyllabus } = useData();
    const [feedback, setFeedback] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    const [files, setFiles] = useState<{ pdf?: File, doc?: File, image?: File }>({});

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'doc' | 'image') => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setFeedback('');

        const syllabusData: SyllabusMaterial = {};

        try {
            if (files.pdf) {
                const { dataUrl, name } = await readFileAsDataURL(files.pdf);
                syllabusData.pdfUrl = dataUrl;
                syllabusData.pdfName = name;
            }
            if (files.doc) {
                const { dataUrl, name } = await readFileAsDataURL(files.doc);
                syllabusData.docUrl = dataUrl;
                syllabusData.docName = name;
            }
            if (files.image) {
                const { dataUrl, name } = await readFileAsDataURL(files.image);
                syllabusData.imageUrl = dataUrl;
                syllabusData.imageName = name;
            }
            
            if (Object.keys(syllabusData).length > 0) {
                updateSubjectSyllabus(courseId, subject.id, syllabusData);
                setFeedback('Syllabus updated successfully!');
            } else {
                setFeedback('No new files selected.');
            }

        } catch (error) {
            setFeedback('Error reading file.');
            console.error(error);
        }

        setIsSaving(false);
        setTimeout(onClose, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4">Manage Syllabus for <span className="text-indigo-500">{subject.name}</span></h3>
                <div className="space-y-4">
                    <div>
                        <label className="label">Upload PDF Syllabus</label>
                        <input type="file" accept=".pdf" onChange={e => handleFileChange(e, 'pdf')} className="file-input" />
                        <span className="text-xs text-gray-500 mt-1 block">{subject.syllabus?.pdfName ? `Current: ${subject.syllabus.pdfName}` : 'No PDF uploaded.'}</span>
                    </div>
                     <div>
                        <label className="label">Upload Document (Word, etc.)</label>
                        <input type="file" accept=".doc,.docx,.txt" onChange={e => handleFileChange(e, 'doc')} className="file-input" />
                         <span className="text-xs text-gray-500 mt-1 block">{subject.syllabus?.docName ? `Current: ${subject.syllabus.docName}` : 'No document uploaded.'}</span>
                    </div>
                     <div>
                        <label className="label">Upload Image (e.g., curriculum map)</label>
                        <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'image')} className="file-input" />
                         <span className="text-xs text-gray-500 mt-1 block">{subject.syllabus?.imageName ? `Current: ${subject.syllabus.imageName}`: 'No image uploaded.'}</span>
                    </div>
                </div>
                {feedback && <p className="text-green-600 text-sm mt-4">{feedback}</p>}
                <div className="flex justify-end gap-4 pt-6">
                    <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    <button type="button" onClick={handleSave} className="btn-primary" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Syllabus'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const CurriculumManagement: React.FC = () => {
    const { courses, addCourse, deleteCourse, deleteSubjectFromCourse } = useData();
    const [newCourseName, setNewCourseName] = useState('');
    const [feedback, setFeedback] = useState('');
    const [modalState, setModalState] = useState<{ isOpen: boolean; courseId: string; subject: Subject | null }>({
        isOpen: false,
        courseId: '',
        subject: null
    });

    const handleAddCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCourseName) {
            setFeedback('Please enter a course name.');
            return;
        }
        addCourse({ name: newCourseName, subjects: [] });
        setFeedback('Course added successfully!');
        setNewCourseName('');
        setTimeout(() => setFeedback(''), 3000);
    };

    const handleDeleteCourse = (courseId: string, courseName: string) => {
        if (window.confirm(`Are you sure you want to delete the course "${courseName}"? This action cannot be undone.`)) {
            deleteCourse(courseId);
        }
    };

    const handleDeleteSubject = (courseId: string, subjectId: string, subjectName: string) => {
        if (window.confirm(`Are you sure you want to delete the subject "${subjectName}"?`)) {
            deleteSubjectFromCourse(courseId, subjectId);
        }
    };

    return (
        <div className="space-y-8">
            {modalState.isOpen && modalState.subject && (
                <SyllabusUploadModal
                    courseId={modalState.courseId}
                    subject={modalState.subject}
                    onClose={() => setModalState({ isOpen: false, courseId: '', subject: null })}
                />
            )}

            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Course</h2>
                <form onSubmit={handleAddCourse} className="space-y-4">
                    <div>
                        <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Course Name</label>
                        <input
                            type="text"
                            id="courseName"
                            value={newCourseName}
                            onChange={(e) => setNewCourseName(e.target.value)}
                            className="mt-1 w-full form-input"
                            placeholder="e.g., Bachelor of Science in AI"
                        />
                    </div>
                    <div className="flex justify-end items-center pt-2">
                        {feedback && <p className="text-green-600 dark:text-green-400 text-sm mr-4">{feedback}</p>}
                        <button type="submit" className="btn-primary">Add Course</button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
                 <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Existing Courses & Subjects</h2>
                {courses.map(course => (
                    <div key={course.id} className="p-4 border dark:border-gray-700 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{course.name}</h3>
                            <button 
                                onClick={() => handleDeleteCourse(course.id, course.name)} 
                                className="btn-secondary btn-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900">
                                Delete Course
                            </button>
                        </div>
                        <div className="overflow-x-auto mb-3">
                             <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-2">Subject Name</th>
                                        <th className="px-4 py-2">Code</th>
                                        <th className="px-4 py-2">Credits</th>
                                        <th className="px-4 py-2">Semester</th>
                                        <th className="px-4 py-2">Syllabus</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {course.subjects.map(subject => (
                                        <tr key={subject.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td className="px-4 py-2 font-medium">{subject.name}</td>
                                            <td className="px-4 py-2">{subject.code}</td>
                                            <td className="px-4 py-2">{subject.creditHours}</td>
                                            <td className="px-4 py-2">{subject.semester}</td>
                                            <td className="px-4 py-2">
                                                <div className="flex space-x-2 text-lg">
                                                    {subject.syllabus?.pdfUrl && <span title={subject.syllabus.pdfName || 'PDF available'}>📄</span>}
                                                    {subject.syllabus?.docUrl && <span title={subject.syllabus.docName || 'Document available'}>📝</span>}
                                                    {subject.syllabus?.imageUrl && <span title={subject.syllabus.imageName || 'Image available'}>🖼️</span>}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                                                <button onClick={() => setModalState({ isOpen: true, courseId: course.id, subject: subject })} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                                    Manage
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteSubject(course.id, subject.id, subject.name)}
                                                    className="font-medium text-red-600 dark:text-red-400 hover:underline">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {course.subjects.length === 0 && (
                                        <tr><td colSpan={6} className="text-center py-3 text-gray-500">No subjects added yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <AddSubjectForm courseId={course.id} onSubjectAdded={() => {}} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CurriculumManagement;