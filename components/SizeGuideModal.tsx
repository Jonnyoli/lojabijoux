import React, { useState } from 'react';
import { X, Ruler, Info, ArrowRight } from 'lucide-react';

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'rings' | 'necklaces';
}

const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, initialTab = 'rings' }) => {
    const [activeTab, setActiveTab] = useState<'rings' | 'necklaces'>(initialTab);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
            <div
                className="absolute inset-0"
                onClick={onClose}
            ></div>

            <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100 dark:border-white/10 animate-scale-up">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 py-6 border-b border-pink-50 dark:border-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Guia de Tamanhos</h2>
                        <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Encontre o ajuste perfeito</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-pink-500 transition-all rounded-2xl"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8">
                    {/* Tabs */}
                    <div className="flex gap-4 mb-8 bg-slate-50 dark:bg-black/20 p-1.5 rounded-2xl">
                        <button
                            onClick={() => setActiveTab('rings')}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'rings' ? 'bg-white dark:bg-slate-800 text-gold shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Anéis
                        </button>
                        <button
                            onClick={() => setActiveTab('necklaces')}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'necklaces' ? 'bg-white dark:bg-slate-800 text-gold shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Colares
                        </button>
                    </div>

                    {activeTab === 'rings' ? (
                        <div className="space-y-8 animate-fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                                <div className="space-y-4">
                                    <h3 className="font-serif font-bold text-xl text-slate-800 dark:text-white">Como medir o seu dedo</h3>
                                    <div className="space-y-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                            <p>Enrole um fio ou fita métrica à volta da parte mais larga do dedo escolhido.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                            <p>Marque o ponto onde o fio se sobrepõe.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                            <p>Meça a distância em mm e use a tabela abaixo.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-black/20 rounded-3xl p-6 border border-dashed border-slate-200 dark:border-white/5 flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-full border-4 border-gold/20 flex items-center justify-center relative mb-4">
                                        <div className="absolute inset-0 animate-ping rounded-full bg-gold/5"></div>
                                        <Ruler className="text-gold" size={32} />
                                    </div>
                                    <p className="text-[10px] text-center text-slate-400 italic">Dica: Meça ao final do dia, quando os dedos estão mais quentes.</p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-pink-50 dark:border-white/5 overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-black/40 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                            <th className="px-6 py-4">Tamanho Aura</th>
                                            <th className="px-6 py-4">Diâmetro (mm)</th>
                                            <th className="px-6 py-4">Circunferência (mm)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-pink-50 dark:divide-white/5 font-mono">
                                        {[
                                            { size: '10', dia: '15.9', circ: '50' },
                                            { size: '12', dia: '16.5', circ: '52' },
                                            { size: '14', dia: '17.2', circ: '54' },
                                            { size: '16', dia: '17.8', circ: '56' },
                                            { size: '18', dia: '18.5', circ: '58' },
                                        ].map((row) => (
                                            <tr key={row.size} className="text-slate-600 dark:text-slate-300">
                                                <td className="px-6 py-3 font-bold text-gold">{row.size}</td>
                                                <td className="px-6 py-3">{row.dia}</td>
                                                <td className="px-6 py-3">{row.circ}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                                <div className="space-y-4">
                                    <h3 className="font-serif font-bold text-xl text-slate-800 dark:text-white">Dicas de Comprimento</h3>
                                    <div className="space-y-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        <p>O comprimento do colar define como ele emoldura o seu rosto e decote:</p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <ArrowRight size={14} className="text-gold" />
                                                <p><span className="font-bold text-slate-700 dark:text-slate-200">35-40cm:</span> Estilo Choker, fica na base do pescoço.</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <ArrowRight size={14} className="text-gold" />
                                                <p><span className="font-bold text-slate-700 dark:text-slate-200">45cm:</span> Comprimento padrão, cai na altura das clavículas.</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <ArrowRight size={14} className="text-gold" />
                                                <p><span className="font-bold text-slate-700 dark:text-slate-200">50-60cm:</span> Ideal para pendentes grandes ou camadas.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-black/20 rounded-3xl p-6 border border-dashed border-slate-200 dark:border-white/5 aspect-square flex flex-col items-center justify-center relative overflow-hidden">
                                    {/* Visualization of lengths */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-start pt-10 opacity-10">
                                        {[40, 45, 50, 60].map(len => (
                                            <div key={len} className="w-32 rounded-full border border-slate-900 dark:border-white mb-2" style={{ height: `${len / 2}px` }}></div>
                                        ))}
                                    </div>
                                    <Info className="text-gold mb-3" size={32} />
                                    <p className="text-sm font-bold dark:text-white">Visualizador em breve</p>
                                    <p className="text-[10px] text-slate-400 text-center mt-2 px-4 italic">Estamos a preparar uma ilustração realista para si.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-pink-50 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-900 dark:bg-gold dark:text-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SizeGuideModal;
