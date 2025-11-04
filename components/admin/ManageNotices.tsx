

import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

const ManageNotices: React.FC = () => {
    const { notices, addNotice, deleteNotice } = useData();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [pdf, setPdf] = useState({ data: '', name: '' });
    const [doc, setDoc] = useState({ data: '', name: '' });
    const [feedback, setFeedback] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'pdf' | 'doc') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                switch (fileType) {
                    case 'image': setImage(dataUrl); break;
                    case 'pdf': setPdf({ data: dataUrl, name: file.name }); break;
                    case 'doc': setDoc({ data: dataUrl, name: file.name }); break;
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content || !user) {
            setFeedback('Please fill title and content.');
            setTimeout(() => setFeedback(''), 3000);
            return;
        }
        addNotice({
            title,
            content,
            date: new Date().toISOString(),
            author: user.name,
            imageUrl: image || undefined,
            pdfUrl: pdf.data || undefined,
            pdfName: pdf.name || undefined,
            docUrl: doc.data || undefined,
            docName: doc.name || undefined,
        });
        setFeedback('Notice published successfully!');
        setTitle('');
        setContent('');
        setImage('');
        setPdf({ data: '', name: '' });
        setDoc({ data: '', name: '' });
        // Reset file inputs
        const form = e.target as HTMLFormElement;
        form.reset();
        setTimeout(() => setFeedback(''), 3000);
    };

    const handleDeleteNotice = (noticeId: string, noticeTitle: string) => {
        if (window.confirm(`Are you sure you want to delete the notice "${noticeTitle}"?`)) {
            deleteNotice(noticeId);
        }
    };

    return (
        <div className="space-y-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Notice</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" required/>
                    </div>
                    <div>
                        <label className="label">Content</label>
                        <textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} className="form-input" required />
                    </div>
                    <div className="space-y-2">
                         <label className="label">Attach Image</label>
                         <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'image')} className="file-input" />
                    </div>
                     <div className="space-y-2">
                         <label className="label">Attach PDF</label>
                         <input type="file" accept=".pdf" onChange={e => handleFileChange(e, 'pdf')} className="file-input" />
                    </div>
                     <div className="space-y-2">
                         <label className="label">Attach Other Document</label>
                         <input type="file" onChange={e => handleFileChange(e, 'doc')} className="file-input" />
                    </div>
                    <div className="flex justify-end items-center pt-2">
                        {feedback && <p className="text-green-600 dark:text-green-400 text-sm mr-4">{feedback}</p>}
                        <button type="submit" className="btn-primary">Publish Notice</button>
                    </div>
                </form>
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 border-t pt-6 dark:border-gray-700">Published Notices</h2>
                {notices.map(notice => (
                    <div key={notice.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{notice.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    By {notice.author} on {new Date(notice.date).toLocaleDateString()}
                                </p>
                            </div>
                            <button onClick={() => handleDeleteNotice(notice.id, notice.title)} className="btn-secondary btn-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900">
                                Delete
                            </button>
                        </div>
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

export default ManageNotices;