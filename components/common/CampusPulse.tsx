import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { CampusPost, UserRole } from '../../types';
import PostCard from './PostCard';

const CreatePost: React.FC = () => {
    const { user } = useAuth();
    const { addCampusPost } = useData();
    const [textContent, setTextContent] = useState('');
    const [media, setMedia] = useState<{ type: 'image' | 'video' | 'document', url: string, name: string } | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                let type: 'image' | 'video' | 'document' = 'document';
                if (file.type.startsWith('image/')) type = 'image';
                if (file.type.startsWith('video/')) type = 'video';
                setMedia({ type, url, name: file.name });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || (!textContent.trim() && !media)) return;

        addCampusPost({
            authorId: user.id,
            authorName: user.name,
            authorRole: user.role,
            textContent,
            mediaType: media?.type,
            mediaUrl: media?.url,
            mediaName: media?.name,
        });

        setTextContent('');
        setMedia(null);
        setIsExpanded(false);
    };

    return (
        <div className="card p-4 mb-6">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="form-input w-full text-base resize-none"
                    rows={isExpanded ? 4 : 2}
                    placeholder={`What's on your mind, ${user?.name}?`}
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    onFocus={() => setIsExpanded(true)}
                />
                {isExpanded && (
                    <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                             <label htmlFor="file-upload" className="btn-secondary btn-sm cursor-pointer">
                                Attach File
                             </label>
                             <input id="file-upload" type="file" onChange={handleFileChange} className="hidden" />
                             {media && <span className="text-xs text-gray-400">{media.name}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                             <button type="button" onClick={() => { setIsExpanded(false); setTextContent(''); setMedia(null);}} className="btn-secondary btn-sm">Cancel</button>
                             <button type="submit" className="btn-primary btn-sm" disabled={!textContent.trim() && !media}>Post</button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

const CampusPulse: React.FC = () => {
    const { campusPosts } = useData();

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Campus Pulse</h1>
            <CreatePost />
            <div className="space-y-6">
                {campusPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default CampusPulse;
