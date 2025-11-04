import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { ShopProduct, ShopCategory, Course, Subject } from '../../types';

// Helper function to read file as base64
const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Form Modal Component
const ProductFormModal: React.FC<{
    product: ShopProduct | null;
    onClose: () => void;
    onSave: (productData: Omit<ShopProduct, 'id'> | ShopProduct) => void;
}> = ({ product, onClose, onSave }) => {
    const { courses } = useData();
    const isEditing = !!product;
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || 0,
        imageUrl: product?.imageUrl || '',
        category: product?.category || ShopCategory.MERCHANDISE,
        courseId: product?.courseId || '',
        subjectName: product?.subjectName || '',
    });

    const subjectsForSelectedCourse = useMemo(() => {
        if (formData.category === ShopCategory.MERCHANDISE || !formData.courseId) return [];
        const course = courses.find(c => c.id === formData.courseId);
        return course?.subjects || [];
    }, [courses, formData.category, formData.courseId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
    };
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const base64Image = await readFileAsDataURL(e.target.files[0]);
                setFormData(prev => ({ ...prev, imageUrl: base64Image }));
            } catch (error) {
                console.error("Error reading image file:", error);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && product) {
            onSave({ ...product, ...formData });
        } else {
            onSave(formData);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                    {/* Form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="label">Product Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" required /></div>
                        <div><label className="label">Price</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} className="form-input" required min="0" step="0.01" /></div>
                    </div>
                    <div><label className="label">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} className="form-input" rows={3} required /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                             <label className="label">Category</label>
                             <select name="category" value={formData.category} onChange={handleInputChange} className="form-select">
                                {Object.values(ShopCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                             </select>
                        </div>
                        <div>
                            <label className="label">Product Image</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
                            {formData.imageUrl && <img src={formData.imageUrl} alt="preview" className="mt-2 h-20 w-20 object-cover rounded"/>}
                        </div>
                    </div>
                    {(formData.category === ShopCategory.BOOK || formData.category === ShopCategory.NOTES) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border dark:border-gray-700 rounded-md">
                             <div>
                                <label className="label">Course</label>
                                <select name="courseId" value={formData.courseId} onChange={handleInputChange} className="form-select">
                                    <option value="">-- Select Course --</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Subject</label>
                                <select name="subjectName" value={formData.subjectName} onChange={handleInputChange} className="form-select" disabled={!formData.courseId}>
                                    <option value="">-- Select Subject --</option>
                                    {subjectsForSelectedCourse.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main Component
const ManageProducts: React.FC = () => {
    const { shopProducts, addShopProduct, updateShopProduct, deleteShopProduct } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ShopProduct | null>(null);

    const handleOpenModal = (product: ShopProduct | null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = (productData: Omit<ShopProduct, 'id'> | ShopProduct) => {
        if ('id' in productData) {
            updateShopProduct(productData);
        } else {
            addShopProduct(productData);
        }
        handleCloseModal();
    };
    
    const handleDeleteProduct = (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteShopProduct(productId);
        }
    };

    return (
        <div className="space-y-6">
            {isModalOpen && <ProductFormModal product={editingProduct} onClose={handleCloseModal} onSave={handleSaveProduct} />}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Shop Products</h2>
                <button onClick={() => handleOpenModal(null)} className="btn-primary">Add New Product</button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Image</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shopProducts.map(product => (
                            <tr key={product.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                <td className="px-6 py-4"><img src={product.imageUrl} alt={product.name} className="h-12 w-12 object-cover rounded"/></td>
                                <td className="px-6 py-4 font-medium">{product.name}</td>
                                <td className="px-6 py-4">{product.category}</td>
                                <td className="px-6 py-4">Rs {product.price.toLocaleString()}</td>
                                <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                                    <button onClick={() => handleOpenModal(product)} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {shopProducts.length === 0 && <p className="text-center py-4">No products in the shop yet.</p>}
            </div>
        </div>
    );
};

export default ManageProducts;