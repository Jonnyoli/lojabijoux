
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Heart, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useApp } from '../store';
import Chatbot from './Chatbot';
import QuickViewModal from './QuickViewModal';
import ExitIntentPopup from './ExitIntentPopup';

const Navbar: React.FC = () => {
  // Layout Component - Verified for Vercel Case Sensitivity
  const { cart, user, logout, wishlist, siteSettings, theme, toggleTheme } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-pink-100 dark:border-pink-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Mobile Menu Toggle */}
          <button
            className="sm:hidden p-2 text-gray-500 dark:text-gray-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 text-2xl sm:text-3xl font-serif font-bold text-pink-500 tracking-tight">
              {siteSettings.logo ? (
                <img src={siteSettings.logo} alt={siteSettings.name} className="h-10 w-auto object-contain" />
              ) : (
                <>
                  {siteSettings.name.split(' ')[0]} <span className="text-gold">{siteSettings.name.split(' ').slice(1).join(' ')}</span>
                </>
              )}
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex space-x-8">
            <Link to="/catalog" className="text-gray-700 dark:text-gray-200 hover:text-pink-500 transition-colors font-medium">Loja</Link>
            <Link to="/catalog?cat=Colares" className="text-gray-700 dark:text-gray-200 hover:text-pink-500 transition-colors">Colares</Link>
            <Link to="/catalog?cat=Brincos" className="text-gray-700 dark:text-gray-200 hover:text-pink-500 transition-colors">Brincos</Link>
            <Link to="/catalog?cat=Anéis" className="text-gray-700 dark:text-gray-200 hover:text-pink-500 transition-colors">Anéis</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 sm:space-x-5">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-gray-700 dark:text-gray-200 hover:text-pink-500 transition-colors">
              <Search size={20} />
            </button>
            <button onClick={toggleTheme} className="p-2 text-gray-700 dark:text-gray-200 hover:text-pink-500 transition-colors">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/profile" className="hidden sm:block p-2 text-gray-700 dark:text-gray-200 hover:text-pink-500 transition-colors">
              <Heart size={20} className={wishlist.length > 0 ? "fill-pink-500 text-pink-500" : ""} />
            </Link>

            <div className="relative group">
              <Link to={user ? "/profile" : "/login"} className="p-2 text-gray-700 dark:text-gray-200 hover:text-pink-500 transition-colors flex items-center">
                <User size={20} />
              </Link>
              {user && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 dark:border-gray-700 py-2">
                  <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-700 mb-2">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-700">Minha Conta</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-gray-700 flex items-center">
                      <Settings size={14} className="mr-2" /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center">
                    <LogOut size={14} className="mr-2" /> Sair
                  </button>
                </div>
              )}
            </div>

            <Link to="/cart" className="p-2 text-gray-700 dark:text-gray-200 hover:text-pink-500 transition-colors relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-xl py-4 px-4 space-y-4">
          <Link to="/catalog" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-800 dark:text-white">Todos os Produtos</Link>
          <Link to="/catalog?cat=Colares" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 dark:text-gray-300">Colares</Link>
          <Link to="/catalog?cat=Brincos" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 dark:text-gray-300">Brincos</Link>
          <Link to="/catalog?cat=Anéis" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 dark:text-gray-300">Anéis</Link>
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center text-gray-600 dark:text-gray-300">
              <Heart size={18} className="mr-2" /> Wishlist ({wishlist.length})
            </Link>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-4 shadow-lg animate-fade-in-down">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex items-center bg-gray-50 dark:bg-gray-700/50 rounded-full px-4 py-2 border border-gray-200 dark:border-gray-600">
            <Search size={20} className="text-gray-400 mr-2" />
            <input
              autoFocus
              type="text"
              placeholder="Pesquisar por colar, brincos..."
              className="bg-transparent w-full outline-none text-gray-800 dark:text-white py-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button" onClick={() => setIsSearchOpen(false)}><X size={20} className="text-gray-400" /></button>
          </form>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => {
  const { siteSettings } = useApp();
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-pink-100 dark:border-pink-900/30 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-serif font-bold text-pink-500 mb-6 block">
              {siteSettings.logo ? (
                <img src={siteSettings.logo} alt={siteSettings.name} className="h-12 w-auto object-contain" />
              ) : (
                <>
                  {siteSettings.name.split(' ')[0]} <span className="text-gold">{siteSettings.name.split(' ').slice(1).join(' ')}</span>
                </>
              )}
            </Link>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
              Joalharia artesanal feita com amor para realçar a beleza natural de cada mulher. Peças únicas, modernas e sofisticadas.
            </p>
            <div className="flex space-x-4">
              <span className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-400 cursor-pointer hover:bg-pink-100">IG</span>
              <span className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-400 cursor-pointer hover:bg-pink-100">FB</span>
              <span className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-400 cursor-pointer hover:bg-pink-100">PN</span>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Coleções</h4>
            <ul className="space-y-4 text-gray-600 dark:text-gray-400">
              <li><Link to="/catalog" className="hover:text-pink-500 transition-colors">Lançamentos</Link></li>
              <li><Link to="/catalog?cat=Colares" className="hover:text-pink-500 transition-colors">Colares</Link></li>
              <li><Link to="/catalog?cat=Brincos" className="hover:text-pink-500 transition-colors">Brincos</Link></li>
              <li><Link to="/catalog?cat=Anéis" className="hover:text-pink-500 transition-colors">Anéis</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Apoio ao Cliente</h4>
            <ul className="space-y-4 text-gray-600 dark:text-gray-400">
              <li><Link to="/faq" className="hover:text-pink-500 transition-colors">Perguntas Frequentes</Link></li>
              <li><Link to="/shipping" className="hover:text-pink-500 transition-colors">Envios e Devoluções</Link></li>
              <li><Link to="/contact" className="hover:text-pink-500 transition-colors">Contactos</Link></li>
              <li><Link to="/care" className="hover:text-pink-500 transition-colors">Cuidados com as Peças</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Newsletter</h4>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Receba 10% de desconto na primeira compra.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Obrigado por subscrever! Verifique o seu email.');
              (e.target as HTMLFormElement).reset();
            }} className="flex flex-col space-y-2">
              <input
                required
                type="email"
                placeholder="O seu e-mail"
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-pink-300 dark:text-white transition-colors"
              />
              <button type="submit" className="bg-pink-500 text-white rounded-lg px-4 py-2 font-bold hover:bg-pink-600 transition-colors">Subscrever</button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2024 {siteSettings.name}. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-gray-600 cursor-pointer">Política de Privacidade</span>
            <span className="hover:text-gray-600 cursor-pointer">Termos de Uso</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { siteSettings, theme } = useApp();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-white'} text-gray-900 dark:text-white transition-colors duration-300`}>
      <header className="fixed top-0 left-0 right-0 z-50">
        {siteSettings.showAnnouncement && siteSettings.announcementText && (
          <div className="bg-slate-900 dark:bg-black text-gold py-2.5 px-4 text-center text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase relative z-[60] border-b border-gold/10 shimmer">
            <p className="flex items-center justify-center gap-2">
              <span className="opacity-50">✦</span>
              {siteSettings.announcementText}
              <span className="opacity-50">✦</span>
            </p>
          </div>
        )}
        <Navbar />
      </header>
      <main className={`flex-grow ${siteSettings.showAnnouncement ? 'pt-24 sm:pt-28' : 'pt-16 sm:pt-20'}`}>
        {children}
      </main>
      <Footer />
      <Chatbot />
      <QuickViewModal />
      <ExitIntentPopup />
    </div>
  );
};

export default Layout;
