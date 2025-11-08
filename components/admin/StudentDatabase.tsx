import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Student, StudentDetails } from '../../types';
import { useAuth } from '../../contexts/AuthContext';


const StudentEditModal: React.FC<{ student: Student; onClose: () => void }> = ({ student, onClose }) => {
    const { courses, rooms, hostels, updateStudentProfileByAdmin } = useData();
    const { updateUser } = useAuth();
    
    const [formData, setFormData] = useState({
        name: student.name,
        details: student.details ? { ...student.details } : {} as StudentDetails,
        newRoomId: student.hostelInfo?.roomId || ''
    });
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    useEffect(() => {
        // Ensure details object exists
        if (!student.details) {
            onClose(); // Or handle this error case appropriately
            return;
        }
        setFormData({
            name: student.name,
            details: { ...student.details },
            newRoomId: student.hostelInfo?.roomId || ''
        });
    }, [student, onClose]);

    const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            details: {
                ...prev.details,
                [name]: name === 'currentSemester' ? parseInt(value) : value
            }
        }));
    };
    
    const handleTopLevelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        setFeedback({ type: '', message: '' });

        // Update name in auth context
        updateUser(student.id, { name: formData.name });

        // Update details in data context
        const result = updateStudentProfileByAdmin(student.id, {
            name: formData.name,
            details: formData.details,
            newRoomId: formData.newRoomId || null
        });

        setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
        if (result.success) {
            setTimeout(onClose, 1500);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="card w-full max-w-3xl p-6">
                <h3 className="text-xl font-bold mb-4">Edit Profile for {student.name}</h3>
                <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                    <div className="form-section">
                        <h4 className="form-section-title">Personal & Contact Info</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="label">Full Name</label><input type="text" name="name" value={formData.name} onChange={handleTopLevelChange} className="form-input"/></div>
                            <div><label className="label">Father's Name</label><input type="text" name="fatherName" value={formData.details.fatherName} onChange={handleDetailChange} className="form-input"/></div>
                            <div><label className="label">Email</label><input type="email" name="email" value={formData.details.email} onChange={handleDetailChange} className="form-input"/></div>
                            <div><label className="label">Contact</label><input type="tel" name="contact" value={formData.details.contact} onChange={handleDetailChange} className="form-input"/></div>
                            <div><label className="label">Date of Birth</label><input type="date" name="dob" value={formData.details.dob} onChange={handleDetailChange} className="form-input"/></div>
                            <div className="md:col-span-2"><label className="label">Address</label><input type="text" name="address" value={formData.details.address} onChange={handleDetailChange} className="form-input"/></div>
                        </div>
                    </div>
                     <div className="form-section">
                        <h4 className="form-section-title">Academic & Hostel Info</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="label">Course</label>
                                <select name="courseId" value={formData.details.courseId} onChange={handleDetailChange} className="form-select">
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Current Semester</label>
                                <input type="number" name="currentSemester" min="1" max="8" value={formData.details.currentSemester} onChange={handleDetailChange} className="form-input"/>
                            </div>
                            <div>
                                <label className="label">Hostel Room</label>
                                <select name="newRoomId" value={formData.newRoomId} onChange={handleTopLevelChange} className="form-select">
                                    <option value="">-- Not Assigned --</option>
                                    {rooms.map(r => {
                                        const hostel = hostels.find(h => h.id === r.hostelId);
                                        return <option key={r.id} value={r.id}>{hostel?.name} - {r.roomNumber}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                 <div className="flex justify-end items-center gap-4 pt-4 mt-4 border-t border-gray-700">
                    {feedback.message && <p className={`text-sm ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{feedback.message}</p>}
                    <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    <button type="button" onClick={handleSave} className="btn-primary">Save Changes</button>
                </div>
            </div>
        </div>
    );
};


const StudentJourney: React.FC<{ student: Student }> = ({ student }) => {
    const steps = ['Registered', `Semester ${student.details?.currentSemester || 1}`, 'Mid-Terms', 'Finals', 'Graduated'];
    // Assuming current progress is up to the current semester
    const currentStepIndex = 1;

    return (
        <div className="mt-6">
            <h4 className="text-lg font-semibold mb-4">Student Journey</h4>
            <div className="flex items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${index <= currentStepIndex ? 'bg-cyan-500 border-cyan-400 text-white' : 'bg-gray-700 border-gray-600 text-gray-400'}`}>
                                {index < currentStepIndex ? '✓' : index + 1}
                            </div>
                            <p className={`text-xs mt-2 text-center ${index <= currentStepIndex ? 'text-white' : 'text-gray-400'}`}>{step}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-1 ${index < currentStepIndex ? 'bg-cyan-500' : 'bg-gray-700'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};


interface StudentProfileViewProps {
    student: Student;
    onDeleteStudent: (student: Student) => void;
    onEditStudent: (student: Student) => void;
}

const StudentProfileView: React.FC<StudentProfileViewProps> = ({ student, onDeleteStudent, onEditStudent }) => {
    const { courses, attendanceRecords, hostels } = useData();
    const course = courses.find(c => c.id === student.details?.courseId);

    const attendanceSummary = useMemo(() => {
        const records = attendanceRecords.filter(r => r.studentId === student.id);
        const present = records.filter(r => r.status === 'Present').length;
        const total = records.length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 'N/A';
        return { present, total, percentage };
    }, [attendanceRecords, student.id]);
    
    const hostelName = student.hostelInfo ? hostels.find(h => h.id === student.hostelInfo.hostelId)?.name : null;


    return (
        <div className="mt-6 bg-gray-900/50 p-6 rounded-lg animate-fade-in">
            <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex-shrink-0 text-center">
                    <img src={student.photo} alt={student.name} className="h-32 w-32 rounded-full object-cover mx-auto border-4 border-gray-700 shadow-lg"/>
                    <img src={student.signature} alt="Signature" className="mt-4 h-16 w-32 object-contain bg-gray-700 p-2 rounded-md shadow-sm"/>
                </div>
                <div className="w-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-white">{student.name}</h3>
                            <p className="text-indigo-400 font-semibold">{course?.name}</p>
                        </div>
                        <button onClick={() => onEditStudent(student)} className="btn-secondary">Edit Profile</button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 mt-4 text-sm">
                        <div><strong className="block text-gray-500">Reg. No</strong> {student.registrationNumber}</div>
                        <div><strong className="block text-gray-500">Roll No</strong> {student.rollNumber}</div>
                        <div><strong className="block text-gray-500">Email</strong> {student.details?.email}</div>
                        <div><strong className="block text-gray-500">Contact</strong> {student.details?.contact}</div>
                        <div><strong className="block text-gray-500">Father's Name</strong> {student.details?.fatherName}</div>
                        <div><strong className="block text-gray-500">D.O.B</strong> {student.details?.dob}</div>
                        <div className="col-span-full"><strong className="block text-gray-500">Address</strong> {student.details?.address}</div>
                    </div>
                </div>
            </div>
            
            <StudentJourney student={student} />

             <div className="mt-6 pt-6 border-t border-gray-700">
                 <h4 className="text-lg font-semibold mb-2">Academic & Document Summary</h4>
                 <div className="flex flex-wrap gap-4">
                    <div className="bg-gray-800 p-4 rounded-md shadow-sm text-center flex-1">
                        <p className="text-gray-400">Overall Attendance</p>
                        <p className="text-3xl font-bold text-white">{attendanceSummary.percentage}%</p>
                        <p className="text-xs text-gray-500">({attendanceSummary.present} / {attendanceSummary.total} classes attended)</p>
                    </div>
                    {student.hostelInfo && (
                         <div className="bg-gray-800 p-4 rounded-md shadow-sm text-center flex-1">
                            <p className="text-gray-400">Hostel Info</p>
                            <p className="text-xl font-bold text-white">{hostelName}</p>
                            <p className="text-sm text-gray-300">Room: {student.hostelInfo.roomNumber}</p>
                        </div>
                    )}
                    {student.details?.citizenshipDoc && (
                         <div className="bg-gray-800 p-4 rounded-md shadow-sm text-center flex-1">
                            <p className="text-gray-400">Citizenship Document</p>
                             <div className="mt-2">
                                <a href={student.details.citizenshipDoc} download={`citizenship-${student.registrationNumber}`} className="btn-secondary">
                                    Download
                                </a>
                             </div>
                        </div>
                    )}
                 </div>
             </div>
             <div className="mt-6 pt-6 border-t border-red-700/50">
                 <h4 className="text-lg font-semibold mb-2 text-red-400">Danger Zone</h4>
                 <div className="bg-red-900/20 p-4 rounded-md flex justify-between items-center">
                     <div>
                         <p className="font-bold">Delete Student Record</p>
                         <p className="text-sm text-red-300">This will permanently remove the student and all associated data.</p>
                     </div>
                     <button onClick={() => onDeleteStudent(student)} className="btn-danger">
                         Delete Permanently
                     </button>
                 </div>
             </div>
        </div>
    );
};

const StudentDatabase: React.FC = () => {
    const { getStudentByRegNo, deleteStudentData } = useData();
    const { deleteUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [error, setError] = useState('');
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSelectedStudent(null);
        const student = getStudentByRegNo(searchQuery);
        if (student) {
            setSelectedStudent(student);
        } else {
            setError('No student found with that registration number.');
        }
    };

    const handleDeleteStudent = (student: Student) => {
        if (window.confirm(`Are you sure you want to permanently delete all data for ${student.name} (${student.registrationNumber})? This includes their user account, results, attendance, and fee payments. This action cannot be undone.`)) {
            // Delete user account
            deleteUser(student.id);
            // Delete associated student data
            deleteStudentData(student.id);
            // Clear the view
            setSelectedStudent(null);
            setSearchQuery('');
        }
    };

    return (
        <div className="space-y-6">
            {editingStudent && <StudentEditModal student={editingStudent} onClose={() => setEditingStudent(null)} />}
            <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Student Tracking System</h2>
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="form-input flex-grow"
                        placeholder="Enter student registration number..."
                    />
                    <button type="submit" className="btn-primary">Search</button>
                </form>
                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {selectedStudent && <StudentProfileView student={selectedStudent} onDeleteStudent={handleDeleteStudent} onEditStudent={setEditingStudent} />}
        </div>
    );
};

export default StudentDatabase;
