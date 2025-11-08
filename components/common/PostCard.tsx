import React, { useState } from 'react';
import { CampusPost, Comment as CommentType, UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

// A utility to format time since a post was made
const timeSince = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "just now";
};


const PostCard: React.FC<{ post: CampusPost }> = ({ post }) => {
    const { user } = useAuth();
    const { students, toggleLikePost, addCommentToPost, deleteCampusPost } = useData();
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    const authorImage = students.find(s => s.id === post.authorId)?.photo || 'https://i.pravatar.cc/150?u=default';
    const isLiked = user ? post.likes.includes(user.id) : false;

    const handleLike = () => {
        if (user) toggleLikePost(post.id, user.id);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user && newComment.trim()) {
            addCommentToPost(post.id, {
                authorId: user.id,
                authorName: user.name,
                content: newComment.trim(),
            });
            setNewComment('');
        }
    };
    
    const handleDelete = () => {
        if(window.confirm("Are you sure you want to delete this post? This action cannot be undone.")){
            deleteCampusPost(post.id);
        }
    }

    return (
        <div className="card p-5 animate-fade-in">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <img src={authorImage} alt={post.authorName} className="h-12 w-12 rounded-full object-cover" />
                    <div>
                        <p className="font-bold">{post.authorName}</p>
                        <p className="text-xs text-gray-400">{post.authorRole} · {timeSince(post.timestamp)}</p>
                    </div>
                </div>
                {user?.role === UserRole.ADMIN && (
                    <button onClick={handleDelete} className="text-gray-400 hover:text-red-500">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                    </button>
                )}
            </div>
            
            <p className="my-4 whitespace-pre-wrap">{post.textContent}</p>

            {post.mediaUrl && (
                <div className="mb-4 rounded-lg overflow-hidden max-h-[500px]">
                    {post.mediaType === 'image' && <img src={post.mediaUrl} alt="Post content" className="w-full h-full object-contain" />}
                    {post.mediaType === 'video' && <video src={post.mediaUrl} controls className="w-full" />}
                    {post.mediaType === 'document' && (
                        <a href={post.mediaUrl} download={post.mediaName} className="block p-4 bg-gray-700 hover:bg-gray-600 rounded-lg">
                            <p>📄 <span className="underline">{post.mediaName || 'Download Document'}</span></p>
                        </a>
                    )}
                </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-400 border-t border-b border-[var(--border-color)] py-2">
                <button onClick={handleLike} className={`flex items-center gap-1.5 hover:text-white transition-colors ${isLiked ? 'text-cyan-400' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.562 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.865.8L6 10.333z" /></svg>
                    {post.likes.length} Likes
                </button>
                 <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 hover:text-white transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>
                    {post.comments.length} Comments
                </button>
            </div>

            {showComments && (
                <div className="mt-4 space-y-3">
                    {post.comments.map(comment => (
                        <div key={comment.id} className="text-sm">
                            <span className="font-semibold text-cyan-400">{comment.authorName}: </span>
                            <span>{comment.content}</span>
                        </div>
                    ))}
                    <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-2">
                        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} className="form-input text-sm flex-grow" placeholder="Write a comment..." />
                        <button type="submit" className="btn-primary btn-sm">Post</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PostCard;
