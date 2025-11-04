import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { EntranceApplication, ExamType } from '../../types';
import AdmitCard from '../common/AdmitCard';

const PrintEntranceAdmitCardModal: React.FC<{ application: EntranceApplication; onClose: () => void }> = ({ application, onClose }) => {
    const { courses, universityInfo, exams } = useData();
    const course = courses.find(c => c.id === application.courseId);
    const entranceExam = exams.find(e => e.type === ExamType.ENTRANCE && e.courseId === application.courseId);

    const handlePrint = () => {
        window.print();
    };
    
    const entranceRollNo = `ENT-${application.id.slice(-5).toUpperCase()}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print">
            <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg w-full max-w-2xl">
                <AdmitCard
                    title="Entrance Exam Admit Card"
                    studentInfo={{
                        name: application.applicantName,
                        photo: application.documents.photo,
                        rollNumber: entranceRollNo,
                        courseName: course?.name || 'N/A',
                    }}
                    examInfo={{
                        name: entranceExam?.name || 'University Entrance Test',
                        date: entranceExam?.date || 'To be announced',
                        time: entranceExam?.time || 'To be announced',
                        subjects: entranceExam?.subjects || ['General Aptitude', 'Course-specific test'],
                        venue: 'Main Examination Hall',
                    }}
                    universityInfo={universityInfo}
                />
                <div className="flex justify-end gap-4 pt-6">
                    <button type="button" onClick={onClose} className="btn-secondary">Close</button>
                    <button type="button" onClick={handlePrint} className="btn-primary">Print</button>
                </div>
            </div>
        </div>
    );
};

const initialFormState = {
    applicantName: '', email: '', phone: '', dob: '', address: '', courseId: '',
    previousEducation: { institution: '', degree: '', year: new Date().getFullYear(), grade: '' },
    documents: { photo: '', previousMarksheet: '', citizenshipDoc: '' }
};

type FormState = Omit<EntranceApplication, 'id' | 'status'>;

const EntranceForm: React.FC = () => {
    const { courses, addEntranceApplication } = useData();
    const [formState, setFormState] = useState<FormState>(initialFormState);
    const [feedback, setFeedback] = useState('');
    const [lastSubmittedApp, setLastSubmittedApp] = useState<EntranceApplication | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'previousMarksheet' | 'citizenshipDoc') => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormState(prev => ({
                    ...prev,
                    documents: { ...prev.documents, [field]: event.target?.result as string }
                }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formState.courseId) {
             setFormState(prev => ({ ...prev, courseId: courses[0]?.id || '' }));
        }
        const newApp = addEntranceApplication(formState);
        setFeedback('Entrance application submitted successfully!');
        setFormState(initialFormState);
        setLastSubmittedApp(newApp);
        setTimeout(() => setFeedback(''), 4000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            {lastSubmittedApp && <PrintEntranceAdmitCardModal application={lastSubmittedApp} onClose={() => setLastSubmittedApp(null)} />}
            <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Entrance Exam Application</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <section className="form-section">
                        <h3 className="form-section-title">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="label">Full Name</label><input type="text" value={formState.applicantName} onChange={e => setFormState({...formState, applicantName: e.target.value})} className="form-input" required/></div>
                            <div><label className="label">Date of Birth</label><input type="date" value={formState.dob} onChange={e => setFormState({...formState, dob: e.target.value})} className="form-input" required /></div>
                            <div><label className="label">Phone Number</label><input type="tel" value={formState.phone} onChange={e => setFormState({...formState, phone: e.target.value})} className="form-input" required/></div>
                            <div><label className="label">Email Address</label><input type="email" value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})} className="form-input" required/></div>
                            <div className="md:col-span-2"><label className="label">Full Address</label><input type="text" value={formState.address} onChange={e => setFormState({...formState, address: e.target.value})} className="form-input" required/></div>
                        </div>
                    </section>
                    
                    <section className="form-section">
                        <h3 className="form-section-title">Academic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                               <label className="label">Applying for Course</label>
                               <select value={formState.courseId} onChange={e => setFormState({...formState, courseId: e.target.value})} className="form-select" required>
                                   <option value="" disabled>-- Select a course --</option>
                                   {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                               </select>
                            </div>
                            <div><label className="label">Previous Institution</label><input type="text" value={formState.previousEducation.institution} onChange={e => setFormState({...formState, previousEducation: {...formState.previousEducation, institution: e.target.value}})} className="form-input" required/></div>
                            <div><label className="label">Degree/Certificate</label><input type="text" value={formState.previousEducation.degree} onChange={e => setFormState({...formState, previousEducation: {...formState.previousEducation, degree: e.target.value}})} className="form-input" required/></div>
                            <div><label className="label">Year of Passing</label><input type="number" value={formState.previousEducation.year} onChange={e => setFormState({...formState, previousEducation: {...formState.previousEducation, year: parseInt(e.target.value, 10)}})} className="form-input" required/></div>
                            <div><label className="label">Grade/Percentage</label><input type="text" value={formState.previousEducation.grade} onChange={e => setFormState({...formState, previousEducation: {...formState.previousEducation, grade: e.target.value}})} className="form-input" required/></div>
                        </div>
                    </section>
                    
                    <section className="form-section">
                        <h3 className="form-section-title">Document Upload</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div>
                                <label className="label">Passport Size Photo</label>
                                <input type="file" accept="image/jpeg, image/png" onChange={(e) => handleFileChange(e, 'photo')} className="file-input" required/>
                                {formState.documents.photo && <img src={formState.documents.photo} alt="Photo preview" className="mt-2 h-24 w-24 object-cover rounded-md border dark:border-gray-600"/>}
                            </div>
                             <div>
                                <label className="label">Previous Marksheet</label>
                                <input type="file" accept="image/jpeg, image/png, application/pdf" onChange={(e) => handleFileChange(e, 'previousMarksheet')} className="file-input" required/>
                                 {formState.documents.previousMarksheet && formState.documents.previousMarksheet.startsWith('data:image') && <img src={formState.documents.previousMarksheet} alt="Marksheet preview" className="mt-2 h-24 w-auto object-contain rounded-md border dark:border-gray-600"/>}
                                 {formState.documents.previousMarksheet && formState.documents.previousMarksheet.startsWith('data:application/pdf') && <p className="text-xs mt-2 text-green-600">PDF uploaded.</p>}
                            </div>
                            <div>
                                <label className="label">Citizenship Document</label>
                                <input type="file" accept="image/jpeg, image/png, application/pdf" onChange={(e) => handleFileChange(e, 'citizenshipDoc')} className="file-input" required/>
                                {formState.documents.citizenshipDoc && formState.documents.citizenshipDoc.startsWith('data:image') && <img src={formState.documents.citizenshipDoc} alt="Document preview" className="mt-2 h-24 w-auto object-contain rounded-md border dark:border-gray-600"/>}
                                 {formState.documents.citizenshipDoc && formState.documents.citizenshipDoc.startsWith('data:application/pdf') && <p className="text-xs mt-2 text-green-600">PDF uploaded.</p>}
                            </div>
                        </div>
                    </section>
                    
                    <div className="flex justify-end items-center pt-4">
                        {feedback && !lastSubmittedApp && <p className="text-green-600 dark:text-green-400 text-sm mr-4">{feedback}</p>}
                        <button type="submit" className="btn-primary">Submit Application</button>
                    </div>
                </form>
                {lastSubmittedApp && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/50 rounded-lg text-center border border-green-200 dark:border-green-700">
                        <p className="font-semibold text-green-800 dark:text-green-200">{feedback}</p>
                        <button onClick={() => setLastSubmittedApp(lastSubmittedApp)} className="btn-primary mt-2">
                            Print Admit Card
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EntranceForm;