

import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';

const FeeManagement: React.FC = () => {
    const { courses, feeStructures, addFeeStructure, feePayments, students, deleteFeeStructure } = useData();
    const [formState, setFormState] = useState({
        courseId: courses[0]?.id || '',
        semester: 1,
        tuitionFee: 0,
        examinationFee: 0,
        registrationFee: 0,
        libraryFee: 0,
        extraActivitiesFee: 0,
    });
    const [feedback, setFeedback] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumberInput = ['semester', 'tuitionFee', 'examinationFee', 'registrationFee', 'libraryFee', 'extraActivitiesFee'].includes(name);
        setFormState(prev => ({ ...prev, [name]: isNumberInput ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.courseId || formState.semester <= 0) {
            setFeedback('Please fill all fields correctly.');
            setTimeout(() => setFeedback(''), 3000);
            return;
        }
        addFeeStructure({
            ...formState
        });
        setFeedback('Fee structure added successfully!');
        setFormState({ courseId: courses[0]?.id || '', semester: 1, tuitionFee: 0, examinationFee: 0, registrationFee: 0, libraryFee: 0, extraActivitiesFee: 0 });
        setTimeout(() => setFeedback(''), 3000);
    };

    const handleDeleteFeeStructure = (fsId: string) => {
        if (window.confirm('Are you sure you want to delete this fee structure? This will not affect existing payment records.')) {
            deleteFeeStructure(fsId);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Partially Paid': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Due': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="space-y-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add Fee Structure</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Course</label>
                            <select name="courseId" value={formState.courseId} onChange={handleInputChange} className="form-select" required>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">Semester</label>
                            <input type="number" name="semester" min="1" value={formState.semester} onChange={handleInputChange} className="form-input" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t dark:border-gray-700">
                         <div>
                            <label className="label">Tuition Fee</label>
                            <input type="number" name="tuitionFee" min="0" value={formState.tuitionFee} onChange={handleInputChange} className="form-input" required />
                        </div>
                         <div>
                            <label className="label">Examination Fee</label>
                            <input type="number" name="examinationFee" min="0" value={formState.examinationFee} onChange={handleInputChange} className="form-input" required />
                        </div>
                         <div>
                            <label className="label">Registration Fee</label>
                            <input type="number" name="registrationFee" min="0" value={formState.registrationFee} onChange={handleInputChange} className="form-input" required />
                        </div>
                        <div>
                            <label className="label">Library Fee</label>
                            <input type="number" name="libraryFee" min="0" value={formState.libraryFee} onChange={handleInputChange} className="form-input" required />
                        </div>
                        <div>
                            <label className="label">Extra Activities Fee</label>
                            <input type="number" name="extraActivitiesFee" min="0" value={formState.extraActivitiesFee} onChange={handleInputChange} className="form-input" required />
                        </div>
                    </div>
                     <div className="flex justify-end items-center pt-2">
                        {feedback && <p className="text-green-600 dark:text-green-400 text-sm mr-4">{feedback}</p>}
                        <button type="submit" className="btn-primary">Add Structure</button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Existing Fee Structures</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Course</th>
                                <th className="px-6 py-3">Semester</th>
                                <th className="px-6 py-3">Total Fee</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feeStructures.map(fs => {
                                const course = courses.find(c => c.id === fs.courseId);
                                return (
                                    <tr key={fs.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-6 py-4">{course?.name}</td>
                                        <td className="px-6 py-4">{fs.semester}</td>
                                        <td className="px-6 py-4">{fs.totalFee.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleDeleteFeeStructure(fs.id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Student Fee Payments</h2>
                <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Student</th>
                                <th className="px-6 py-3">Course & Semester</th>
                                <th className="px-6 py-3">Amount Paid</th>
                                <th className="px-6 py-3">Total Fee</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feePayments.map(fp => {
                                const student = students.find(s => s.id === fp.studentId);
                                const feeStructure = feeStructures.find(fs => fs.id === fp.feeStructureId);
                                const course = courses.find(c => c.id === feeStructure?.courseId);
                                return (
                                    <tr key={fp.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-6 py-4">{student?.name}</td>
                                        <td className="px-6 py-4">{course?.name} (Sem {feeStructure?.semester})</td>
                                        <td className="px-6 py-4">{fp.amountPaid.toLocaleString()}</td>
                                        <td className="px-6 py-4">{feeStructure?.totalFee.toLocaleString()}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fp.status)}`}>{fp.status}</span></td>
                                        <td className="px-6 py-4">{new Date(fp.paymentDate).toLocaleDateString()}</td>
                                    </tr>
                                )
                            })}
                             {feePayments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">No payments have been recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FeeManagement;