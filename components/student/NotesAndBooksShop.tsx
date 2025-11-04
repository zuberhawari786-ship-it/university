import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { ShopCategory, ShopProduct } from '../../types';

const ProductCard: React.FC<{ product: ShopProduct }> = ({ product }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
        <img src={product.imageUrl} alt={product.name} className="h-48 w-full object-cover"/>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{product.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex-grow">{product.description}</p>
            <div className="mt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Rs {product.price.toLocaleString()}</span>
                <button 
                    onClick={() => alert(`This is a demo. You have "purchased" ${product.name}.`)}
                    className="btn-primary"
                >
                    Buy Now
                </button>
            </div>
        </div>
    </div>
);


const NotesAndBooksShop: React.FC = () => {
    const { user } = useAuth();
    const { students, courses, shopProducts } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('all');

    const student = useMemo(() => students.find(s => s.id === user?.id), [students, user]);

    const academicProducts = useMemo(() => {
        return shopProducts.filter(p => p.category === ShopCategory.BOOK || p.category === ShopCategory.NOTES);
    }, [shopProducts]);

    const filteredProducts = useMemo(() => {
        return academicProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                product.subjectName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCourse = selectedCourseId === 'all' || product.courseId === selectedCourseId;
            return matchesSearch && matchesCourse;
        });
    }, [academicProducts, searchTerm, selectedCourseId]);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Notes & Books Shop</h2>
                <p className="mt-2 text-md text-gray-600 dark:text-gray-400">Find textbooks and lecture notes for your courses.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sticky top-0 z-10">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search for books or subjects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input flex-grow"
                    />
                    <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="form-select"
                    >
                        <option value="all">All Courses</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {filteredProducts.length === 0 && (
                 <div className="text-center col-span-full py-12">
                    <p className="text-gray-500">No products found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default NotesAndBooksShop;