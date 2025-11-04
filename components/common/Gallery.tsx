import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

const Gallery: React.FC = () => {
    const { galleryImages, addGalleryImage, deleteGalleryImage } = useData();
    const { user } = useAuth();
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState('');
    const [feedback, setFeedback] = useState('');

    const canManage = user?.role === UserRole.ADMIN || user?.role === UserRole.RECEPTIONIST;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!image || !caption) {
            setFeedback('Please provide both an image and a caption.');
            return;
        }
        addGalleryImage(image, caption);
        setFeedback('Image uploaded successfully!');
        setCaption('');
        setImage('');
        // This is a common way to reset a file input
        (e.target as HTMLFormElement).reset(); 
        setTimeout(() => setFeedback(''), 3000);
    };
    
    const handleDelete = (imageId: string) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            deleteGalleryImage(imageId);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">University Gallery</h2>

            {canManage && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <h3 className="text-xl font-bold mb-4">Upload New Image</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Image Caption</label>
                                <input 
                                    type="text" 
                                    value={caption} 
                                    onChange={(e) => setCaption(e.target.value)} 
                                    className="form-input" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="label">Image File</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    className="file-input" 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="flex justify-end items-center pt-2">
                            {feedback && <p className="text-green-600 dark:text-green-400 text-sm mr-4">{feedback}</p>}
                            <button type="submit" className="btn-primary">Upload Image</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galleryImages.map(img => (
                    <div key={img.id} className="group relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800">
                        <img src={img.imageUrl} alt={img.caption} className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white font-semibold text-sm truncate">{img.caption}</p>
                        </div>
                        {canManage && (
                             <button 
                                onClick={() => handleDelete(img.id)}
                                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700"
                                aria-label="Delete image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {galleryImages.length === 0 && (
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <p className="text-gray-500">The gallery is empty. Admins can upload the first image!</p>
                </div>
            )}
        </div>
    );
};

export default Gallery;