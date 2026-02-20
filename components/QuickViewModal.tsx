
import React from 'react';
import { X, ShoppingBag, Star, Eye } from 'lucide-react';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';

const QuickViewModal: React.FC = () => {
    const { quickViewProduct, setQuickViewProduct, addToCart } = useApp();
    const navigate = useNavigate();

    if (!quickViewProduct) return null;

    const handleClose = () => setQuickViewProduct(null);

    const handleAddToCart = () => {
        if (quickViewProduct) {
            addToCart(quickViewProduct, 1);
            handleClose();
            // Ideally trigger a toast here, but for now just close
        }
    };

    const handleViewDetails = () => {
        navigate(`/product/${quickViewProduct.id}`);
        handleClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            ></div>

            <div className="relative bg-white dark:bg-gray-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row animate-scale-up">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-gray-700 rounded-full transition-colors text-gray-800 dark:text-white"
                >
                    <X size={20} />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-700 relative">
                    <img
                        src={quickViewProduct.images[0]}
                        alt={quickViewProduct.name}
                        className="w-full h-full object-cover aspect-square md:aspect-auto"
                    />
                    {quickViewProduct.isNew && (
                        <span className="absolute top-6 left-6 bg-pink-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">Novo</span>
                    )}
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 p-8 flex flex-col">
                    <div className="mb-2">
                        <span className="text-gold font-bold uppercase tracking-[0.2em] text-[10px]">{quickViewProduct.category}</span>
                    </div>

                    <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">{quickViewProduct.name}</h2>

                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-yellow-400 gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < Math.floor(quickViewProduct.rating) ? "currentColor" : "none"} />
                            ))}
                        </div>
                        <span className="text-gray-400 text-xs">({quickViewProduct.reviews?.length || 0} avaliações)</span>
                    </div>

                    <p className="text-2xl font-bold text-pink-500 mb-6">{quickViewProduct.price.toFixed(2)}€</p>

                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8 flex-grow">
                        {quickViewProduct.description}
                    </p>

                    <div className="space-y-3 mt-auto">
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-gray-900 dark:bg-pink-600 text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-xl flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={18} /> Adicionar ao Carrinho
                        </button>
                        <button
                            onClick={handleViewDetails}
                            className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Eye size={18} /> Ver Detalhes Completos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;
