
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import {
  LayoutDashboard, ShoppingCart, Box, Users, Plus, Edit2, Trash2,
  Search, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight,
  MoreVertical, Clock, CheckCircle, Package, AlertCircle, X, ChevronDown,
  AlertTriangle, Settings as SettingsIcon, Camera, Zap, MessageSquare, Shield, Bell, Eye, Star, ClipboardList, Activity, RefreshCcw, Check, Ruler, ArrowRight
} from 'lucide-react';
import { useApp } from '../store';
import { Product, Category, ProductColor, User, SocialPost } from '../types';
import { CATEGORIES, COLORS } from '../constants';

const Admin: React.FC = () => {
  const { products, setProducts, orders, allUsers, setAllUsers, updateUser, deleteUser, siteSettings, updateSiteSettings, theme, toggleTheme, logs, addLog, user: currentUser, restockRequests, socialPosts, addSocialPost, updateSocialPost, deleteSocialPost, socialAccounts, addSocialAccount, deleteSocialAccount } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState('Todos');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocialPost, setEditingSocialPost] = useState<SocialPost | null>(null);
  const [socialFormData, setSocialFormData] = useState({
    type: 'instagram' as 'instagram' | 'tiktok' | 'ugc',
    mediaUrl: '',
    postUrl: '',
    caption: '',
    productIds: [] as string[],
    status: 'approved' as 'pending' | 'approved',
    userName: ''
  });

  // Advanced Filtering Logic
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return products;

    return products.filter(p => {
      const formattedSku = `SKU-${p.id.padStart(4, '0')}`.toLowerCase();
      const nameMatch = p.name.toLowerCase().includes(term);
      const idMatch = p.id.toLowerCase().includes(term);
      const skuMatch = formattedSku.includes(term);
      const categoryMatch = p.category.toLowerCase().includes(term);
      const colorMatch = p.color.toLowerCase().includes(term);

      return nameMatch || idMatch || skuMatch || categoryMatch || colorMatch;
    });
  }, [products, searchTerm]);

  const filteredOrders = useMemo(() => {
    if (orderFilter === 'Todos') return orders;
    return orders.filter(o => o.status === orderFilter);
  }, [orders, orderFilter]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Colares' as Category,
    color: 'Gold' as ProductColor,
    stock: '',
    image: '',
    videos: '',
    description: ''
  });

  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: 'customer' as 'admin' | 'customer'
  });

  const [settingsFormData, setSettingsFormData] = useState({ ...siteSettings });

  const salesData = [
    { name: 'Seg', sales: 400, visits: 2400 },
    { name: 'Ter', sales: 300, visits: 1398 },
    { name: 'Qua', sales: 600, visits: 9800 },
    { name: 'Qui', sales: 800, visits: 3908 },
    { name: 'Sex', sales: 500, visits: 4800 },
    { name: 'Sáb', sales: 900, visits: 3800 },
    { name: 'Dom', sales: 700, visits: 4300 },
  ];

  const totalRevenue = useMemo(() => orders.reduce((acc, o) => acc + o.total, 0), [orders]);
  const aov = useMemo(() => orders.length > 0 ? totalRevenue / orders.length : 0, [totalRevenue, orders]);
  const conversionRate = 2.4; // Mocked for now

  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        color: product.color,
        stock: product.stock.toString(),
        image: product.images[0],
        videos: product.videos?.join(', ') || '',
        description: product.description
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        category: 'Colares',
        color: 'Gold',
        stock: '0',
        image: '',
        videos: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation: ensure stock is a positive integer
    const stockValue = parseInt(formData.stock);
    const finalStock = isNaN(stockValue) || stockValue < 0 ? 0 : Math.floor(stockValue);

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : Math.random().toString(36).substr(2, 9),
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      color: formData.color,
      stock: finalStock,
      images: [formData.image || 'https://via.placeholder.com/600x800'],
      videos: formData.videos ? formData.videos.split(',').map(v => v.trim()) : [],
      description: formData.description || 'Descrição da peça Aura Bijoux.',
      rating: editingProduct ? editingProduct.rating : 5.0,
      isNew: !editingProduct
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? newProduct : p));
    } else {
      setProducts(prev => [...prev, newProduct]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Tem a certeza que deseja remover este produto?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const pb = {
    dashboard: 'Painel de Controlo',
    products: 'Gestão de Inventário',
    orders: 'Gestão de Encomendas',
    users: 'Gestão de Utilizadores',
    settings: 'Configurações do Site',
    logs: 'Histórico de Atividades',
    restock: 'Pedidos de Reposição',
    social: 'Social Hub (Shop the Feed)'
  };

  const handleOpenUserModal = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsUserModalOpen(true);
  };

  const handleSaveSocialPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSocialPost) {
      updateSocialPost(editingSocialPost.id, socialFormData);
      addLog({
        adminName: currentUser?.name || 'Admin',
        action: `Post Social ${socialFormData.type} atualizado`,
        targetType: 'Settings',
        details: `Post ID: ${editingSocialPost.id} | Status: ${socialFormData.status}`
      });
    } else {
      addSocialPost(socialFormData);
      addLog({
        adminName: currentUser?.name || 'Admin',
        action: `Novo Post Social ${socialFormData.type}`,
        targetType: 'Settings',
        details: `URL: ${socialFormData.postUrl}`
      });
    }
    setIsSocialModalOpen(false);
    setEditingSocialPost(null);
  };

  const handleOpenSocialModal = (post?: SocialPost) => {
    if (post) {
      setEditingSocialPost(post);
      setSocialFormData({
        type: post.type,
        mediaUrl: post.mediaUrl,
        postUrl: post.postUrl,
        caption: post.caption,
        productIds: post.productIds,
        status: post.status,
        userName: post.userName || ''
      });
    } else {
      setEditingSocialPost(null);
      setSocialFormData({
        type: 'instagram',
        mediaUrl: '',
        postUrl: '',
        caption: '',
        productIds: [],
        status: 'approved',
        userName: ''
      });
    }
    setIsSocialModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, userFormData);
      setIsUserModalOpen(false);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Tem a certeza que deseja remover este utilizador? Esta ação é irreversível.')) {
      deleteUser(id);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(settingsFormData);
    addLog({
      adminName: currentUser?.name || 'Admin',
      action: 'Atualização das configurações globais do site',
      targetType: 'Settings',
      details: 'Alterações em identidade, marketing ou inventário.'
    });
    alert('Configurações guardadas com sucesso!');
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const configs: Record<string, string> = {
      'Processando': 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500/20',
      'Pendente': 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-500/20',
      'Enviado': 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-500/20',
      'Entregue': 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-500/20',
      'Cancelado': 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-500/20',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border tracking-wider transition-colors ${configs[status] || 'bg-gray-50 text-gray-600 dark:bg-slate-800 dark:text-slate-400'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCFD] dark:bg-slate-900 flex font-sans text-slate-900 dark:text-slate-100 transition-colors duration-500">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Admin Sidebar */}
      <aside className={`w-72 bg-slate-900 dark:bg-black border-r border-white/5 flex flex-col fixed lg:sticky top-0 h-screen z-[70] transition-all duration-500 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-slate-900 shadow-lg shadow-gold/20">
              <LayoutDashboard size={20} />
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight text-white">Admin <span className="text-gold">Aura</span></span>
          </div>
          <button className="lg:hidden text-white p-2 hover:bg-white/10 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-grow px-6 space-y-1 overflow-y-auto scrollbar-hide">
          <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Geral</p>
          <button
            onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'dashboard' ? 'bg-gold text-slate-900 shadow-lg shadow-gold/20' : 'text-slate-400 hover:bg-white/5 hover:text-gold'}`}
          >
            <LayoutDashboard size={18} className={`mr-3 transition-transform duration-300 group-hover:scale-110`} />
            <span className="font-semibold">Dashboard</span>
          </button>

          <p className="px-4 py-2 mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gestão</p>
          <button
            onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'products' ? 'bg-gold text-slate-900 shadow-lg shadow-gold/20' : 'text-slate-400 hover:bg-white/5 hover:text-gold'}`}
          >
            <Box size={18} className="mr-3 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-semibold">Produtos</span>
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'orders' ? 'bg-gold text-slate-900 shadow-lg shadow-gold/20' : 'text-slate-400 hover:bg-white/5 hover:text-gold'}`}
          >
            <ShoppingCart size={18} className="mr-3 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-semibold">Encomendas</span>
          </button>
          <button
            onClick={() => { setActiveTab('users'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'users' ? 'bg-gold text-slate-900 shadow-lg shadow-gold/20' : 'text-slate-400 hover:bg-white/5 hover:text-gold'}`}
          >
            <Users size={18} className="mr-3 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-semibold">Utilizadores</span>
          </button>
          <button
            onClick={() => { setActiveTab('restock'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'restock' ? 'bg-gold text-slate-900 shadow-lg shadow-gold/20' : 'text-slate-400 hover:bg-white/5 hover:text-gold'}`}
          >
            <RefreshCcw size={18} className="mr-3 transition-transform duration-300 group-hover:rotate-180" />
            <span className="font-semibold">Reposição</span>
            {restockRequests.filter(r => r.status === 'Pendente').length > 0 && (
              <span className="ml-auto bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {restockRequests.filter(r => r.status === 'Pendente').length}
              </span>
            )}
          </button>

          <p className="px-4 py-2 mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sistema</p>
          <button
            onClick={() => { setActiveTab('settings'); setSettingsFormData({ ...siteSettings }); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'settings' ? 'bg-gold text-slate-900 shadow-lg shadow-gold/20' : 'text-slate-400 hover:bg-white/5 hover:text-gold'}`}
          >
            <SettingsIcon size={18} className="mr-3 transition-transform duration-300 group-hover:rotate-90" />
            <span className="font-semibold">Configurações</span>
          </button>
          <button
            onClick={() => { setActiveTab('logs'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'logs' ? 'bg-gold text-slate-900 shadow-lg shadow-gold/20' : 'text-slate-400 hover:bg-white/5 hover:text-gold'}`}
          >
            <Activity size={18} className="mr-3 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-semibold">Histórico</span>
          </button>

          <p className="px-4 py-2 mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Marketing</p>
          <button
            onClick={() => { setActiveTab('social'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'social' ? 'bg-gold text-slate-900 shadow-lg shadow-gold/20' : 'text-slate-400 hover:bg-white/5 hover:text-gold'}`}
          >
            <Camera size={18} className="mr-3 transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-semibold">Social Hub</span>
            {socialPosts.filter(p => p.status === 'pending').length > 0 && (
              <span className="ml-auto bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {socialPosts.filter(p => p.status === 'pending').length}
              </span>
            )}
          </button>
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <Link
            to="/"
            className="w-full flex items-center px-4 py-3 rounded-2xl bg-white/5 text-slate-400 hover:bg-gold hover:text-slate-900 transition-all duration-300 group"
          >
            <ArrowRight size={18} className="mr-3 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-semibold">Voltar à Loja</span>
          </Link>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white">
            <p className="text-xs text-slate-500 mb-1">Precisa de ajuda?</p>
            <p className="text-sm font-bold mb-3">Guia do Administrador</p>
            <button className="w-full bg-gold text-slate-900 py-2 rounded-lg text-xs font-bold transition-colors hover:bg-gold/90">Aceder Docs</button>
          </div>
        </div>
      </aside>


      {/* Main Admin Content */}
      <main className="flex-grow p-4 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-3 bg-white dark:bg-slate-800 border border-pink-100 dark:border-white/5 rounded-xl text-slate-600 dark:text-slate-400 shadow-sm transition-all"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Plus className="rotate-45" size={20} />
            </button>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Aura Bijoux</p>
              <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">{pb[activeTab as keyof typeof pb]}</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="bg-white dark:bg-slate-800 border border-pink-100 dark:border-white/5 p-2 rounded-xl text-slate-400 hover:text-gold transition-all"
            >
              {theme === 'light' ? <Zap size={20} /> : <Zap size={20} className="fill-gold text-gold" />}
            </button>
            <div className="bg-white dark:bg-slate-800 border border-pink-100 dark:border-white/5 p-2 rounded-xl text-slate-400 hover:text-pink-500 transition-colors cursor-pointer">
              <Bell size={20} />
            </div>
            <div className="bg-white dark:bg-slate-800 border border-pink-100 dark:border-white/5 px-4 py-2 rounded-xl flex items-center gap-2 transition-all">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <span className="font-bold text-xs">{allUsers.find(u => u.email === 'admin@gmai.com')?.name.charAt(0) || 'A'}</span>
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 hidden md:block">{allUsers.find(u => u.email === 'admin@gmai.com')?.name || 'Admin'}</span>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: 'Vendas Totais', val: `${totalRevenue.toFixed(2)}€`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', trend: '+12%', up: true },
                { label: 'Valor Médio (AOV)', val: `${aov.toFixed(2)}€`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', trend: '+8%', up: true },
                { label: 'Taxa de Conversão', val: `${conversionRate}%`, icon: CheckCircle, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', trend: '+0.5%', up: true },
                { label: 'Encomendas', val: orders.length, icon: ShoppingCart, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-500/10', trend: '+5%', up: true },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-pink-50 dark:border-white/5 flex flex-col gap-4 group hover:shadow-xl hover:shadow-pink-100/50 dark:hover:shadow-pink-500/10 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon size={28} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>
                      {stat.trend} {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1 text-slate-800 dark:text-white">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts & AI Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-sm border border-pink-50 dark:border-white/5 transition-all">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-slate-900 dark:text-white">Receita Semanal</h3>
                    <p className="text-sm text-slate-400">Progresso de vendas nos últimos 7 dias</p>
                  </div>
                  <select className="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold px-4 py-2 rounded-xl border-none outline-none text-slate-600 dark:text-slate-400">
                    <option>Última Semana</option>
                    <option>Último Mês</option>
                  </select>
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f9a8d4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f9a8d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#f1f1f1'} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#f9a8d4" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-3xl rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <h3 className="font-serif font-bold text-2xl text-white mb-8 flex items-center gap-3">
                    <Zap className="text-gold animate-pulse" size={24} /> AI Aura Insights
                  </h3>
                  <div className="space-y-4 flex-grow">
                    {[
                      { msg: 'A sua coleção "Ouro" está com 40% mais procura esta semana.', type: 'trend', icon: TrendingUp },
                      { msg: '3 clientes abandonaram o carrinho com Brincos Estrela. Enviar cupão?', type: 'action', icon: Bell },
                      { msg: 'Previsão: O stock de Colares vai esgotar em 4 dias.', type: 'alert', icon: AlertTriangle },
                    ].map((insight, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl group/item hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex gap-4 items-start">
                          <div className="p-2 bg-gold/20 rounded-xl text-gold group-hover/item:scale-110 transition-transform">
                            <insight.icon size={16} />
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed font-medium">{insight.msg}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-8 bg-gold text-slate-950 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all">
                    Gerar Relatório IA <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Critical Inventory & Live Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-sm border border-pink-50 dark:border-white/5 transition-all">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="font-serif font-bold text-2xl text-slate-900 dark:text-white">Alerta de Stock Crítico</h3>
                  <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full animate-pulse">Ação Necessária</span>
                </div>
                <div className="space-y-4">
                  {products.filter(p => p.stock <= (siteSettings.stockAlertThreshold || 5)).slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-red-200 transition-all">
                      <div className="flex items-center gap-4">
                        <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.stock} un. restantes</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const additional = prompt('Ajustar stock (ex: +10 ou -5):', '+0');
                          if (additional) {
                            const val = additional.startsWith('+') || additional.startsWith('-') ? parseInt(additional) : parseInt(additional);
                            if (!isNaN(val)) {
                              setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, stock: Math.max(0, prod.stock + val) } : prod));
                              addLog({
                                adminName: currentUser?.name || 'Admin',
                                action: `Ajuste de stock: ${val > 0 ? '+' : ''}${val} unidades em "${p.name}"`,
                                targetType: 'Product',
                                details: `Stock anterior: ${p.stock} | Novo stock: ${Math.max(0, p.stock + val)}`
                              });
                            }
                          }
                        }}
                        className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-200 transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  ))}
                  {products.filter(p => p.stock <= (siteSettings.stockAlertThreshold || 5)).length === 0 && (
                    <div className="text-center py-10 text-slate-400 italic text-sm">Todo o stock está saudável ✨</div>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-sm border border-pink-50 dark:border-white/5 flex flex-col transition-all">
                <div className="flex justify-between items-center mb-10 text-slate-900 dark:text-white">
                  <h3 className="font-serif font-bold text-2xl">Vendas em Direto</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Live Feed</span>
                  </div>
                </div>
                <div className="space-y-6 flex-grow">
                  {[
                    { user: 'Sofia M.', action: 'Acabou de comprar: Brincos Sol', time: 'Agora mesmo', avatar: 'https://i.pravatar.cc/150?u=12' },
                    { user: 'Marco P.', action: 'Subiu para Nível Prata!', time: 'Há 2 min', avatar: 'https://i.pravatar.cc/150?u=15' },
                    { user: 'Anónimo', action: 'Adicionou Colar Lua ao carrinho', time: 'Há 4 min', avatar: undefined },
                  ].map((act, i) => (
                    <div key={i} className="flex gap-4 group animate-reveal" style={{ animationDelay: `${i * 200}ms` }}>
                      <div className="relative">
                        <img src={act.avatar || `https://i.pravatar.cc/150?u=${i}`} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-50 dark:border-slate-700" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm border border-slate-50 dark:border-white/10">
                          {act.action.includes('comprar') ? <DollarSign size={10} className="text-emerald-500" /> : <Star size={10} className="text-gold" />}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{act.user} <span className="font-normal text-slate-500 dark:text-slate-400">— {act.action}</span></p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-center">
              <div className="relative w-96">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Pesquisar por nome ou SKU..."
                  className="w-full bg-white dark:bg-slate-800 border border-pink-100 dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all shadow-sm text-slate-900 dark:text-white"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="bg-slate-900 dark:bg-gold dark:text-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center shadow-lg shadow-slate-200 dark:shadow-gold/10 hover:bg-slate-800 dark:hover:bg-gold/90 transition-all active:scale-95"
              >
                <Plus size={20} className="mr-2" /> Adicionar Produto
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-pink-50 dark:border-white/5 overflow-hidden">
              <table className="w-full text-left font-sans">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-pink-100 dark:border-white/5">
                    <th className="px-10 py-6">Informação do Produto</th>
                    <th className="px-10 py-6">Categoria</th>
                    <th className="px-10 py-6 text-center">Preço</th>
                    <th className="px-10 py-6 text-center">Stock Disponível</th>
                    <th className="px-10 py-6 text-right">Gerir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-pink-50/30 dark:hover:bg-white/5 transition-all group border-b border-pink-50 dark:border-white/5 last:border-0 font-sans">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-pink-50 dark:border-white/10 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                            <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{p.name}</p>
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-tight">SKU-{p.id.padStart(4, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded-lg border border-slate-100 dark:border-white/5">{p.category}</span>
                      </td>
                      <td className="px-10 py-6 text-center font-bold text-slate-800 dark:text-white text-lg">{p.price.toFixed(2)}€</td>
                      <td className="px-10 py-6 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold ${p.stock <= (siteSettings.stockAlertThreshold || 5) ? 'text-red-500' : 'text-slate-700 dark:text-slate-400'}`}>
                              {p.stock} un.
                            </span>
                            {p.stock <= (siteSettings.stockAlertThreshold || 5) && <AlertTriangle size={14} className="text-red-400 animate-pulse" />}
                          </div>
                          <div className={`w-32 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2`}>
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${p.stock <= (siteSettings.stockAlertThreshold || 5) ? 'bg-red-400' : p.stock <= (siteSettings.stockAlertThreshold || 5) * 3 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                              style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }}
                            ></div>
                          </div>
                          <button
                            onClick={() => {
                              const additional = prompt('Ajustar stock (ex: +10 ou -5):', '+0');
                              if (additional) {
                                const val = additional.startsWith('+') || additional.startsWith('-') ? parseInt(additional) : parseInt(additional);
                                if (!isNaN(val)) {
                                  setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, stock: Math.max(0, prod.stock + val) } : prod));
                                  addLog({
                                    adminName: currentUser?.name || 'Admin',
                                    action: `Ajuste manual de stock para "${p.name}": ${val > 0 ? '+' : ''}${val}`,
                                    targetType: 'Product',
                                    details: `ID: ${p.id} | Resultante: ${Math.max(0, p.stock + val)}`
                                  });
                                }
                              }
                            }}
                            className="text-[10px] font-bold text-slate-400 hover:text-gold transition-colors underline"
                          >
                            Ajustar Manualmente
                          </button>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right relative">
                        <div className="flex justify-end relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-pink-100 dark:border-white/10 rounded-xl text-slate-500 dark:text-slate-400 hover:text-pink-500 dark:hover:text-gold hover:border-pink-300 transition-all shadow-sm font-bold text-xs"
                          >
                            Ações <ChevronDown size={14} className={`transition-transform duration-300 ${openMenuId === p.id ? 'rotate-180' : ''}`} />
                          </button>

                          {openMenuId === p.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenMenuId(null)}
                              ></div>
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-pink-100 dark:border-white/10 rounded-2xl shadow-xl z-50 py-2 animate-fade-in overflow-hidden">
                                <button
                                  onClick={() => { handleOpenModal(p); setOpenMenuId(null); }}
                                  className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-white/5 hover:text-pink-500 dark:hover:text-gold flex items-center gap-3 transition-colors"
                                >
                                  <Edit2 size={16} className="text-blue-400" /> Editar Peça
                                </button>
                                <div className="h-[1px] bg-pink-50 dark:bg-white/5 mx-2"></div>
                                <button
                                  onClick={() => { handleDeleteProduct(p.id); setOpenMenuId(null); }}
                                  className="w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                                >
                                  <Trash2 size={16} /> Remover Peça
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="p-20 text-center text-slate-400">
                  <Box size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-serif text-xl italic">Nenhum produto corresponde à sua pesquisa</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-pink-500 font-bold hover:underline"
                  >
                    Limpar pesquisa
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-10 animate-fade-in font-sans">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Monitor de Encomendas</h2>
              <div className="flex gap-2">
                {['Todos', 'Pendente', 'Processando', 'Enviado', 'Entregue'].map(f => (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold border transition-all ${orderFilter === f ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-100 dark:shadow-pink-500/20' : 'bg-white dark:bg-slate-800 border-pink-100 dark:border-white/5 text-slate-400 hover:border-pink-200'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-slate-800 border border-pink-100 dark:border-white/5 p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row items-center justify-between gap-6 group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-900 dark:bg-black rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                        <ShoppingCart size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-bold text-slate-800 dark:text-white">{order.id}</p>
                          {order.isGift && (
                            <span className="bg-pink-100 dark:bg-pink-500/20 text-pink-500 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-pink-200 dark:border-pink-500/30">
                              Presente
                            </span>
                          )}
                          {order.luxuryPackaging && (
                            <span className="bg-gold/10 text-gold text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-gold/20">
                              Embalagem Luxo
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={12} className="text-slate-400" />
                          <p className="text-xs text-slate-400">{new Date(order.date).toLocaleString('pt-PT')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-grow max-w-xs mx-6">
                      {order.giftMessage && (
                        <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 italic border-l-2 border-gold/50">
                          "{order.giftMessage}"
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {order.items.slice(0, 3).map(item => (
                          <img key={item.id} src={item.images[0]} alt="" className="w-12 h-12 rounded-full object-cover border-4 border-white shadow-sm" />
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 rounded-full bg-pink-50 border-4 border-white flex items-center justify-center text-[10px] font-bold text-pink-500 shadow-sm">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="h-10 w-[1px] bg-pink-50 mx-4 hidden md:block"></div>
                      <div className="text-center md:text-left">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Estado</p>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Total</p>
                        <p className="text-2xl font-bold text-slate-900 leading-none">{order.total.toFixed(2)}€</p>
                      </div>
                      <button className="p-4 bg-slate-50 text-slate-400 hover:text-pink-500 hover:bg-pink-50 transition-all rounded-2xl">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-[2.5rem] border border-pink-100 p-20 text-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                    <ShoppingCart size={40} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2">Sem encomendas por processar</h3>
                  <p className="text-slate-400 max-w-sm mx-auto">Assim que os clientes começarem a brilhar, as suas encomendas aparecerão aqui.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-10 animate-fade-in font-sans">
            <div className="flex justify-between items-center">
              <div className="relative w-96">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar utilizadores..."
                  className="w-full bg-white dark:bg-slate-800 border border-pink-100 dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all shadow-sm text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                {['Todos', 'Bronze', 'Prata', 'Ouro'].map(tier => (
                  <button
                    key={tier}
                    className="px-5 py-2 rounded-xl text-[10px] font-bold border border-pink-100 dark:border-white/5 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:border-pink-200 dark:hover:border-gold transition-all"
                  >
                    {tier}
                  </button>
                ))}
              </div>
              <div className="bg-white dark:bg-slate-800 border border-pink-100 dark:border-white/5 px-6 py-4 rounded-2xl shadow-sm">
                <span className="text-sm font-bold text-slate-500">Total: <span className="text-slate-900 dark:text-white ml-1 text-lg">{allUsers.length}</span></span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-pink-50 dark:border-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-pink-100 dark:border-white/5">
                    <th className="px-10 py-6">Utilizador</th>
                    <th className="px-10 py-6">Email / Contacto</th>
                    <th className="px-10 py-6">Aura Club</th>
                    <th className="px-10 py-6 text-center">Pontos</th>
                    <th className="px-10 py-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {allUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-pink-50/30 dark:hover:bg-white/5 transition-all group border-b border-pink-50 dark:border-white/5 last:border-0">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={u.avatar || `https://i.pravatar.cc/150?u=${u.id}`}
                            alt=""
                            className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                          />
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{u.name}</p>
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-tight font-mono">ID-{u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {u.email}
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{u.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${u.level === 'Ouro' ? 'bg-gold/10 text-gold border-gold/20 shadow-lg shadow-gold/5' :
                          u.level === 'Prata' ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-800 dark:border-white/10' :
                            'bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-white/5'
                          }`}>
                          {u.level}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-center font-mono font-bold text-slate-800 dark:text-slate-200 flex flex-col items-center gap-2">
                        <span>{u.points || 0}</span>
                        <button
                          onClick={() => {
                            const additional = prompt('Pontos a adicionar/remover:', '100');
                            if (additional) {
                              const newPoints = (u.points || 0) + parseInt(additional);
                              updateUser(u.id, { points: newPoints });
                              addLog({
                                adminName: currentUser?.name || 'Admin',
                                action: `Ajuste de pontos para o utilizador "${u.name}"`,
                                targetType: 'User',
                                details: `Pontos anteriores: ${u.points} | Novos pontos: ${newPoints}`
                              });
                            }
                          }}
                          className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md hover:bg-gold hover:text-white transition-all text-slate-500 dark:text-slate-400"
                        >
                          Ajustar
                        </button>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-2 text-slate-400">
                          <button className="p-2 hover:bg-pink-50 hover:text-pink-500 rounded-xl transition-all" title="Editar">
                            <Edit2 size={16} />
                          </button>
                          <button className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all" title="Remover">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'restock' && (
          <div className="space-y-10 animate-fade-in font-sans">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Reposição de Stock</h2>
                <p className="text-sm text-slate-400 mt-1">Produtos mais aguardados pelos seus clientes</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white dark:bg-slate-800 border border-pink-100 dark:border-white/5 px-6 py-3 rounded-2xl shadow-sm text-slate-700 dark:text-slate-300">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-2">Pedidos Ativos:</span>
                  <span className="text-xl font-bold text-pink-500">{restockRequests.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-pink-50 dark:border-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-pink-100 dark:border-white/5">
                    <th className="px-10 py-6">Produto</th>
                    <th className="px-10 py-6">Cliente (Email)</th>
                    <th className="px-10 py-6">Data do Pedido</th>
                    <th className="px-10 py-6 text-center">Estado</th>
                    <th className="px-10 py-6 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50 dark:divide-white/5">
                  {restockRequests.length > 0 ? (
                    restockRequests.map((r) => {
                      const product = products.find(p => p.id === r.productId);
                      return (
                        <tr key={r.id} className="hover:bg-pink-50/30 dark:hover:bg-white/5 transition-all group border-b border-pink-50 dark:border-white/5 last:border-0">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <img
                                src={product?.images[0] || 'https://via.placeholder.com/100'}
                                alt=""
                                className="w-12 h-12 rounded-xl object-cover border border-pink-50 dark:border-white/10"
                              />
                              <div>
                                <p className="font-bold text-slate-800 dark:text-slate-200">{product?.name || 'Desconhecido'}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">SKU-{r.productId.padStart(4, '0')}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{r.email}</p>
                          </td>
                          <td className="px-10 py-6 text-sm text-slate-500">
                            {new Date(r.date).toLocaleDateString('pt-PT')}
                          </td>
                          <td className="px-10 py-6 text-center">
                            <StatusBadge status={r.status} />
                          </td>
                          <td className="px-10 py-6 text-right">
                            <button className="text-xs font-bold text-pink-500 hover:underline">
                              Gering
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-10 py-20 text-center text-slate-400">
                        <RefreshCcw size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="font-serif text-lg italic">Nenhum pedido de reposição pendente</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Popular Demand Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-slate-900 p-8 rounded-[2rem] text-white">
                <h3 className="font-serif font-bold text-xl mb-6">Produtos Mais Desejados</h3>
                <div className="space-y-4">
                  {products.filter(p => p.stock === 0).map(p => {
                    const count = restockRequests.filter(r => r.productId === p.id).length;
                    if (count === 0) return null;
                    return (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group">
                        <div className="flex items-center gap-4">
                          <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="font-bold text-sm">{p.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Users size={12} className="text-gold" />
                              <span className="text-[10px] text-slate-400 font-bold uppercase">{count} clientes à espera</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => { setActiveTab('products'); setSearchTerm(p.name); }}
                          className="px-4 py-2 bg-gold text-slate-900 rounded-xl text-[10px] font-bold hover:bg-gold/90 transition-all"
                        >
                          Repor Stock
                        </button>
                      </div>
                    );
                  })}
                  {products.filter(p => p.stock === 0 && restockRequests.some(r => r.productId === p.id)).length === 0 && (
                    <p className="text-slate-500 text-sm italic">Nenhuma procura ativa por produtos esgotados.</p>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-pink-50 dark:border-white/5 text-slate-900 dark:text-white">
                <h3 className="font-serif font-bold text-xl mb-6">IA: Estratégia</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl">
                    <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed font-medium">
                      Sugestão: Priorize a reposição do <strong>"Colar Aura Star"</strong>. 85% dos pedidos são de clientes Ouro.
                    </p>
                  </div>
                  <div className="p-4 bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-500/20 rounded-2xl">
                    <p className="text-xs text-pink-600 dark:text-pink-400 leading-relaxed font-medium">
                      Note: 3 clientes de reposição também têm itens no carrinho. A pressa é alta!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-10 animate-fade-in font-sans">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-sm border border-pink-50 dark:border-white/5">
              <h3 className="font-serif font-bold text-2xl mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-gold">
                  <SettingsIcon size={20} />
                </div>
                Identidade do Site
              </h3>

              <form onSubmit={handleSaveSettings} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nome da Marca</label>
                  <input
                    type="text"
                    value={settingsFormData.name}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all font-serif text-lg text-slate-900 dark:text-white"
                  />
                  <p className="text-xs text-slate-400">Este nome aparecerá na barra de navegação e rodapé.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">URL do Logótipo (Opcional)</label>
                  <div className="flex gap-6 items-start">
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={settingsFormData.logo}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, logo: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-300 dark:text-slate-600 overflow-hidden relative transition-all">
                      {settingsFormData.logo ? (
                        <img src={settingsFormData.logo} alt="Preview" className="w-full h-full object-contain p-2" />
                      ) : (
                        <Camera size={24} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-pink-50 dark:border-white/5 space-y-6">
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest">Barra de Anúncios</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">Mostrar Anúncio</p>
                        <p className="text-xs text-slate-400">Ativa a barra de destaque no topo do site.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSettingsFormData({ ...settingsFormData, showAnnouncement: !settingsFormData.showAnnouncement })}
                        className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${settingsFormData.showAnnouncement ? 'bg-gold shadow-lg shadow-gold/20' : 'bg-slate-200 dark:bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${settingsFormData.showAnnouncement ? 'left-7' : 'left-1'}`}></div>
                      </button>
                    </div>
                    {settingsFormData.showAnnouncement && (
                      <input
                        type="text"
                        value={settingsFormData.announcementText}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, announcementText: e.target.value })}
                        placeholder="Texto do anúncio..."
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white"
                      />
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-pink-50 dark:border-white/5 space-y-6">
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest">Marketing & Inventário</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5">
                      <p className="font-bold text-slate-800 dark:text-slate-200 mb-2">Desconto Global (%)</p>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={settingsFormData.globalDiscount}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, globalDiscount: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-pink-100"
                      />
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5">
                      <p className="font-bold text-slate-800 dark:text-slate-200 mb-2">Limite Stock Crítico</p>
                      <input
                        type="number"
                        min="1"
                        value={settingsFormData.stockAlertThreshold}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, stockAlertThreshold: parseInt(e.target.value) || 5 })}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-pink-100"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 transition-all">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Modo de Saldos / Sale Mode</p>
                      <p className="text-xs text-slate-400">Ativa banners de desconto e preços promocionais em todo o site.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettingsFormData({ ...settingsFormData, saleMode: !settingsFormData.saleMode })}
                      className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${settingsFormData.saleMode ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${settingsFormData.saleMode ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-pink-50 dark:border-white/5 flex justify-end">
                  <button
                    type="submit"
                    className="bg-slate-900 dark:bg-gold dark:text-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-gold/90 transition-all shadow-lg shadow-slate-200 dark:shadow-gold/10 active:scale-95"
                  >
                    Guardar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {activeTab === 'logs' && (
          <div className="max-w-4xl space-y-6 animate-fade-in font-sans">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Registo de Atividades</h3>
                <p className="text-sm text-slate-400">Rastreador em tempo real de todas as ações administrativas.</p>
              </div>
              <button
                onClick={() => addLog({ adminName: currentUser?.name || 'Admin', action: 'Limpeza manual de logs (Simulada)', targetType: 'Settings', details: 'Ação executada para demonstração.' })}
                className="text-xs font-bold text-slate-400 hover:text-pink-500 transition-colors uppercase tracking-widest border-b border-dotted"
              >
                Limpar Histórico
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-pink-50 dark:border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-black/20 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-pink-50 dark:border-white/5">
                      <th className="px-8 py-5">Data / Hora</th>
                      <th className="px-8 py-5">Admin</th>
                      <th className="px-8 py-5">Ação</th>
                      <th className="px-8 py-5">Alvo</th>
                      <th className="px-8 py-5">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-50 dark:divide-white/5">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-pink-50/30 dark:hover:bg-white/5 transition-colors group">
                        <td className="px-8 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              {new Date(log.timestamp).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-[10px] font-bold text-gold">
                              {log.adminName.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{log.adminName}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{log.action}</span>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${log.targetType === 'Product' ? 'bg-blue-50 text-blue-500 dark:bg-blue-400/10' :
                            log.targetType === 'User' ? 'bg-purple-50 text-purple-500 dark:bg-purple-400/10' :
                              log.targetType === 'Settings' ? 'bg-amber-50 text-amber-500 dark:bg-amber-400/10' :
                                'bg-slate-50 text-slate-500 dark:bg-slate-400/10'
                            }`}>
                            {log.targetType}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <p className="text-xs text-slate-400 italic max-w-xs truncate group-hover:whitespace-normal transition-all">
                            {log.details}
                          </p>
                        </td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">
                          <div className="flex flex-col items-center gap-3">
                            <ClipboardList size={32} className="opacity-20" />
                            <p>Nenhuma atividade registada até ao momento.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-10 animate-fade-in font-sans">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Social Commerce Hub</h2>
                <p className="text-sm text-slate-400 mt-1">Gere o seu feed de Instagram e TikTok shoppable</p>
              </div>
              <button
                onClick={() => handleOpenSocialModal()}
                className="bg-slate-900 dark:bg-gold dark:text-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center gap-3"
              >
                <Plus size={20} /> Adicionar Post
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['instagram', 'tiktok', 'ugc'].map((type) => (
                <div key={type} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-pink-50 dark:border-white/5 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'instagram' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-500' :
                        type === 'tiktok' ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white' :
                          'bg-blue-100 dark:bg-blue-900/30 text-blue-500'
                        }`}>
                        {type === 'instagram' ? <Camera size={20} /> : type === 'tiktok' ? <Zap size={20} /> : <Users size={20} />}
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 capitalize">{type}</h3>
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      {socialPosts.filter(p => p.type === type).length} Posts
                    </span>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                    {socialPosts.filter(p => p.type === type).map(post => (
                      <div key={post.id} className="group relative bg-slate-50 dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 p-3 flex gap-4">
                        <img src={post.mediaUrl} alt="" className="w-16 h-16 object-cover rounded-xl" />
                        <div className="flex-grow min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{post.caption || 'Sem legenda'}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{post.productIds.length} produtos marcados</p>
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleOpenSocialModal(post)} className="text-[10px] font-bold text-blue-500 hover:underline">Editar</button>
                            <button onClick={() => deleteSocialPost(post.id)} className="text-[10px] font-bold text-red-500 hover:underline">Remover</button>
                          </div>
                        </div>
                        {post.status === 'pending' && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-pink-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                        )}
                      </div>
                    ))}
                    {socialPosts.filter(p => p.type === type).length === 0 && (
                      <div className="text-center py-10 text-slate-300 italic text-sm">Nenhum post {type}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Popular Products from Social */}
            <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-serif font-bold">Engagement Social</h3>
                  <p className="text-slate-400 text-sm">Produtos que mais geram curiosidade nas redes</p>
                </div>
                <TrendingUp className="text-gold" size={32} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {products.slice(0, 4).map(p => (
                  <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                    <img src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-bold truncate">{p.name}</p>
                      <p className="text-[10px] text-gold font-bold uppercase tracking-widest mt-1">843 Clicks</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gestão de Contas */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-2xl text-slate-900 dark:text-white">Contas Associadas</h3>
                <button
                  onClick={() => {
                    const handle = prompt('Insira o handle da conta (ex: @aurabijoux_pt):');
                    if (handle) {
                      const platform = prompt('Plataforma (instagram/tiktok):') as 'instagram' | 'tiktok';
                      if (platform === 'instagram' || platform === 'tiktok') {
                        addSocialAccount({
                          type: platform,
                          handle: handle.replace('@', ''),
                          status: 'connected',
                          followers: Math.floor(Math.random() * 50000)
                        });
                      }
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-gold text-white dark:text-slate-900 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
                >
                  <Plus size={18} />
                  Conectar Conta
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {socialAccounts.map(acc => (
                  <div key={acc.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-pink-50 dark:border-white/5 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={acc.avatar || `https://i.pravatar.cc/100?u=${acc.handle}`} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                          {acc.type === 'instagram' ? <Camera size={12} className="text-pink-500" /> : <Zap size={12} className="text-gold" />}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 dark:text-white">@{acc.handle}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${acc.type === 'instagram' ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-900'}`}>{acc.type}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{acc.followers?.toLocaleString()} seguidores</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Conectado</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Tem a certeza que deseja remover a conta @${acc.handle}?`)) {
                          deleteSocialAccount(acc.id);
                        }
                      }}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all md:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {socialAccounts.length === 0 && (
                  <div className="col-span-1 md:col-span-2 py-16 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10">
                    <Shield size={32} className="mx-auto text-slate-300 mb-4 opacity-50" />
                    <p className="text-slate-400 font-medium">Nenhuma conta conectada para gestão.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
        }

        {/* User Edit Modal */}
        {
          isUserModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in transition-all">
              <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-pink-100 dark:border-white/10 overflow-hidden animate-fade-in-up">
                <div className="p-10 border-b border-pink-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Editar Utilizador</h3>
                  <button onClick={() => setIsUserModalOpen(false)} className="p-3 hover:bg-pink-50 dark:hover:bg-white/5 text-slate-400 hover:text-pink-500 dark:hover:text-gold rounded-2xl transition-all">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSaveUser} className="p-10 space-y-6 bg-white dark:bg-slate-900">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Nome</label>
                    <input
                      required
                      type="text"
                      value={userFormData.name}
                      onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email</label>
                    <input
                      required
                      type="email"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Cargo</label>
                    <select
                      value={userFormData.role}
                      onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as 'admin' | 'customer' })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white appearance-none"
                    >
                      <option value="customer" className="dark:bg-slate-900">Cliente</option>
                      <option value="admin" className="dark:bg-slate-900">Administrador</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-100 dark:shadow-pink-500/20 hover:bg-pink-600 transition-all mt-4 active:scale-95">
                    Guardar Utilizador
                  </button>
                </form>
              </div>
            </div>
          )
        }

        {/* Product Modal */}
        {
          isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in transition-all">
              <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-pink-100 dark:border-white/10 overflow-hidden animate-fade-in-up">
                <div className="p-10 border-b border-pink-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
                      {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
                    </h3>
                    <p className="text-sm text-slate-400">Insira os detalhes da peça abaixo.</p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-3 hover:bg-pink-50 dark:hover:bg-white/5 text-slate-400 hover:text-pink-500 dark:hover:text-gold rounded-2xl transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="p-10 space-y-6 bg-white dark:bg-slate-900">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Nome da Peça</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Colar Brisa do Mar"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Categoria</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white appearance-none"
                      >
                        {CATEGORIES.map(cat => <option key={cat} value={cat} className="dark:bg-slate-900">{cat}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Cor</label>
                      <select
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value as ProductColor })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white appearance-none"
                      >
                        {COLORS.map(color => <option key={color} value={color} className="dark:bg-slate-900">{color}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Preço (€)</label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Stock Disponível</label>
                      <input
                        required
                        type="number"
                        step="1"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === '' || (/^\d+$/.test(raw))) {
                            setFormData({ ...formData, stock: raw });
                          }
                        }}
                        placeholder="Quantidade em stock"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white"
                      />
                      <p className="text-[10px] text-slate-400 px-1 italic">Apenas números inteiros positivos</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">URLs de Vídeo</label>
                      <input
                        type="text"
                        value={formData.videos}
                        onChange={(e) => setFormData({ ...formData, videos: e.target.value })}
                        placeholder="URL do vídeo (ex: YouTube, Vimeo)"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white"
                      />
                      <p className="text-[10px] text-slate-400 px-1 italic">Separe por vírgulas para múltiplos vídeos</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">URL da Imagem</label>
                    <input
                      required
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Descrição</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white resize-none"
                      placeholder="Descreva a elegância desta peça..."
                    ></textarea>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold py-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-100 dark:shadow-pink-500/20 hover:bg-pink-600 transition-all active:scale-95"
                    >
                      {editingProduct ? 'Guardar Alterações' : 'Adicionar Produto'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )
        }

        {/* Social Post Modal */}
        {
          isSocialModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in transition-all">
              <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-pink-100 dark:border-white/10 overflow-hidden animate-fade-in-up">
                <div className="p-10 border-b border-pink-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
                      {editingSocialPost ? 'Editar Post Social' : 'Adicionar Novo Post'}
                    </h3>
                    <p className="text-sm text-slate-400">Configure a publicação e marque produtos.</p>
                  </div>
                  <button
                    onClick={() => setIsSocialModalOpen(false)}
                    className="p-3 hover:bg-pink-50 dark:hover:bg-white/5 text-slate-400 hover:text-pink-500 dark:hover:text-gold rounded-2xl transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSaveSocialPost} className="p-10 space-y-6 bg-white dark:bg-slate-900 max-h-[70vh] overflow-y-auto scrollbar-thin">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Tipo de Conteúdo</label>
                      <div className="flex gap-2">
                        {['instagram', 'tiktok', 'ugc'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setSocialFormData({ ...socialFormData, type: t as any })}
                            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all border ${socialFormData.type === t
                              ? 'bg-slate-900 dark:bg-gold text-white dark:text-slate-900 border-transparent'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-white/5'
                              }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Estado</label>
                      <select
                        value={socialFormData.status}
                        onChange={(e) => setSocialFormData({ ...socialFormData, status: e.target.value as any })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white"
                      >
                        <option value="approved">Aprovado (Visível)</option>
                        <option value="pending">Pendente (Rascunho)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">URL da Imagem/Capa</label>
                    <input
                      required
                      type="text"
                      value={socialFormData.mediaUrl}
                      onChange={(e) => setSocialFormData({ ...socialFormData, mediaUrl: e.target.value })}
                      placeholder="https://images.instagram.com/..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Link para a Publicação (Opcional)</label>
                    <input
                      type="text"
                      value={socialFormData.postUrl}
                      onChange={(e) => setSocialFormData({ ...socialFormData, postUrl: e.target.value })}
                      placeholder="https://www.instagram.com/p/..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Legenda/Descrição</label>
                    <textarea
                      value={socialFormData.caption}
                      onChange={(e) => setSocialFormData({ ...socialFormData, caption: e.target.value })}
                      rows={2}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 ring-pink-100 dark:ring-white/10 transition-all text-slate-900 dark:text-white resize-none"
                      placeholder="Ex: O brilho perfeito para as suas noites de verão..."
                    ></textarea>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 flex justify-between">
                      Produtos Marcados
                      <span className="text-pink-500">{socialFormData.productIds.length} selecionados</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5">
                      {products.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            const exists = socialFormData.productIds.includes(p.id);
                            setSocialFormData({
                              ...socialFormData,
                              productIds: exists
                                ? socialFormData.productIds.filter(id => id !== p.id)
                                : [...socialFormData.productIds, p.id]
                            });
                          }}
                          className={`flex items-center gap-3 p-2 rounded-xl border transition-all text-left ${socialFormData.productIds.includes(p.id)
                            ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-500/30'
                            : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200'
                            }`}
                        >
                          <img src={p.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 sticky bottom-0 bg-white dark:bg-slate-900 pt-4 pb-2">
                    <button
                      type="button"
                      onClick={() => setIsSocialModalOpen(false)}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] bg-slate-900 dark:bg-gold dark:text-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-slate-800 transition-all active:scale-95"
                    >
                      {editingSocialPost ? 'Guardar Alterações' : 'Criar Publicação'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )
        }
      </main>
    </div >
  );
};

export default Admin;
