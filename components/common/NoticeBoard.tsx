import React from 'react';
import { useData } from '../../contexts/DataContext';

const NoticeBoard: React.FC = () => {
    const { notices } = useData();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notice Board</h2>
            <div className="space-y-4">
                {notices.map(notice => (
                    <div key={notice.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{notice.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            By {notice.author} on {new Date(notice.date).toLocaleDateString()}
                        </p>
                        <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{notice.content}</p>
                        
                        {notice.imageUrl && (
                            <div className="mt-4">
                                <img src={notice.imageUrl} alt="Notice attachment" className="max-w-sm max-h-80 rounded-lg border border-gray-200 dark:border-gray-700"/>
                            </div>
                        )}
                        <div className="mt-4 flex items-center space-x-4 text-sm">
                            {notice.pdfUrl && (
                                <a href={notice.pdfUrl} download={notice.pdfName || 'document.pdf'} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                    Download PDF: {notice.pdfName}
                                </a>
                            )}
                            {notice.docUrl && (
                                <a href={notice.docUrl} download={notice.docName || 'document'} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                    Download Document: {notice.docName}
                                </a>
                            )}
                        </div>
                    </div>
                ))}
                {notices.length === 0 && <p className="text-gray-500 dark:text-gray-400">No notices to display.</p>}
            </div>
        </div>
    );
};

export default NoticeBoard;