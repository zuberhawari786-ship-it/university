import React from 'react';
import { Student, FeeStructure } from '../../types';
import { useData } from '../../contexts/DataContext';

interface FeeVoucherProps {
    student: Student;
    feeStructure: FeeStructure;
}

const VoucherSection: React.FC<{ title: string; student: Student; feeStructure: FeeStructure; universityInfo: any; courseName: string }> = ({ title, student, feeStructure, universityInfo, courseName }) => {
    const paymentRecord = useData().feePayments.find(p => p.studentId === student.id && p.feeStructureId === feeStructure.id);
    const amountDue = feeStructure.totalFee - (paymentRecord?.amountPaid || 0);
    const voucherId = `FEE-${feeStructure.semester}${student.id.slice(-4)}-${Date.now().toString().slice(-5)}`;

    return (
        <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between items-center pb-2 border-b-2 border-dashed dark:border-gray-600">
                <div className="text-center">
                    <img src={universityInfo.logo} alt="Logo" className="h-8 mx-auto" />
                    <p className="text-xs font-bold">{universityInfo.name}</p>
                </div>
                <div className="text-center">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="text-xs">Voucher ID: {voucherId}</p>
                    <p className="text-xs">Date: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2">
                <div><strong>Student:</strong> {student.name}</div>
                <div><strong>Roll No:</strong> {student.rollNumber}</div>
                <div><strong>Course:</strong> {courseName}</div>
                <div><strong>Semester:</strong> {feeStructure.semester}</div>
            </div>

            <table className="w-full text-xs my-2">
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th className="p-1 text-left">Fee Particulars</th>
                        <th className="p-1 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b dark:border-gray-600"><td className="p-1">Tuition Fee</td><td className="p-1 text-right">{feeStructure.tuitionFee.toLocaleString()}</td></tr>
                    <tr className="border-b dark:border-gray-600"><td className="p-1">Examination Fee</td><td className="p-1 text-right">{feeStructure.examinationFee.toLocaleString()}</td></tr>
                    <tr className="border-b dark:border-gray-600"><td className="p-1">Registration Fee</td><td className="p-1 text-right">{feeStructure.registrationFee.toLocaleString()}</td></tr>
                    <tr className="border-b dark:border-gray-600"><td className="p-1">Library Fee</td><td className="p-1 text-right">{feeStructure.libraryFee.toLocaleString()}</td></tr>
                    <tr className="border-b dark:border-gray-600"><td className="p-1">Extra Activities Fee</td><td className="p-1 text-right">{feeStructure.extraActivitiesFee.toLocaleString()}</td></tr>
                </tbody>
                <tfoot className="font-bold bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <td className="p-1">Total Amount Due</td>
                        <td className="p-1 text-right">{amountDue.toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>

            <div className="text-xs mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="font-bold">Bank Deposit Details:</p>
                <p><strong>Bank:</strong> {universityInfo.bankName}</p>
                <p><strong>A/C No:</strong> {universityInfo.accountNumber}</p>
                <p><strong>Branch:</strong> {universityInfo.branchName}</p>
            </div>

            <div className="flex justify-between items-end text-xs mt-6">
                <div>
                    <p>.........................</p>
                    <p>Depositor's Signature</p>
                </div>
                <div>
                    <p>.........................</p>
                    <p>Bank Seal & Signature</p>
                </div>
            </div>
        </div>
    );
};

const FeeVoucher: React.FC<FeeVoucherProps> = ({ student, feeStructure }) => {
    const { universityInfo, courses } = useData();
    const course = courses.find(c => c.id === feeStructure.courseId);

    if (!student || !feeStructure || !course) {
        return <p>Error generating voucher: Missing data.</p>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 printable space-y-4">
            <VoucherSection title="Bank Copy" student={student} feeStructure={feeStructure} universityInfo={universityInfo} courseName={course.name} />
            <div className="border-t-2 border-dashed border-gray-400 my-4"></div>
            <VoucherSection title="Student Copy" student={student} feeStructure={feeStructure} universityInfo={universityInfo} courseName={course.name} />
        </div>
    );
};

export default FeeVoucher;