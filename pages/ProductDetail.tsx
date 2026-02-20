
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Share2, ShieldCheck, Truck, RefreshCcw, Check, X, MessageSquare, User as UserIcon, Ruler } from 'lucide-react';
import { useApp } from '../store';
import ProductCard from '../components/ProductCard';
import { Review } from '../types';
import SizeGuideModal from '../components/SizeGuideModal';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { products, addToCart, wishlist, toggleWishlist, addReview, user, addRestockRequest } = useApp();
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showToast, setShowToast] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [restockEmail, setRestockEmail] = useState('');
  const [restockStatus, setRestockStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Review Form State
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', userName: '' });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    addReview(product.id, {
      productId: product.id,
      userId: user ? user.id : 'guest',
      userName: user ? user.name : (newReview.userName || 'Convidado'),
      rating: newReview.rating,
      comment: newReview.comment
    });

    setNewReview({ rating: 5, comment: '', userName: '' });
    // Show success feedback (maybe reuse toast or a specific message)
    alert('Obrigado pela sua avaliação!');
  };

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (!product) return <div className="py-20 text-center text-gray-500 font-serif text-xl">Produto não encontrado.</div>;

  const isWishlisted = wishlist.includes(product.id);

  // Cross-selling Logic: "Complete the Look"
  // If Necklace -> show Earrings/Rings
  // If Earrings -> show Necklace/Rings
  // If Ring -> show Necklace/Earrings
  const complementaryCategories: Record<string, string[]> = {
    'Colares': ['Brincos', 'Anéis'],
    'Brincos': ['Colares', 'Anéis'],
    'Anéis': ['Colares', 'Brincos'],
  };

  const targetCategories = complementaryCategories[product.category] || [];

  // prioritizes complementary products, then fallbacks to same category if not enough
  const relatedProducts = products
    .filter(p => p.id !== product.id)
    .sort((a, b) => {
      const aIsComp = targetCategories.includes(a.category) ? 1 : 0;
      const bIsComp = targetCategories.includes(b.category) ? 1 : 0;
      return bIsComp - aIsComp; // descending (1 first)
    })
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowToast(true);
  };

  const allMedia = [
    ...product.images.map(url => ({ type: 'image' as const, url })),
    ...(product.videos || []).map(url => ({ type: 'video' as const, url }))
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Toast Notification */}
      <div className={`fixed top-24 right-4 z-[60] transform transition-all duration-500 ease-out ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-white dark:bg-gray-800 border border-pink-100 dark:border-pink-900 shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[300px]">
          <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-pink-100">
            <Check size={24} />
          </div>
          <div className="flex-grow">
            <p className="font-bold text-gray-900 dark:text-white text-sm">Adicionado ao Carrinho!</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{product.name} ({quantity} un.)</p>
          </div>
          <button onClick={() => setShowToast(false)} className="text-gray-300 hover:text-gray-500 transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="flex mb-8 text-sm text-gray-400">
        <Link to="/" className="hover:text-pink-500 transition-colors">Início</Link>
        <span className="mx-2">/</span>
        <Link to="/catalog" className="hover:text-pink-500 transition-colors">Loja</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Media Gallery */}
        <div className="space-y-4">
          <div
            className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-800 shadow-inner group relative cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            {allMedia[selectedMedia]?.type === 'video' ? (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <iframe
                  src={allMedia[selectedMedia].url.includes('youtube.com')
                    ? allMedia[selectedMedia].url.replace('watch?v=', 'embed/')
                    : allMedia[selectedMedia].url}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div
                className="w-full h-full transition-transform duration-500 ease-out"
                style={isZoomed ? {
                  backgroundImage: `url(${allMedia[selectedMedia]?.url})`,
                  backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                  backgroundSize: '200%',
                } : {
                  backgroundImage: `url(${allMedia[selectedMedia]?.url})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
              />
            )}

            {product.isNew && (
              <span className="absolute top-6 left-6 bg-pink-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg z-10">Novo</span>
            )}

            {/* Magnifying Glass Indicator Only on Images */}
            {allMedia[selectedMedia]?.type === 'image' && !isZoomed && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-xs font-bold uppercase tracking-widest">Passar para ampliar</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {allMedia.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMedia(idx)}
                className={`w-24 h-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all duration-300 relative ${selectedMedia === idx ? 'border-pink-500 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={item.url} alt="" className="w-full h-full object-cover" />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-gold font-bold uppercase tracking-[0.2em] text-[10px]">{product.category}</span>
            <div className="flex gap-4">
              <button className="text-gray-400 hover:text-pink-500 transition-colors bg-white dark:bg-gray-800 p-2 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm"><Share2 size={18} /></button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 ${isWishlisted ? 'text-pink-500 bg-pink-50 dark:bg-pink-900/30 border-pink-100 dark:border-pink-900' : 'text-gray-400 bg-white dark:bg-gray-800 hover:text-pink-500'}`}
              >
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4 leading-tight">{product.name}</h1>

          <div className="flex items-center mb-6">
            <div className="flex text-yellow-400 gap-0.5 mr-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-gray-400 text-sm font-medium">{product.rating} <span className="mx-1 opacity-30">|</span> {product.reviews?.length || 0} avaliações</span>
          </div>

          <p className="text-4xl font-bold text-gray-900 dark:text-white mb-8 font-serif">{product.price.toFixed(2)}€</p>

          <div className="bg-white dark:bg-gray-800 border border-pink-50 dark:border-pink-900/30 p-8 rounded-3xl mb-8 space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50/30 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="flex items-center text-xs font-bold uppercase tracking-widest relative z-10">
              {product.stock > 0 ? (
                <span className="text-emerald-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Em stock ({product.stock} disponíveis)
                </span>
              ) : (
                <span className="text-red-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div> Esgotado
                </span>
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed font-light relative z-10">{product.description}</p>

            {(product.category === 'Anéis' || product.category === 'Colares') && (
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gold hover:text-gold/80 transition-colors mt-2"
              >
                <Ruler size={14} /> Ver Guia de Tamanhos
              </button>
            )}
          </div>

          {product.stock === 0 && (
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-4 animate-fade-in shadow-inner">
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-full flex items-center justify-center shrink-0">
                  <RefreshCcw size={20} className="animate-spin-slow" />
                </div>
                <div>
                  <p className="font-bold text-sm">Esgotado?</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Nós avisamos quando voltar!</p>
                </div>
              </div>

              {restockStatus === 'success' ? (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-center text-sm font-bold animate-fade-in border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center gap-2">
                  <Check size={18} /> Registado com sucesso!
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="O seu email..."
                    className="flex-grow bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-pink-900 transition-all dark:text-white placeholder:text-gray-300"
                    value={restockEmail}
                    onChange={(e) => setRestockEmail(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      if (restockEmail && restockEmail.includes('@')) {
                        setRestockStatus('submitting');
                        setTimeout(() => {
                          addRestockRequest(product.id, restockEmail);
                          setRestockStatus('success');
                          setRestockEmail('');
                        }, 1000);
                      }
                    }}
                    disabled={restockStatus === 'submitting'}
                    className="bg-slate-900 dark:bg-pink-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {restockStatus === 'submitting' ? 'A processar...' : 'Notificar'}
                  </button>
                </div>
              )}
              <p className="text-[10px] text-gray-400 text-center italic">Ao subscrever, aceita a nossa política de privacidade.</p>
            </div>
          )}

          {product.stock > 0 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-gray-700/50 p-1 w-full sm:w-auto">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 rounded-xl transition-all text-gray-600 dark:text-gray-200 active:scale-90"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 rounded-xl transition-all text-gray-600 dark:text-gray-200 active:scale-90"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:flex-grow bg-pink-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-pink-600 transition-all shadow-xl shadow-pink-100 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <ShoppingBag size={22} strokeWidth={2} /> Adicionar ao Carrinho
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-50 dark:border-gray-700 rounded-2xl shadow-sm hover:border-pink-100 transition-colors">
                  <div className="w-10 h-10 bg-gold/10 text-gold rounded-full flex items-center justify-center shrink-0">
                    <Truck size={18} />
                  </div>
                  <div className="text-[10px] leading-tight">
                    <p className="font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Envio Premium</p>
                    <p className="text-gray-400">Grátis em compras +50€</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-50 dark:border-gray-700 rounded-2xl shadow-sm hover:border-pink-100 transition-colors">
                  <div className="w-10 h-10 bg-gold/10 text-gold rounded-full flex items-center justify-center shrink-0">
                    <RefreshCcw size={18} />
                  </div>
                  <div className="text-[10px] leading-tight">
                    <p className="font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Troca Fácil</p>
                    <p className="text-gray-400">Até 14 dias após receção</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs Section */}
          <div className="mt-12">
            <div className="flex border-b border-gray-100 dark:border-gray-700 mb-8 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'description' ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Detalhes da Peça
                {activeTab === 'description' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 animate-fade-in"></div>}
              </button>
              <button
                onClick={() => setActiveTab('material')}
                className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'material' ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Materiais & Cuidados
                {activeTab === 'material' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 animate-fade-in"></div>}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'reviews' ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Avaliações ({product.reviews?.length || 0})
                {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 animate-fade-in"></div>}
              </button>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed min-h-[120px] animate-fade-in">
              {activeTab === 'description' && (
                <div className="space-y-5">
                  <p className="font-light">Inspirada na delicadeza da natureza e no brilho da alma feminina, esta peça foi concebida para iluminar o seu quotidiano com sofisticação atemporal.</p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-xs font-medium text-gray-500">
                      <div className="w-5 h-5 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                        <Check size={12} />
                      </div>
                      Fecho de segurança reforçado com logótipo Aura
                    </li>
                    <li className="flex items-center gap-3 text-xs font-medium text-gray-500">
                      <div className="w-5 h-5 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                        <Check size={12} />
                      </div>
                      Hipoalergénico e livre de níquel (Nickel-free)
                    </li>
                    <li className="flex items-center gap-3 text-xs font-medium text-gray-500">
                      <div className="w-5 h-5 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                        <Check size={12} />
                      </div>
                      Polimento manual espelhado premium
                    </li>
                  </ul>
                </div>
              )}
              {activeTab === 'material' && (
                <div className="space-y-4 font-light">
                  <p>A Aura Bijoux utiliza apenas materiais de excelência para garantir que as suas memórias brilham para sempre:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl">
                      <p className="font-bold text-gray-900 dark:text-white text-xs uppercase mb-1">Composição</p>
                      <p className="text-xs">Base em latão de joalharia com banho de Ouro 18k (3 microns) ou Prata 925.</p>
                    </div>
                    <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl">
                      <p className="font-bold text-gray-900 dark:text-white text-xs uppercase mb-1">Cuidados</p>
                      <p className="text-xs">Evite o contacto com perfumes e água salgada. Limpe com um pano macio e seco.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-10 animate-fade-in">
                  {/* Reviews List */}
                  <div className="space-y-6">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-500 flex items-center justify-center">
                                <UserIcon size={14} />
                              </div>
                              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">{review.userName}</span>
                            </div>
                            <span className="text-[10px] text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex text-yellow-400 gap-0.5 mb-2 pl-11">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill={i < Math.floor(review.rating) ? "currentColor" : "none"} />
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 pl-11 font-light italic">"{review.comment}"</p>
                        </div>
                      )) // Added closing parenthesis here
                    ) : ( // Added colon here
                      <p className="text-center text-gray-400 italic py-8">Ainda não há avaliações para esta peça. Seja a primeira a dar a sua opinião!</p>
                    )}
                  </div>

                  {/* Add Review Form */}
                  <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-3xl p-8 border border-white dark:border-gray-700 shadow-inner">
                    <h3 className="font-serif font-bold text-xl mb-6 dark:text-white">Deixe a sua avaliação</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-5">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Classificação</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className="transition-transform hover:scale-110 focus:outline-none"
                            >
                              <Star
                                size={24}
                                className={star <= newReview.rating ? "text-yellow-400" : "text-gray-200 dark:text-gray-600"}
                                fill={star <= newReview.rating ? "currentColor" : "none"}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {!user && (
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Nome</label>
                          <input
                            required
                            type="text"
                            value={newReview.userName}
                            onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                            placeholder="O seu nome"
                            className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-pink-900 dark:text-white transition-all placeholder:text-gray-300"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Comentário</label>
                        <textarea
                          required
                          rows={3}
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          placeholder="O que achou desta peça?"
                          className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-pink-900 dark:text-white transition-all resize-none placeholder:text-gray-300"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                      >
                        Publicar Avaliação
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 border-t border-pink-50 dark:border-pink-900/30 pt-20">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Combinações Perfeitas</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white">Complete o Look</h2>
            </div>
            <Link to="/catalog" className="text-pink-500 font-bold hover:underline text-sm uppercase tracking-widest">Ver Tudo</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
      {/* Mobile Sticky Add to Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-4 md:hidden z-40 flex items-center gap-4 animate-slide-up shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-grow min-w-0">
          <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{product.name}</p>
          <p className="text-pink-500 font-bold text-xs">{product.price.toFixed(2)}€</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-gray-900 dark:bg-pink-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl active:scale-95 flex items-center gap-2 whitespace-nowrap"
        >
          <ShoppingBag size={16} /> Adicionar
        </button>
      </div>
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        initialTab={product.category === 'Colares' ? 'necklaces' : 'rings'}
      />
    </div>
  );
};

export default ProductDetail;
