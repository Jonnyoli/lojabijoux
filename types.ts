
export type Category = 'Colares' | 'Brincos' | 'Pulseiras' | 'Anéis' | 'Conjuntos';
export type ProductColor = 'Gold' | 'Silver' | 'Rose Gold' | 'Multi-color';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  color: ProductColor;
  images: string[];
  videos?: string[];
  stock: number;
  rating: number;
  reviews?: Review[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  targetType: 'Product' | 'User' | 'Settings' | 'Order';
  details: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  addresses: Address[];
  points: number;
  level: 'Bronze' | 'Prata' | 'Ouro';
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
  date: string;
  address: Address;
  isGift?: boolean;
  giftMessage?: string;
  luxuryPackaging?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface RestockRequest {
  id: string;
  productId: string;
  email: string;
  date: string;
  status: 'Pendente' | 'Notificado';
}

export interface SocialPost {
  id: string;
  type: 'instagram' | 'tiktok' | 'ugc';
  mediaUrl: string;
  postUrl: string;
  productIds: string[];
  status: 'pending' | 'approved';
  caption: string;
  userName?: string;
  date: string;
}

export interface SocialAccount {
  id: string;
  type: 'instagram' | 'tiktok';
  handle: string;
  avatar?: string;
  status: 'connected' | 'disconnected';
  followers?: number;
  lastSync?: string;
}
