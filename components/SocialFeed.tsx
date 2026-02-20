import React, { useState } from 'react';
import { useApp } from '../store';
import { Camera, Zap, Users, ShoppingBag, X, ChevronRight } from 'lucide-react';
import { Category, Product, SocialPost } from '../types';
import { Link } from 'react-router-dom';

const SocialFeed: React.FC = () => {
    const { socialPosts, products, addToCart } = useApp();
    const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'instagram' | 'tiktok' | 'ugc'>('all');

    const filteredPosts = socialPosts.filter(post =>
        post.status === 'approved' && (activeFilter === 'all' || post.type === activeFilter)
    );

    const getTaggedProducts = (productIds: string[]) => {
        return products.filter(p => productIds.includes(p.id));
    };

    return (
        <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-500 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-[1px] bg-gold"></div>
                            <span className="text-gold font-bold uppercase tracking-[0.3em] text-xs">Aura on Social</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                            Shop the <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-pink-500 to-purple-500">Feed</span>
                        </h2>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-100">
                        <div className="flex gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl">
                            {[
                                { id: 'all', label: 'Todos', icon: ShoppingBag },
                                { id: 'instagram', label: 'Instagram', icon: Camera },
                                { id: 'tiktok', label: 'TikTok', icon: Zap },
                                { id: 'ugc', label: 'Comunidade', icon: Users }
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFilter(f.id as any)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeFilter === f.id
                                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
                                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                        }`}
                                >
                                    <f.icon size={16} />
                                    <span className="hidden sm:inline">{f.label}</span>
                                </button>
                            ))}
                        </div>

                        <Link
                            to="/video-shopping"
                            className="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-gold text-white dark:text-slate-900 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all group"
                        >
                            <Zap size={18} className="fill-current group-hover:animate-pulse" />
                            Live Shopping
                        </Link>
                    </div>
                </div>

                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {filteredPosts.map((post, index) => (
                            <div
                                key={post.id}
                                onClick={() => setSelectedPost(post)}
                                className="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer animate-fade-in-up transition-all hover:shadow-2xl hover:shadow-gold/10"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <img
                                    src={post.mediaUrl}
                                    alt={post.caption}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                            {post.type === 'instagram' ? <Camera size={14} /> : post.type === 'tiktok' ? <Zap size={14} /> : <Users size={14} />}
                                        </div>
                                        {post.userName && <span className="text-white text-xs font-bold">@{post.userName}</span>}
                                    </div>
                                    <p className="text-white/80 text-xs line-clamp-2 mb-4 italic">"{post.caption}"</p>
                                    <div className="flex items-center justify-between">
                                        <span className="bg-gold text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            Shop the Look
                                        </span>
                                        <div className="flex -space-x-2">
                                            {getTaggedProducts(post.productIds).slice(0, 3).map((p, i) => (
                                                <div key={p.id} className="w-8 h-8 rounded-full border-2 border-slate-900 overflow-hidden bg-white">
                                                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile indicators */}
                                <div className="absolute top-4 right-4 sm:hidden">
                                    <div className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg">
                                        <ShoppingBag size={14} className="text-pink-500" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
                        <Camera size={48} className="mx-auto text-slate-300 mb-6 opacity-50" />
                        <h3 className="text-xl font-serif font-bold text-slate-400">O nosso feed está a regressar...</h3>
                        <p className="text-sm text-slate-400/60 mt-2">Siga-nos em @aurabijoux_pt para as novidades diárias.</p>
                    </div>
                )}
            </div>

            {/* Shop the Look Modal */}
            {selectedPost && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-fade-in">
                    <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-lg" onClick={() => setSelectedPost(null)}></div>

                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in">
                        <button
                            onClick={() => setSelectedPost(null)}
                            className="absolute top-6 right-6 z-10 p-3 bg-white/20 backdrop-blur-md text-white md:text-slate-900 dark:md:text-white rounded-full hover:bg-white/40 transition-all"
                        >
                            <X size={24} />
                        </button>

                        {/* Media side */}
                        <div className="w-full md:w-3/5 aspect-square md:aspect-auto relative bg-black">
                            <img
                                src={selectedPost.mediaUrl}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-10 left-10 hidden md:block">
                                <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                    <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-slate-900">
                                        {selectedPost.type === 'instagram' ? <Camera size={20} /> : selectedPost.type === 'tiktok' ? <Zap size={20} /> : <Users size={20} />}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold leading-none">@{selectedPost.userName || 'aurabijoux_pt'}</p>
                                        <p className="text-white/60 text-[10px] mt-1 uppercase tracking-widest">{selectedPost.type} Feed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products side */}
                        <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col">
                            <div className="mb-10">
                                <span className="text-gold font-bold uppercase tracking-widest text-[10px]">Shop the Look</span>
                                <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                                    {selectedPost.caption || 'Get this stunning look for your collection'}
                                </h3>
                            </div>

                            <div className="flex-grow space-y-6 overflow-y-auto pr-4 scrollbar-thin">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Peças na Publicação</p>
                                {getTaggedProducts(selectedPost.productIds).map(p => (
                                    <div key={p.id} className="group p-4 rounded-3xl border border-slate-100 dark:border-white/5 hover:border-gold/30 hover:bg-gold/5 transition-all duration-300 flex items-center gap-6">
                                        <img src={p.images[0]} alt={p.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-slate-800 dark:text-slate-200">{p.name}</h4>
                                            <p className="text-gold font-bold mt-1">{p.price.toFixed(2)}€</p>
                                            <button
                                                onClick={() => addToCart(p)}
                                                className="mt-3 text-[10px] font-bold text-slate-900 dark:text-white flex items-center gap-2 hover:gap-3 transition-all group/btn"
                                            >
                                                <ShoppingBag size={12} className="text-pink-500" />
                                                ADICIONAR AO CARRINHO <ChevronRight size={10} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-10 mt-10 border-t border-slate-100 dark:border-white/5">
                                <Link
                                    to="/catalog"
                                    onClick={() => setSelectedPost(null)}
                                    className="w-full block text-center py-5 bg-slate-900 dark:bg-gold text-white dark:text-slate-900 rounded-2xl font-bold shadow-xl shadow-slate-200 dark:shadow-gold/10 hover:shadow-2xl transition-all"
                                >
                                    Ver Toda a Coleção
                                </Link>
                                {selectedPost.postUrl && (
                                    <a
                                        href={selectedPost.postUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full block text-center mt-4 text-xs font-bold text-slate-400 hover:text-gold transition-colors underline decoration-dotted underline-offset-4"
                                    >
                                        Ver publicação original no {selectedPost.type}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SocialFeed;
