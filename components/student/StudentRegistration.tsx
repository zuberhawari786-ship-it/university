import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Student } from '../../types';

interface StudentRegistrationProps {
    setActivePage: (page: string) => void;
}

const StudentRegistration: React.FC<StudentRegistrationProps> = ({ setActivePage }) => {
    const { user } = useAuth();
    const { students, courses, updateStudentRegistration } = useData();
    const [student, setStudent] = useState<Student | undefined>();
    const [formData, setFormData] = useState({
        email: '', contact: '', dob: '', address: '', fatherName: '', courseId: '',
        photo: '', signature: '', citizenshipDoc: ''
    });
    const [feedback, setFeedback] = useState('');

    // OTP State
    const [otpSent, setOtpSent] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [otpFeedback, setOtpFeedback] = useState({ type: '', message: '' });


    useEffect(() => {
        if (user) {
            const currentStudent = students.find(s => s.id === user.id);
            setStudent(currentStudent);
            if (currentStudent?.details) {
                setFormData({
                    ...currentStudent.details,
                    photo: currentStudent.photo,
                    signature: currentStudent.signature,
                });
            } else if (courses.length > 0) {
                setFormData(prev => ({ ...prev, courseId: courses[0].id }));
            }
        }
    }, [user, students, courses]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'signature' | 'citizenshipDoc') => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({ ...prev, [field]: event.target?.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleSendOtp = () => {
        // Basic validation for a 10-digit number
        if (!formData.contact || !/^\d{10}$/.test(formData.contact.replace(/\D/g, ''))) {
            setOtpFeedback({ type: 'error', message: 'Please enter a valid 10-digit contact number.' });
            return;
        }
        setOtpFeedback({ type: 'info', message: 'Sending OTP...' });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otp);
        console.log(`Generated OTP: ${otp}`); // For debugging
        
        setTimeout(() => {
            // In a real app, this would be an API call. Here we simulate it.
            alert(`Your OTP for Gemini University is: ${otp}`);
            setOtpSent(true);
            setOtpFeedback({ type: 'success', message: `An OTP has been sent to ${formData.contact}.` });
        }, 1500);
    };

    const handleVerifyOtp = () => {
        if (otpInput === generatedOtp) {
            setIsVerified(true);
            setOtpFeedback({ type: 'success', message: 'Contact number verified successfully!' });
        } else {
            setIsVerified(false);
            setOtpFeedback({ type: 'error', message: 'Invalid OTP. Please try again.' });
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isVerified) {
            setFeedback('Please verify your contact number with an OTP before submitting.');
            return;
        }
        if (!student) return;

        const regNumber = `GEM-${new Date().getFullYear()}-${String(students.length + 1).padStart(3, '0')}`;
        const rollNumber = `${formData.courseId.toUpperCase()}-${String(students.filter(s => s.details?.courseId === formData.courseId).length + 1).padStart(2, '0')}`;

        const { photo, signature, citizenshipDoc, ...details } = formData;

        updateStudentRegistration(student.id, {
            registrationNumber: regNumber,
            rollNumber: rollNumber,
            photo,
            signature,
            details: { ...details, citizenshipDoc, currentSemester: 1 },
        });

        setFeedback('Registration successful! Your registration and roll numbers have been generated.');
        setTimeout(() => setActivePage('dashboard'), 4000);
    };

    if (student?.isRegistered) {
        return (
            <div className="max-w-2xl mx-auto card p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">You are already registered!</h2>
                <p className="text-gray-600 dark:text-gray-400">Registration No: {student.registrationNumber}</p>
                <p className="text-gray-600 dark:text-gray-400">Roll No: {student.rollNumber}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto card p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Student Registration Form</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="form-section">
                    <h3 className="form-section-title">Personal & Academic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="label">Email Address</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" required/></div>
                        <div><label className="label">Contact Number</label><input type="tel" name="contact" value={formData.contact} onChange={handleInputChange} className="form-input" required disabled={otpSent}/></div>
                        <div><label className="label">Date of Birth</label><input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="form-input" required/></div>
                        <div><label className="label">Father's Name</label><input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="form-input" required/></div>
                        <div className="md:col-span-2"><label className="label">Full Address</label><input type="text" name="address" value={formData.address} onChange={handleInputChange} className="form-input" required/></div>
                        <div className="md:col-span-2">
                            <label className="label">Course</label>
                            <select name="courseId" value={formData.courseId} onChange={handleInputChange} className="form-select" required>
                                <option value="" disabled>-- Select a course --</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Contact Verification</h3>
                     {!isVerified && (
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">A one-time password (OTP) is required to verify your contact number before submission.</p>
                            <button type="button" onClick={handleSendOtp} className="btn-secondary flex-shrink-0" disabled={otpSent || !formData.contact}>
                                {otpSent ? 'OTP Sent' : 'Send OTP'}
                            </button>
                        </div>
                    )}
                     {isVerified && (
                        <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/50 rounded-md">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            <span className="text-green-800 dark:text-green-200 font-semibold">Your contact number has been successfully verified.</span>
                        </div>
                    )}
                    {otpSent && !isVerified && (
                        <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg space-y-2 border border-indigo-200 dark:border-indigo-800">
                            <label className="label text-indigo-800 dark:text-indigo-200">Enter OTP sent to your contact number</label>
                            <div className="flex items-center gap-2">
                                <input type="text" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="form-input" placeholder="6-digit code" maxLength={6}/>
                                <button type="button" onClick={handleVerifyOtp} className="btn-primary">Verify OTP</button>
                            </div>
                        </div>
                    )}
                    {otpFeedback.message && <p className={`text-sm text-center mt-2 ${otpFeedback.type === 'error' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>{otpFeedback.message}</p>}
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Document Upload</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div><label className="label">Your Photo</label><input type="file" accept="image/*" onChange={e => handleFileChange(e, 'photo')} className="file-input" required/></div>
                        <div><label className="label">Your Signature</label><input type="file" accept="image/*" onChange={e => handleFileChange(e, 'signature')} className="file-input" required/></div>
                        <div><label className="label">Citizenship Document</label><input type="file" accept="image/*,.pdf" onChange={e => handleFileChange(e, 'citizenshipDoc')} className="file-input" required/></div>
                    </div>
                </div>

                <div className="flex justify-end items-center pt-4">
                    {feedback && <p className="text-green-600 dark:text-green-400 text-sm mr-4">{feedback}</p>}
                    <button type="submit" className="btn-primary" disabled={!isVerified}>
                        Complete Registration
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentRegistration;