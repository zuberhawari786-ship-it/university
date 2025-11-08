import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { ResourceCategory, UserRole } from '../../types';

const ResourceCenter: React.FC = () => {
    const { user } = useAuth();
    const { resources, addResource, deleteResource } = useData();
    
    // State for form
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formState, setFormState] = useState({ title: '', description: '', category: ResourceCategory.OTHER, fileUrl: '', fileName: '' });
    const [feedback, setFeedback] = useState('');
    
    // State for filtering and searching
    const [filterCategory, setFilterCategory] = useState<ResourceCategory | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const canUpload = user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER || user?.role === UserRole.RESEARCHER;

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
            setFeedback('Please fill title and upload a file.');
            return;
        }
        addResource({
            authorId: user.id,
            authorName: user.name,
            ...formState,
        });
        setFeedback('Resource uploaded successfully!');
        setFormState({ title: '', description: '', category: ResourceCategory.OTHER, fileUrl: '', fileName: '' });
        (e.target as HTMLFormElement).reset();
        setIsFormVisible(false);
        setTimeout(() => setFeedback(''), 3000);
    };

    const handleDelete = (resourceId: string) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            deleteResource(resourceId);
        }
    };

    const filteredResources = useMemo(() => {
        return resources
            .filter(res => filterCategory === 'all' || res.category === filterCategory)
            .filter(res => 
                res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                res.authorName.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [resources, filterCategory, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h2 className="text-2xl font-bold">Resource Center</h2>
                {canUpload && (
                    <button onClick={() => setIsFormVisible(!isFormVisible)} className="btn-primary">
                        {isFormVisible ? 'Cancel Upload' : 'Upload New Resource'}
                    </button>
                )}
            </div>
            
            {isFormVisible && (
                <div className="card p-6 animate-fade-in">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} className="form-input" placeholder="Resource Title" required/>
                            <select value={formState.category} onChange={e => setFormState({...formState, category: e.target.value as ResourceCategory})} className="form-select" required>
                                {Object.values(ResourceCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <textarea value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} className="form-input" placeholder="Brief description..." rows={3}/>
                        <input type="file" onChange={handleFileChange} className="file-input" required />
                        <div className="text-right">
                            <button type="submit" className="btn-primary">Submit Resource</button>
                        </div>
                    </form>
                </div>
            )}
            
            <div className="card p-4">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input type="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-input flex-grow" placeholder="Search by title or author..."/>
                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as ResourceCategory | 'all')} className="form-select">
                        <option value="all">All Categories</option>
                        {Object.values(ResourceCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                
                <div className="space-y-4">
                    {filteredResources.length > 0 ? filteredResources.map(res => (
                        <div key={res.id} className="p-4 border border-[var(--border-color)] rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-cyan-800 text-cyan-200`}>{res.category}</span>
                                <h4 className="font-bold text-lg mt-1">{res.title}</h4>
                                <p className="text-sm text-gray-400">By {res.authorName} on {new Date(res.uploadDate).toLocaleDateString()}</p>
                                <p className="text-sm mt-1">{res.description}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <a href={res.fileUrl} download={res.fileName} className="btn-secondary">Download</a>
                                {(user?.role === UserRole.ADMIN || user?.id === res.authorId) && (
                                    <button onClick={() => handleDelete(res.id)} className="btn-danger">Delete</button>
                                )}
                            </div>
                        </div>
                    )) : <p className="text-center text-gray-400 py-8">No resources found matching your criteria.</p>}
                </div>
            </div>
        </div>
    );
};

export default ResourceCenter;