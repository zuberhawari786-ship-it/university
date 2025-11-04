import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { ShopCategory, ShopProduct } from '../../types';

const ProductCard: React.FC<{ product: ShopProduct }> = ({ product }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col group">
        <div className="overflow-hidden">
            <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="h-64 w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            />
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{product.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex-grow">{product.description}</p>
            <div className="mt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Rs {product.price.toLocaleString()}</span>
                <button 
                    onClick={() => alert(`This is a demo. ${product.name} added to cart.`)}
                    className="btn-primary"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    </div>
);

const OnlineShop: React.FC = () => {
    const { shopProducts } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const merchandiseProducts = useMemo(() => {
        return shopProducts
            .filter(p => p.category === ShopCategory.MERCHANDISE)
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [shopProducts, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">University Merchandise Shop</h2>
                <p className="mt-2 text-md text-gray-600 dark:text-gray-400">Show your university pride with our official gear!</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sticky top-0 z-10">
                 <input
                    type="text"
                    placeholder="Search for merchandise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input w-full"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {merchandiseProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
             {merchandiseProducts.length === 0 && (
                 <div className="text-center col-span-full py-12">
                    <p className="text-gray-500">No merchandise found.</p>
                </div>
            )}
        </div>
    );
};

export default OnlineShop;