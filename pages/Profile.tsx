import React, { useState } from 'react';
import { Package, MapPin, User as UserIcon, LogOut, ChevronRight, Heart, Plus, Trash2, Edit2, Star } from 'lucide-react';
import { useApp } from '../store';
import { Link, useNavigate } from 'react-router-dom';

type Tab = 'orders' | 'personal' | 'addresses' | 'wishlist' | 'aura-club';

const Profile: React.FC = () => {
  const { user, logout, orders, wishlist, products } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  // Personal Data Form State
  const [personalData, setPersonalData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  // Addresses come from user.addresses directly
  // const [addresses, setAddresses] = useState(user.addresses || []); // No need for local state if using store

  // User is guaranteed by PrivateRoute, but we keep safety checks
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const wishlistedItems = products.filter(p => wishlist.includes(p.id));

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <section>
            <h3 className="text-2xl font-serif font-bold mb-6">Histórico de Encomendas</h3>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-all group">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-800">{order.id}</span>
                        <span className="text-xs px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded-full font-bold uppercase tracking-wider">{order.status}</span>
                      </div>
                      <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString('pt-PT')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.items.slice(0, 3).map(item => (
                        <img key={item.id} src={item.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-50" />
                      ))}
                      {order.items.length > 3 && <span className="text-xs text-gray-400 font-bold">+{order.items.length - 3}</span>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{order.total.toFixed(2)}€</p>
                      <button className="text-xs text-pink-500 font-bold hover:underline">Ver Detalhes</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-100">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200 shadow-sm">
                  <Package size={32} />
                </div>
                <p className="text-gray-500 font-light">Ainda não realizou nenhuma encomenda.</p>
                <Link to="/catalog" className="text-pink-500 font-bold mt-4 inline-block hover:underline">Que tal começar a brilhar agora?</Link>
              </div>
            )}
          </section>
        );

      case 'personal':
        return (
          <section>
            <h3 className="text-2xl font-serif font-bold mb-6">Dados Pessoais</h3>
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
                    <input
                      type="text"
                      value={personalData.name}
                      onChange={e => setPersonalData({ ...personalData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={personalData.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Para alterar o email, contacte o suporte.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={personalData.phone}
                      placeholder="+351 912 345 678"
                      onChange={e => setPersonalData({ ...personalData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-50 flex justify-end">
                  <button type="button" className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-200">
                    Guardar Alterações
                  </button>
                </div>
              </form>
            </div>
          </section>
        );

      case 'addresses':
        return (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif font-bold">As minhas Moradas</h3>
              <button className="flex items-center gap-2 text-sm font-bold text-pink-500 bg-pink-50 px-4 py-2 rounded-full hover:bg-pink-100 transition-colors">
                <Plus size={16} /> Nova Morada
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(user.addresses || []).map(addr => (
                <div key={addr.id} className={`border rounded-2xl p-6 relative group transition-all ${addr.isDefault ? 'border-pink-500 bg-pink-50/10' : 'border-gray-100 bg-white hover:border-pink-200'}`}>
                  {addr.isDefault && (
                    <span className="absolute top-4 right-4 text-xs font-bold bg-pink-100 text-pink-600 px-2 py-1 rounded-full">Principal</span>
                  )}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${addr.isDefault ? 'bg-pink-100 text-pink-500' : 'bg-gray-50 text-gray-400'}`}>
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{addr.name}</h4>
                      <p className="text-gray-500 text-sm mt-1">{addr.street}</p>
                      <p className="text-gray-500 text-sm">{addr.zipCode} {addr.city}</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-gray-400 hover:text-pink-500 p-2 hover:bg-pink-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'wishlist':
        return (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif font-bold flex items-center gap-2">
                <Heart size={24} className="text-pink-500" /> Favoritos
              </h3>
              <Link to="/catalog" className="text-sm text-gray-400 hover:text-pink-500 transition-colors">Ver Coleção Completa</Link>
            </div>
            {wishlistedItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {wishlistedItems.map(p => (
                  <Link key={p.id} to={`/product/${p.id}`} className="group relative rounded-2xl overflow-hidden shadow-sm aspect-square border border-gray-50">
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                      <div className="w-full">
                        <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-0.5 opacity-80">{p.category}</p>
                        <p className="text-white text-xs font-bold truncate">{p.name}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100">
                <Heart size={40} className="mx-auto text-pink-50 mb-4" />
                <p className="text-gray-400 italic">A sua lista de desejos está ansiosa por peças novas.</p>
              </div>
            )}
          </section>
        );

      case 'aura-club':
        const nextTier = user.level === 'Bronze' ? 'Prata' : user.level === 'Prata' ? 'Ouro' : null;
        const tierThreshold = user.level === 'Bronze' ? 200 : user.level === 'Prata' ? 500 : 500;
        const currentPoints = user.points || 0;
        const progress = Math.min((currentPoints / tierThreshold) * 100, 100);

        return (
          <section className="animate-reveal space-y-12">
            {/* Membership Card - The "Crown Jewel" of the UI */}
            <div className="relative group perspective-1000 max-w-2xl mx-auto md:mx-0">
              <div className="relative h-64 md:h-80 w-full rounded-[2.5rem] bg-slate-950 overflow-hidden shadow-2xl transition-transform duration-700 preserve-3d group-hover:rotate-y-12 group-hover:rotate-x-6 group-hover:scale-105 border border-white/10">
                {/* Mesh background inside card */}
                <div className="absolute inset-0 mesh-dark opacity-60"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>

                {/* Digital shimmer effect */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
                <div className="absolute inset-0 shimmer opacity-20"></div>

                {/* Card Content */}
                <div className="relative h-full p-10 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">Membro Exclusivo</p>
                      <h4 className="text-3xl font-serif font-bold text-white tracking-wide">Aura Club</h4>
                    </div>
                    <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
                      <Star className="text-gold animate-pulse" size={28} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Nível Atual</p>
                        <p className="text-2xl font-serif font-bold text-white">{user.level}</p>
                      </div>
                      <div className="w-px h-10 bg-white/10"></div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Saldo Brilho</p>
                        <p className="text-2xl font-serif font-bold text-gold">{currentPoints} pts</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <p className="text-sm font-mono text-white/40 tracking-[0.2em]">{user.name.toUpperCase()}</p>
                      <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">Since 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress and Benefits Staggered Effect */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-8">
                {nextTier && (
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-serif font-bold text-xl">Próximo Brilho</h4>
                      <span className="text-xs font-bold text-pink-500 bg-pink-50 px-3 py-1 rounded-full">{nextTier}</span>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-50 rounded-full overflow-hidden p-1 border border-gray-100">
                        <div
                          className="h-full bg-gradient-to-r from-gold via-yellow-300 to-gold rounded-full transition-all duration-[2000ms] ease-out shadow-lg"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>{user.level}</span>
                        <span>{nextTier}</span>
                      </div>
                      <p className="text-center text-sm text-gray-500 italic">“Faltam apenas {tierThreshold - currentPoints} pontos para elevar o seu brilho para {nextTier}.”</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { level: 'Bronze', points: '0-200', active: user.level === 'Bronze', color: 'slate' },
                    { level: 'Prata', points: '201-500', active: user.level === 'Prata', color: 'blue' },
                    { level: 'Ouro', points: '501+', active: user.level === 'Ouro', color: 'gold' }
                  ].map((tier, idx) => (
                    <div key={idx} className={`p-6 rounded-3xl border transition-all duration-500 ${tier.active ? 'border-gold bg-gold/5 ring-4 ring-gold/5' : 'border-gray-50 bg-gray-50/30'}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${tier.active ? 'text-gold' : 'text-gray-400'}`}>Terapia {idx + 1}</p>
                      <h5 className="font-serif font-bold text-lg">{tier.level}</h5>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
                <h4 className="font-serif font-bold text-xl mb-8 flex items-center gap-2">
                  <Plus className="text-gold rotate-45" size={20} /> Vantagens {user.level}
                </h4>
                <ul className="space-y-6">
                  {(user.level === 'Bronze' ? ['1€ = 1 Ponto', 'Acesso a Promoções'] :
                    user.level === 'Prata' ? ['Portes Grátis Sempre', 'Presente de Aniversário', 'Acesso Antecipado'] :
                      ['Desconto Fixo de 5%', 'Personal Shopper', 'Eventos VIP Exclusive']
                  ).map((benefit, i) => (
                    <li key={i} className="flex items-start gap-4 group animate-reveal" style={{ animationDelay: `${i * 150}ms` }}>
                      <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs shrink-0 group-hover:scale-125 transition-transform duration-300">
                        <ChevronRight size={14} />
                      </div>
                      <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-10 bg-gold/10 border border-gold/20 text-gold py-4 rounded-2xl font-bold hover:bg-gold hover:text-slate-950 transition-all duration-500">
                  Resgatar Benefícios
                </button>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-1 space-y-2">
          <div className="flex items-center space-x-4 mb-10 px-4">
            <img src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} alt="" className="w-16 h-16 rounded-full border-2 border-pink-200 object-cover" />
            <div>
              <h2 className="font-serif font-bold text-xl">{user.name}</h2>
              <p className="text-xs text-gray-400">Cliente desde 2024</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-pink-50 text-pink-500 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <div className="flex items-center"><Package size={18} className="mr-3" /> Encomendas</div>
            {activeTab === 'orders' && <ChevronRight size={16} />}
          </button>

          <button
            onClick={() => setActiveTab('personal')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'personal' ? 'bg-pink-50 text-pink-500 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <div className="flex items-center"><UserIcon size={18} className="mr-3" /> Dados Pessoais</div>
            {activeTab === 'personal' && <ChevronRight size={16} />}
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'addresses' ? 'bg-pink-50 text-pink-500 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <div className="flex items-center"><MapPin size={18} className="mr-3" /> Moradas</div>
            {activeTab === 'addresses' && <ChevronRight size={16} />}
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'wishlist' ? 'bg-pink-50 text-pink-500 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <div className="flex items-center"><Heart size={18} className="mr-3" /> Favoritos</div>
            {activeTab === 'wishlist' && <ChevronRight size={16} />}
          </button>

          <button
            onClick={() => setActiveTab('aura-club')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'aura-club' ? 'bg-slate-900 text-gold font-bold shadow-lg shadow-slate-200' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <div className="flex items-center"><Plus size={18} className="mr-3 rotate-45" /> Aura Club</div>
            {activeTab === 'aura-club' && <ChevronRight size={16} className="text-gold" />}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-50 rounded-xl transition-all mt-8"
          >
            <LogOut size={18} className="mr-3" /> Sair da Conta
          </button>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3 space-y-12">
          {/* Welcome Banner - Premium Overhaul */}
          <div className="relative bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl shadow-slate-200 overflow-hidden group">
            <div className="absolute inset-0 mesh-dark opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                  Área Exclusiva
                </div>
                <h3 className="text-4xl md:text-5xl font-serif font-bold leading-tight">Olá, <span className="text-gold italic font-normal">{user.name.split(' ')[0]}</span></h3>
                <p className="text-slate-400 font-light text-lg max-w-sm">Desejamos-lhe um dia repleto de brilho e as melhores escolhas Aura.</p>
              </div>
              <div className="flex shrink-0">
                <Link to="/catalog" className="group relative bg-gold text-slate-950 px-10 py-5 rounded-2xl font-bold transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:-translate-y-1 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">Explorar Coleção <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" /></span>
                  <div className="absolute inset-0 shimmer opacity-30"></div>
                </Link>
              </div>
            </div>
          </div>

          <div className="animate-reveal" style={{ animationDelay: '200ms' }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
