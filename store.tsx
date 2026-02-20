
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order, Review, AuditLog, RestockRequest, SocialPost, SocialAccount } from './types';
import { MOCK_PRODUCTS, MOCK_USER } from './constants';

interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  siteSettings: {
    name: string;
    logo: string;
    themeColor: string;
    saleMode?: boolean;
    globalDiscount?: number;
    stockAlertThreshold?: number;
    announcementText?: string;
    showAnnouncement?: boolean;
  };
  updateSiteSettings: (settings: Partial<AppContextType['siteSettings']>) => void;
  addReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  logs: AuditLog[];
  addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  restockRequests: RestockRequest[];
  addRestockRequest: (productId: string, email: string) => void;
  socialPosts: SocialPost[];
  addSocialPost: (post: Omit<SocialPost, 'id' | 'date'>) => void;
  updateSocialPost: (id: string, data: Partial<SocialPost>) => void;
  deleteSocialPost: (id: string) => void;
  socialAccounts: SocialAccount[];
  addSocialAccount: (account: Omit<SocialAccount, 'id'>) => void;
  deleteSocialAccount: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  // Changed to null by default so user must log in
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aura_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [restockRequests, setRestockRequests] = useState<RestockRequest[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    {
      id: 'acc1',
      type: 'instagram',
      handle: 'aurabijoux_pt',
      avatar: 'https://i.pravatar.cc/150?u=aura',
      status: 'connected',
      followers: 12400,
      lastSync: new Date().toISOString()
    }
  ]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([
    {
      id: '1',
      type: 'instagram',
      mediaUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce33e?auto=format&fit=crop&q=80',
      postUrl: 'https://instagram.com',
      productIds: ['1', '2'],
      status: 'approved',
      caption: 'Detalhes que iluminam o olhar. ✨ Nossa nova coleção Brisa do Mar já está disponível.',
      userName: 'aurabijoux_pt',
      date: new Date().toISOString()
    },
    {
      id: '2',
      type: 'tiktok',
      mediaUrl: 'https://images.unsplash.com/photo-1596944210900-34d2b27a3c3b?auto=format&fit=crop&q=80',
      postUrl: 'https://tiktok.com',
      productIds: ['3', '4'],
      status: 'approved',
      caption: 'GRWM with Aura Bijoux! 💖 Descobre como elevar o teu look básico com as nossas peças.',
      userName: 'aurabijoux_pt',
      date: new Date().toISOString()
    },
    {
      id: '3',
      type: 'ugc',
      mediaUrl: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80',
      postUrl: '',
      productIds: ['5'],
      status: 'approved',
      caption: 'Simplesmente apaixonada por estas peças! Obrigada @aurabijoux_pt 🥰',
      userName: 'sofy_style',
      date: new Date().toISOString()
    },
    {
      id: '4',
      type: 'instagram',
      mediaUrl: 'https://images.unsplash.com/photo-1611085583191-a3b13634338e?auto=format&fit=crop&q=80',
      postUrl: 'https://instagram.com',
      productIds: ['6'],
      status: 'approved',
      caption: 'Eternal Gold. Uma seleção clássica para momentos inesquecíveis.',
      userName: 'aurabijoux_pt',
      date: new Date().toISOString()
    }
  ]);

  const [allUsers, setAllUsers] = useState<User[]>([
    { ...MOCK_USER, id: 'u1', name: 'Administrador Aura', email: 'admin@gmai.com', role: 'admin' },
    { ...MOCK_USER, id: 'u2', name: 'Ana Silva', email: 'ana.silva@email.com', role: 'customer' },
    { ...MOCK_USER, id: 'u3', name: 'Maria Santos', email: 'maria.santos@email.com', role: 'customer' },
    { ...MOCK_USER, id: 'u4', name: 'Joana Pereira', email: 'joana.pereira@email.com', role: 'customer' },
    { ...MOCK_USER, id: 'u5', name: 'Beatriz Costa', email: 'beatriz.costa@email.com', role: 'customer' },
  ]);

  const [siteSettings, setSiteSettings] = useState({
    name: 'Aura',
    logo: '',
    themeColor: 'Gold',
    saleMode: false,
    globalDiscount: 0,
    stockAlertThreshold: 5,
    announcementText: '✨ Entrega gratuita em todas as encomendas superiores a 50€! ✨',
    showAnnouncement: true
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('aura_theme');
    if (saved) return saved as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    localStorage.setItem('aura_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('aura_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aura_user');
    }
  }, [user]);

  const addToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + qty, product.stock) }
          : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: qty } : item));
  };

  const clearCart = () => setCart([]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    // Simulated authentication
    return new Promise((resolve) => {
      setTimeout(() => {
        // Special check for Admin login
        if (email === 'admin@gmai.com' && password === 'admin123') {
          setUser({
            ...MOCK_USER,
            email: 'admin@gmai.com',
            role: 'admin',
            name: 'Administrador Aura'
          });
          resolve(true);
        } else if (email.includes('@')) {
          const newUser = {
            ...MOCK_USER,
            id: Math.random().toString(36).substr(2, 9),
            email: email,
            role: 'customer' as const,
            name: email.split('@')[0]
          };
          setUser(newUser);
          // Add to registry if not exists
          setAllUsers(prev => {
            if (prev.find(u => u.email === email)) return prev;
            return [...prev, newUser];
          });
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => setUser(null);

  const calculateLevel = (points: number): 'Bronze' | 'Prata' | 'Ouro' => {
    if (points > 500) return 'Ouro';
    if (points > 200) return 'Prata';
    return 'Bronze';
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    // Deduct stock
    setProducts(prev => prev.map(p => {
      const orderItem = order.items.find(item => item.id === p.id);
      return orderItem ? { ...p, stock: p.stock - orderItem.quantity } : p;
    }));

    // Award points (1€ = 1 point)
    if (user) {
      const pointsEarned = Math.floor(order.total);
      const newPoints = (user.points || 0) + pointsEarned;
      const newLevel = calculateLevel(newPoints);

      const updatedUser = { ...user, points: newPoints, level: newLevel };
      setUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId)
      ? prev.filter(id => id !== productId)
      : [...prev, productId]
    );
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setAllUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (user && user.id === id) {
      setUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const deleteUser = (id: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== id));
  };

  const updateSiteSettings = (settings: Partial<AppContextType['siteSettings']>) => {
    setSiteSettings(prev => ({ ...prev, ...settings }));
  };

  const addReview = (productId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const currentReviews = p.reviews || [];
        const newReviews = [...currentReviews, newReview];
        // Calculate new average rating
        const totalRating = newReviews.reduce((acc, r) => acc + r.rating, 0);
        const newRating = totalRating / newReviews.length;

        return { ...p, reviews: newReviews, rating: parseFloat(newRating.toFixed(1)) };
      }
      return p;
    }));
  };

  const addLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const addRestockRequest = (productId: string, email: string) => {
    const newRequest: RestockRequest = {
      id: Math.random().toString(36).substr(2, 9),
      productId,
      email,
      date: new Date().toISOString(),
      status: 'Pendente'
    };
    setRestockRequests(prev => [newRequest, ...prev]);
  };

  const addSocialPost = (post: Omit<SocialPost, 'id' | 'date'>) => {
    const newPost: SocialPost = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    setSocialPosts(prev => [newPost, ...prev]);
  };

  const updateSocialPost = (id: string, data: Partial<SocialPost>) => {
    setSocialPosts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteSocialPost = (id: string) => {
    setSocialPosts(prev => prev.filter(p => p.id !== id));
  };

  const addSocialAccount = (account: Omit<SocialAccount, 'id'>) => {
    const newAccount: SocialAccount = {
      ...account,
      id: Math.random().toString(36).substr(2, 9),
      lastSync: new Date().toISOString()
    };
    setSocialAccounts(prev => [...prev, newAccount]);
  };

  const deleteSocialAccount = (id: string) => {
    setSocialAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  return (
    <AppContext.Provider value={{
      products, setProducts, cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      user, login, logout, orders, addOrder, wishlist, toggleWishlist,
      allUsers, setAllUsers, updateUser, deleteUser,
      siteSettings, updateSiteSettings, addReview,
      theme, toggleTheme, quickViewProduct, setQuickViewProduct,
      logs, addLog, restockRequests, addRestockRequest,
      socialPosts, addSocialPost, updateSocialPost, deleteSocialPost,
      socialAccounts, addSocialAccount, deleteSocialAccount
    }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
