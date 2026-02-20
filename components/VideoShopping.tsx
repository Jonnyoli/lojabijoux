import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store';
import { ShoppingBag, ChevronUp, ChevronDown, Heart, MessageCircle, Share2, Play, Pause, Volume2, VolumeX, X, Zap } from 'lucide-react';
import { Product, SocialPost } from '../types';

const VideoShopping: React.FC = () => {
    const { socialPosts, products, addToCart } = useApp();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const videoPosts = socialPosts.filter(post => post.type === 'tiktok' && post.status === 'approved');

    useEffect(() => {
        // Auto-play the active video
        videoRefs.current.forEach((video, idx) => {
            if (video) {
                if (idx === activeIndex) {
                    if (isPlaying) video.play().catch(() => setIsPlaying(false));
                    else video.pause();
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            }
        });
    }, [activeIndex, isPlaying]);

    const handleScroll = (direction: 'up' | 'down') => {
        if (direction === 'down' && activeIndex < videoPosts.length - 1) {
            setActiveIndex(activeIndex + 1);
        } else if (direction === 'up' && activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };

    const getTaggedProducts = (productIds: string[]) => {
        return products.filter(p => productIds.includes(p.id));
    };

    if (videoPosts.length === 0) return null;

    return (
        <section className="h-screen w-full bg-black relative flex items-center justify-center overflow-hidden">
            {/* Background Blur */}
            <div className="absolute inset-0 z-0">
                <img
                    src={videoPosts[activeIndex].mediaUrl}
                    alt=""
                    className="w-full h-full object-cover blur-3xl opacity-20"
                />
            </div>

            <div className="relative z-10 w-full max-w-[450px] h-[85vh] md:h-[90vh] bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col group/container">
                {/* Navigation Controls */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 opacity-0 group-hover/container:opacity-100 transition-opacity">
                    <button
                        onClick={() => handleScroll('up')}
                        disabled={activeIndex === 0}
                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all disabled:opacity-30"
                    >
                        <ChevronUp size={24} />
                    </button>
                    <button
                        onClick={() => handleScroll('down')}
                        disabled={activeIndex === videoPosts.length - 1}
                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all disabled:opacity-30"
                    >
                        <ChevronDown size={24} />
                    </button>
                </div>

                {/* Video Player */}
                <div className="flex-grow relative bg-black">
                    {videoPosts.map((post, index) => (
                        <div
                            key={post.id}
                            className={`absolute inset-0 transition-all duration-500 ease-in-out ${index === activeIndex ? 'translate-y-0 opacity-100' : index < activeIndex ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'}`}
                        >
                            {/* Note: Using images for mock videos since we don't have real TikTok video files */}
                            <img
                                src={post.mediaUrl}
                                alt=""
                                className="w-full h-full object-cover"
                            />

                            {/* Play/Pause Overlay */}
                            <div
                                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                onClick={() => setIsPlaying(!isPlaying)}
                            >
                                {!isPlaying && <div className="p-6 bg-black/40 backdrop-blur-sm rounded-full text-white animate-scale-in"><Play size={48} fill="currentColor" /></div>}
                            </div>

                            {/* Video Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full border-2 border-gold p-0.5">
                                        <img src="https://i.pravatar.cc/100?u=aura" alt="" className="w-full h-full rounded-full object-cover" />
                                    </div>
                                    <div>
                                        <span className="text-white font-bold">@aurabijoux_pt</span>
                                        <p className="text-white/60 text-xs">Coleção 2024</p>
                                    </div>
                                </div>
                                <p className="text-white text-sm leading-relaxed line-clamp-2 max-w-[80%] mb-6">
                                    {post.caption}
                                </p>

                                {/* Tagged Products in Video */}
                                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                    {getTaggedProducts(post.productIds).map(p => (
                                        <div key={p.id} className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl flex items-center gap-3 w-48">
                                            <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                                            <div className="flex-grow min-w-0">
                                                <p className="text-white text-[10px] font-bold truncate">{p.name}</p>
                                                <p className="text-gold text-[10px] font-bold">{p.price.toFixed(2)}€</p>
                                                <button
                                                    onClick={() => addToCart(p)}
                                                    className="bg-white text-slate-900 text-[8px] font-bold px-2 py-1 rounded-full mt-1 uppercase"
                                                >
                                                    Comprar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Side Actions */}
                            <div className="absolute right-6 bottom-32 flex flex-col gap-6 items-center">
                                <div className="flex flex-col items-center gap-1 group/btn cursor-pointer">
                                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white transition-all group-hover/btn:bg-pink-500 group-hover/btn:scale-110">
                                        <Heart size={20} />
                                    </div>
                                    <span className="text-white text-[10px] font-bold">1.2k</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 group/btn cursor-pointer">
                                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white transition-all group-hover/btn:bg-blue-500 group-hover/btn:scale-110">
                                        <MessageCircle size={20} />
                                    </div>
                                    <span className="text-white text-[10px] font-bold">48</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 group/btn cursor-pointer">
                                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white transition-all group-hover/btn:bg-gold group-hover/btn:scale-110">
                                        <Share2 size={20} />
                                    </div>
                                    <span className="text-white text-[10px] font-bold">241</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating Controls */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-50">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest border border-white/10">
                        <Zap size={12} className="text-gold" /> Video Shopping
                    </div>
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-black/60 transition-all"
                    >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                </div>
            </div>

            {/* Close/Back Button */}
            <button
                className="fixed top-10 right-10 text-white hover:text-gold transition-colors"
                onClick={() => window.history.back()}
            >
                <X size={32} />
            </button>

            {/* Feed Progress */}
            <div className="fixed left-1/2 -translate-x-1/2 bottom-10 flex gap-2">
                {videoPosts.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-8 bg-gold' : 'w-2 bg-white/20'}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default VideoShopping;
