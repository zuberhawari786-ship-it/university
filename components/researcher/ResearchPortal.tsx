import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { ResourceCategory, UserRole, Resource } from '../../types';

const ResearchPortal: React.FC = () => {
    const { user } = useAuth();
    const { resources, addResource, deleteResource } = useData();
    
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formState, setFormState] = useState({ title: '', description: '', fileUrl: '', fileName: '' });
    const [feedback, setFeedback] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const researchPapers = useMemo(() => {
        return resources
            .filter(res => res.category === ResourceCategory.RESEARCH_PAPER)
            .filter(res => 
                res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                res.authorName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    }, [resources, searchTerm]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                setFormState(prev => ({ ...prev, fileUrl: url, fileName: file.name }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !formState.title || !formState.fileUrl) {
            setFeedback('Please provide a title and upload your paper.');
            return;
        }
        addResource({
            authorId: user.id,
            authorName: user.name,
            title: formState.title,
            description: formState.description,
            category: ResourceCategory.RESEARCH_PAPER,
            fileUrl: formState.fileUrl,
            fileName: formState.fileName,
        });
        setFeedback('Research paper uploaded successfully!');
        setFormState({ title: '', description: '', fileUrl: '', fileName: '' });
        (e.target as HTMLFormElement).reset();
        setIsFormVisible(false);
        setTimeout(() => setFeedback(''), 3000);
    };
    
    const handleDelete = (resourceId: string) => {
        if (window.confirm('Are you sure you want to delete this paper?')) {
            deleteResource(resourceId);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-2xl font-bold">Research Portal</h2>
                <button onClick={() => setIsFormVisible(!isFormVisible)} className="btn-primary">
                    {isFormVisible ? 'Cancel Upload' : 'Upload New Paper'}
                </button>
            </div>
            
            {isFormVisible && (
                <div className="card p-6 animate-fade-in">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} className="form-input" placeholder="Paper Title" required/>
                        <textarea value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} className="form-input" placeholder="Abstract or brief description..." rows={4}/>
                        <input type="file" onChange={handleFileChange} className="file-input" required accept=".pdf,.doc,.docx"/>
                        <div className="text-right">
                            <button type="submit" className="btn-primary">Submit Paper</button>
                        </div>
                    </form>
                </div>
            )}
            
            <div className="card p-4">
                <div className="mb-4">
                    <input type="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-input w-full" placeholder="Search papers by title or author..."/>
                </div>
                
                <div className="space-y-4">
                    {researchPapers.length > 0 ? researchPapers.map(paper => (
                        <div key={paper.id} className="p-4 border border-[var(--border-color)] rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <h4 className="font-bold text-lg">{paper.title}</h4>
                                <p className="text-sm text-gray-400">By {paper.authorName} on {new Date(paper.uploadDate).toLocaleDateString()}</p>
                                <p className="text-sm mt-1">{paper.description}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <a href={paper.fileUrl} download={paper.fileName} className="btn-secondary">Download</a>
                                {(user?.role === UserRole.ADMIN || user?.id === paper.authorId) && (
                                    <button onClick={() => handleDelete(paper.id)} className="btn-danger">Delete</button>
                                )}
                            </div>
                        </div>
                    )) : <p className="text-center text-gray-400 py-8">No research papers found.</p>}
                </div>
            </div>
        </div>
    );
};

export default ResearchPortal;