

import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Student } from '../../types';
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


const FeeCollection: React.FC = () => {
    const { students, getStudentByRegNo, feeStructures, feePayments, addFeePayment } = useData();
    const [regNoSearch, setRegNoSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchError, setSearchError] = useState('');
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [showVoucher, setShowVoucher] = useState(false);

    const handleSearchStudent = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchError('');
        setFeedback('');
        const foundStudent = getStudentByRegNo(regNoSearch);
        if (foundStudent) {
            setSelectedStudent(foundStudent);
        } else {
            setSearchError('Student with that Registration Number not found.');
            setSelectedStudent(null);
        }
    };

    const currentFeeStructure = useMemo(() => {
        if (!selectedStudent || !selectedStudent.details) return null;
        return feeStructures.find(fs => fs.courseId === selectedStudent.details?.courseId && fs.semester === selectedStudent.details?.currentSemester);
    }, [selectedStudent, feeStructures]);

    const paymentRecord = useMemo(() => {
        if (!selectedStudent || !currentFeeStructure) return null;
        return feePayments.find(p => p.studentId === selectedStudent.id && p.feeStructureId === currentFeeStructure.id);
    }, [selectedStudent, currentFeeStructure, feePayments]);

    const dueAmount = currentFeeStructure ? currentFeeStructure.totalFee - (paymentRecord?.amountPaid || 0) : 0;

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback('');
        if (!selectedStudent || !currentFeeStructure || paymentAmount <= 0) {
            setFeedback('Invalid payment amount or student details.');
            return;
        }
        if (paymentAmount > dueAmount) {
            setFeedback(`Payment amount cannot be more than the due amount of ${dueAmount.toLocaleString()}.`);
            return;
        }

        addFeePayment(selectedStudent.id, currentFeeStructure.id, paymentAmount);
        setFeedback(`Payment of ${paymentAmount.toLocaleString()} recorded for ${selectedStudent.name}.`);
        setPaymentAmount(0);
        setTimeout(() => setFeedback(''), 4000);
    };
    
    const resetSearch = () => {
        setSelectedStudent(null);
        setRegNoSearch('');
        setSearchError('');
        setFeedback('');
    }

    if (!selectedStudent) {
        return (
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Collect Student Fees</h2>
                <form onSubmit={handleSearchStudent} className="space-y-4">
                    <div>
                        <label htmlFor="regNo" className="label">Student Registration No.</label>
                        <input
                            type="text"
                            id="regNo"
                            value={regNoSearch}
                            onChange={(e) => setRegNoSearch(e.target.value)}
                            className="form-input mt-1"
                            placeholder="e.g., GEM-2024-001"
                            required
                        />
                    </div>
                    {searchError && <p className="text-red-500 text-sm">{searchError}</p>}
                    <div className="text-right">
                        <button type="submit" className="btn-primary">Find Student</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
         <>
            {showVoucher && currentFeeStructure && (
                <FeeVoucherModal student={selectedStudent} feeStructure={currentFeeStructure} onClose={() => setShowVoucher(false)} />
            )}
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Collection</h2>
                    <button onClick={resetSearch} className="btn-secondary btn-sm">&larr; Change Student</button>
                </div>
                 <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2 dark:border-gray-700">Student Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong className="block text-gray-500">Name</strong> {selectedStudent.name}</div>
                        <div><strong className="block text-gray-500">Reg. No</strong> {selectedStudent.registrationNumber}</div>
                        <div><strong className="block text-gray-500">Course</strong> {selectedStudent.details?.courseId.toUpperCase()}</div>
                        <div><strong className="block text-gray-500">Semester</strong> {selectedStudent.details?.currentSemester}</div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                     <h3 className="text-lg font-semibold mb-4 border-b pb-2 dark:border-gray-700">Payment Details</h3>
                     {currentFeeStructure ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-lg">
                                <span>Total Fee for Semester:</span>
                                <span className="font-bold">{currentFeeStructure.totalFee.toLocaleString()}</span>
                            </div>
                             <div className="flex justify-between items-center text-lg">
                                <span>Amount Paid:</span>
                                <span className="font-bold text-green-600">{paymentRecord?.amountPaid.toLocaleString() || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-xl font-bold mt-2 pt-2 border-t dark:border-gray-700">
                                <span>Amount Due:</span>
                                <span className="text-red-600">{dueAmount.toLocaleString()}</span>
                            </div>

                            <div className="mt-4 pt-4 border-t dark:border-gray-600 flex justify-end">
                                <button onClick={() => setShowVoucher(true)} className="btn-secondary">Print Voucher</button>
                            </div>

                            {dueAmount > 0 && (
                                <form onSubmit={handlePaymentSubmit} className="mt-2 pt-6 border-t dark:border-gray-600 space-y-4">
                                    <div>
                                        <label className="label">Enter Amount to Pay</label>
                                        <input 
                                            type="number" 
                                            value={paymentAmount}
                                            onChange={e => setPaymentAmount(parseFloat(e.target.value) || 0)}
                                            className="form-input"
                                            max={dueAmount}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end items-center">
                                        {feedback && <p className="text-green-600 dark:text-green-400 text-sm mr-4">{feedback}</p>}
                                        <button type="submit" className="btn-primary">Record Payment</button>
                                    </div>
                                </form>
                            )}
                             {dueAmount <= 0 && <p className="text-center font-semibold text-green-600 dark:text-green-400 mt-6">All fees for this semester are cleared.</p>}
                        </div>
                     ) : (
                        <p className="text-center text-gray-500">Fee structure not available for this student's current semester.</p>
                     )}
                </div>
            </div>
        </>
    );
};

export default FeeCollection;