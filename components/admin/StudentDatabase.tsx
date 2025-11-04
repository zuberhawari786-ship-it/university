

import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Student } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface StudentProfileViewProps {
    student: Student;
    onDeleteStudent: (student: Student) => void;
}

const StudentProfileView: React.FC<StudentProfileViewProps> = ({ student, onDeleteStudent }) => {
    const { courses, attendanceRecords } = useData();
    const course = courses.find(c => c.id === student.details?.courseId);

    const attendanceSummary = useMemo(() => {
        const records = attendanceRecords.filter(r => r.studentId === student.id);
        const present = records.filter(r => r.status === 'Present').length;
        const total = records.length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 'N/A';
        return { present, total, percentage };
    }, [attendanceRecords, student.id]);

    return (
        <div className="mt-6 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg animate-fade-in">
            <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex-shrink-0 text-center">
                    <img src={student.photo} alt={student.name} className="h-32 w-32 rounded-full object-cover mx-auto border-4 border-white dark:border-gray-700 shadow-lg"/>
                    <img src={student.signature} alt="Signature" className="mt-4 h-16 w-32 object-contain bg-white dark:bg-gray-700 p-2 rounded-md shadow-sm"/>
                </div>
                <div className="w-full">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h3>
                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{course?.name}</p>
                    
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
             <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                 <h4 className="text-lg font-semibold mb-2">Academic & Document Summary</h4>
                 <div className="flex flex-wrap gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm text-center flex-1">
                        <p className="text-gray-600 dark:text-gray-400">Overall Attendance</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white">{attendanceSummary.percentage}%</p>
                        <p className="text-xs text-gray-500">({attendanceSummary.present} / {attendanceSummary.total} classes attended)</p>
                    </div>
                    {student.details?.citizenshipDoc && (
                         <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm text-center flex-1">
                            <p className="text-gray-600 dark:text-gray-400">Citizenship Document</p>
                             <div className="mt-2">
                                <a href={student.details.citizenshipDoc} download={`citizenship-${student.registrationNumber}`} className="btn-secondary">
                                    Download
                                </a>
                             </div>
                        </div>
                    )}
                 </div>
             </div>
             <div className="mt-6 pt-6 border-t border-red-300 dark:border-red-700/50">
                 <h4 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">Danger Zone</h4>
                 <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md flex justify-between items-center">
                     <div>
                         <p className="font-bold">Delete Student Record</p>
                         <p className="text-sm text-red-800 dark:text-red-300">This will permanently remove the student and all associated data.</p>
                     </div>
                     <button onClick={() => onDeleteStudent(student)} className="btn-primary bg-red-600 hover:bg-red-700 focus:ring-red-500">
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Student Database</h2>
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

            {selectedStudent && <StudentProfileView student={selectedStudent} onDeleteStudent={handleDeleteStudent} />}
        </div>
    );
};

export default StudentDatabase;