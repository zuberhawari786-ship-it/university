

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import FeeVoucher from '../common/FeeVoucher';

const FeeVoucherModal: React.FC<{
    student: any;
    feeStructure: any;
    onClose: () => void;
}> = ({ student, feeStructure, onClose }) => {
    
    const handlePrint = () => {
        window.print();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print">
            <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg w-full max-w-4xl">
                <FeeVoucher student={student} feeStructure={feeStructure} />
                <div className="flex justify-end gap-4 pt-6">
                    <button type="button" onClick={onClose} className="btn-secondary">Close</button>
                    <button type="button" onClick={handlePrint} className="btn-primary">Print Voucher</button>
                </div>
            </div>
        </div>
    );
};


const StudentFees: React.FC = () => {
    const { user } = useAuth();
    const { students, courses, feeStructures, feePayments, addFeePayment } = useData();
    const [feedback, setFeedback] = useState('');
    const [showVoucher, setShowVoucher] = useState(false);

    const student = students.find(s => s.id === user?.id);

    if (!student || !student.isRegistered || !student.details) {
        return (
             <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Registration Incomplete</h2>
                <p className="text-gray-600 dark:text-gray-400">You must complete your registration before you can view and pay fees.</p>
            </div>
        );
    }

    const { courseId, currentSemester } = student.details;
    const currentFeeStructure = feeStructures.find(fs => fs.courseId === courseId && fs.semester === currentSemester);
    const paymentRecord = feePayments.find(p => p.studentId === student.id && p.feeStructureId === currentFeeStructure?.id);
    const studentPaymentHistory = feePayments.filter(p => p.studentId === student.id);

    const dueAmount = currentFeeStructure ? currentFeeStructure.totalFee - (paymentRecord?.amountPaid || 0) : 0;
    
    const getStatusInfo = () => {
        if (!currentFeeStructure) return { text: "Not Available", color: "bg-gray-200 text-gray-800" };
        if (!paymentRecord) return { text: "Due", color: "bg-red-200 text-red-800" };
        if (paymentRecord.status === 'Paid') return { text: "Paid", color: "bg-green-200 text-green-800" };
        if (paymentRecord.status === 'Partially Paid') return { text: "Partially Paid", color: "bg-yellow-200 text-yellow-800" };
        return { text: "Due", color: "bg-red-200 text-red-800" };
    };

    const statusInfo = getStatusInfo();

    const handlePayNow = () => {
        if (currentFeeStructure && dueAmount > 0) {
            addFeePayment(student.id, currentFeeStructure.id, dueAmount);
            setFeedback('Payment successful! Your record has been updated.');
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    return (
        <>
            {showVoucher && currentFeeStructure && (
                <FeeVoucherModal student={student} feeStructure={currentFeeStructure} onClose={() => setShowVoucher(false)} />
            )}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Fees</h2>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Current Dues (Semester {currentSemester})</h3>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusInfo.color}`}>{statusInfo.text}</span>
                    </div>
                    {currentFeeStructure ? (
                        <div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
                                <div><p className="label">Tuition Fee</p><p>{currentFeeStructure.tuitionFee.toLocaleString()}</p></div>
                                <div><p className="label">Examination Fee</p><p>{currentFeeStructure.examinationFee.toLocaleString()}</p></div>
                                <div><p className="label">Registration Fee</p><p>{currentFeeStructure.registrationFee.toLocaleString()}</p></div>
                                <div><p className="label">Library Fee</p><p>{currentFeeStructure.libraryFee.toLocaleString()}</p></div>
                                <div><p className="label">Extra Activities Fee</p><p>{currentFeeStructure.extraActivitiesFee.toLocaleString()}</p></div>
                                <div className="font-bold"><p className="label">Total Fee</p><p>{currentFeeStructure.totalFee.toLocaleString()}</p></div>
                            </div>
                             <div className="mt-6 pt-4 border-t dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                                 {feedback && <p className="text-green-500 text-sm">{feedback}</p>}
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setShowVoucher(true)} className="btn-secondary">Generate Voucher</button>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">Amount Due: {dueAmount.toLocaleString()}</p>
                                        <button onClick={handlePayNow} className="btn-primary mt-1" disabled={dueAmount <= 0}>
                                            {dueAmount <= 0 ? 'Fees Cleared' : 'Pay Now'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Fee structure for the current semester has not been defined yet.</p>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Payment History</h3>
                    <div className="overflow-x-auto">
                         <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Details</th>
                                    <th className="px-6 py-3 text-right">Amount Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentPaymentHistory.map(p => {
                                    const fs = feeStructures.find(f => f.id === p.feeStructureId);
                                    const course = courses.find(c => c.id === fs?.courseId);
                                    return (
                                        <tr key={p.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td className="px-6 py-4">{new Date(p.paymentDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">{course?.name} - Semester {fs?.semester} Fees</td>
                                            <td className="px-6 py-4 text-right font-medium">{p.amountPaid.toLocaleString()}</td>
                                        </tr>
                                    )
                                })}
                                {studentPaymentHistory.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="text-center py-4">You have not made any payments yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentFees;