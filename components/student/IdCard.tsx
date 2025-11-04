import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const IdCard: React.FC = () => {
    const { user } = useAuth();
    const { students, courses, universityInfo } = useData();

    const student = students.find(s => s.id === user?.id);
    const course = courses.find(c => c.id === student?.details?.courseId);

    if (!student || !student.isRegistered || !student.details) {
        return (
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-2">ID Card Not Available</h2>
                <p>Please complete your registration to generate your ID card.</p>
            </div>
        );
    }
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <div id="id-card" className="max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-4 border-indigo-500 printable">
                <div className="text-center border-b-2 border-indigo-500 pb-4 mb-4">
                    <img src={universityInfo.logo} alt="Logo" className="h-10 mx-auto mb-2"/>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{universityInfo.name}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{universityInfo.address}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <img src={student.photo} alt="Student" className="h-28 w-24 rounded-lg object-cover border-2 border-gray-300"/>
                    <div>
                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{student.name}</h3>
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{course?.name}</p>
                    </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="font-semibold text-gray-600 dark:text-gray-400">Reg. No:</span><span>{student.registrationNumber}</span></div>
                    <div className="flex justify-between"><span className="font-semibold text-gray-600 dark:text-gray-400">Roll No:</span><span>{student.rollNumber}</span></div>
                    <div className="flex justify-between"><span className="font-semibold text-gray-600 dark:text-gray-400">D.O.B:</span><span>{student.details.dob}</span></div>
                    <div className="flex justify-between"><span className="font-semibold text-gray-600 dark:text-gray-400">Contact:</span><span>{student.details.contact}</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-dashed border-gray-400 flex justify-between items-center">
                    <p className="text-xs text-gray-500">Valid Until: {new Date().getFullYear() + 4}</p>
                    <img src={student.signature} alt="Signature" className="h-10 w-24 object-contain" />
                </div>
            </div>
             <div className="text-center mt-6 no-print">
                <button onClick={handlePrint} className="btn-primary">Print ID Card</button>
            </div>
        </div>
    );
};

export default IdCard;
