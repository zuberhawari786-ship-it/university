import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Result, Exam, Student } from '../../types';
import PrintableResultCard from '../common/PrintableResultCard';

const PublicResultSearch: React.FC = () => {
    const { results, exams, students } = useData();
    const [searchQuery, setSearchQuery] = useState({ regNo: '', examId: '' });
    const [error, setError] = useState('');
    const [foundResult, setFoundResult] = useState<Result | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFoundResult(null);

        const student = students.find(s => s.registrationNumber?.toLowerCase() === searchQuery.regNo.toLowerCase());
        if (!student) {
            setError('No student found with this registration number.');
            return;
        }

        const result = results.find(r => r.studentId === student.id && r.examId === searchQuery.examId && r.isPublished);
        if (result) {
            setFoundResult(result);
        } else {
            setError('No published result found for this student and exam combination. Please check your inputs or try again later.');
        }
    };
    
    const studentForFoundResult = useMemo(() => {
        if (!foundResult) return undefined;
        return students.find(s => s.id === foundResult.studentId) as Student | undefined;
    }, [foundResult, students]);
    
    const examForFoundResult = useMemo(() => {
        if (!foundResult) return undefined;
        return exams.find(e => e.id === foundResult.examId) as Exam | undefined;
    }, [foundResult, exams]);

    if (foundResult) {
        return (
             <div>
                <button onClick={() => { setFoundResult(null); setSearchQuery({ regNo: '', examId: '' }); }} className="btn-secondary mb-4 no-print">&larr; Search Again</button>
                <PrintableResultCard result={foundResult} exam={examForFoundResult} student={studentForFoundResult} />
                <div className="text-center mt-6 no-print">
                    <button onClick={() => window.print()} className="btn-primary">Print Result Card</button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-xl mx-auto">
            <div className="card p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Search Exam Result</h2>
                <form onSubmit={handleSearch} className="space-y-4">
                    <div>
                        <label className="label">Student Registration Number</label>
                        <input
                            type="text"
                            value={searchQuery.regNo}
                            onChange={e => setSearchQuery(prev => ({ ...prev, regNo: e.target.value }))}
                            className="form-input"
                            placeholder="e.g., GEM-2024-001"
                            required
                        />
                    </div>
                    <div>
                        <label className="label">Select Exam</label>
                        <select
                            value={searchQuery.examId}
                            onChange={e => setSearchQuery(prev => ({ ...prev, examId: e.target.value }))}
                            className="form-select"
                            required
                        >
                            <option value="">-- Select an exam --</option>
                            {exams.map(exam => <option key={exam.id} value={exam.id}>{exam.name}</option>)}
                        </select>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    
                    <div className="pt-2 text-right">
                         <button type="submit" className="btn-primary">Search Result</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PublicResultSearch;
