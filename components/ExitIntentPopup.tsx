
import React, { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';

const ExitIntentPopup: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasShown) { // Trigger only when mouse leaves top of screen
                // Check if we already showed it in this session (optional, but good UX)
                const alreadyShown = sessionStorage.getItem('aura_exit_popup_shown');
                if (!alreadyShown) {
                    setIsVisible(true);
                    setHasShown(true);
                    sessionStorage.setItem('aura_exit_popup_shown', 'true');
                }
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [hasShown]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setIsVisible(false)}
            ></div>

            {/* Popup Content */}
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up border border-pink-100 dark:border-pink-900/30">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col md:flex-row">
                    {/* Image Side (Hidden on mobile to save space or keep simple) */}
                    <div className="hidden md:block w-1/3 bg-pink-100 relative">
                        <img
                            src="https://images.unsplash.com/photo-1573408301185-9146fe63533e?auto=format&fit=crop&q=80&w=600"
                            alt="Gift"
                            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                        />
                    </div>

                    {/* Content Side */}
                    <div className="w-full md:w-2/3 p-8 text-center md:text-left">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 text-pink-500 rounded-full mb-4 mx-auto md:mx-0">
                            <Gift size={24} />
                        </div>

                        <h3 className="font-serif font-bold text-2xl text-gray-900 dark:text-white mb-2">Espere! Não vá embora...</h3>
                        <p className="text-gray-500 dark:text-gray-300 mb-6 text-sm">
                            Queremos que a sua primeira experiência Aura seja inesquecível.
                            <br />
                            Aqui tem <span className="font-bold text-pink-500">10% de desconto</span> no seu pedido!
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-800 border border-dashed border-pink-300 rounded-xl p-3 mb-6 flex items-center justify-between group cursor-pointer hover:border-pink-500 transition-colors relative"
                            onClick={() => {
                                navigator.clipboard.writeText('AURA10');
                                // Could add a toast here
                            }}
                        >
                            <span className="font-mono font-bold text-xl text-gray-800 dark:text-white tracking-widest">AURA10</span>
                            <span className="text-xs text-pink-500 font-bold uppercase">Copiar</span>

                            {/* Tooltip on hover */}
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Clique para copiar
                            </div>
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95"
                        >
                            Aproveitar Desconto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExitIntentPopup;
