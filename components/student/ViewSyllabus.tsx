
import React from 'react';
import { useData } from '../../contexts/DataContext';

const ViewSyllabus: React.FC = () => {
    const { courses } = useData();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Courses & Syllabus</h2>
            <div className="space-y-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{course.name}</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Semester</th>
                                        <th scope="col" className="px-6 py-3">Subject Code</th>
                                        <th scope="col" className="px-6 py-3">Subject Name</th>
                                        <th scope="col" className="px-6 py-3">Credit Hours</th>
                                        <th scope="col" className="px-6 py-3">Materials</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {course.subjects.sort((a,b) => a.semester - b.semester).map(subject => (
                                        <tr key={subject.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td className="px-6 py-4">{subject.semester}</td>
                                            <td className="px-6 py-4">{subject.code}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{subject.name}</td>
                                            <td className="px-6 py-4">{subject.creditHours}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    {subject.syllabus?.pdfUrl && (
                                                        <a href={subject.syllabus.pdfUrl} download={subject.syllabus.pdfName} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline" title={subject.syllabus.pdfName}>PDF</a>
                                                    )}
                                                    {subject.syllabus?.docUrl && (
                                                        <a href={subject.syllabus.docUrl} download={subject.syllabus.docName} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline" title={subject.syllabus.docName}>Doc</a>
                                                    )}
                                                    {subject.syllabus?.imageUrl && (
                                                        <a href={subject.syllabus.imageUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline" title={subject.syllabus.imageName}>Image</a>
                                                    )}
                                                    {!subject.syllabus?.pdfUrl && !subject.syllabus?.docUrl && !subject.syllabus?.imageUrl && <span className="text-xs text-gray-400">N/A</span>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewSyllabus;
