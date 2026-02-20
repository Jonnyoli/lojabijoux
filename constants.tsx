
import { Product, User, Category, ProductColor } from './types';

export const CATEGORIES: Category[] = ['Colares', 'Brincos', 'Pulseiras', 'Anéis', 'Conjuntos'];
export const COLORS: ProductColor[] = ['Gold', 'Silver', 'Rose Gold', 'Multi-color'];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Colar Pérola Aura',
    price: 45.00,
    description: 'Um colar clássico com pérolas cultivadas em água doce e fecho banhado a ouro 18k.',
    category: 'Colares',
    color: 'Gold',
    images: ['https://picsum.photos/seed/p1/600/800', 'https://picsum.photos/seed/p1-2/600/800'],
    stock: 12,
    rating: 4.8,
    isBestSeller: true
  },
  {
    id: '2',
    name: 'Brincos Estrela Dourada',
    price: 29.90,
    description: 'Brincos delicados em formato de estrela, perfeitos para o dia a dia.',
    category: 'Brincos',
    color: 'Gold',
    images: ['https://picsum.photos/seed/p2/600/800'],
    stock: 25,
    rating: 4.5,
    isNew: true
  },
  {
    id: '3',
    name: 'Pulseira Cristal Rosa',
    price: 35.00,
    description: 'Pulseira com cristais de quartzo rosa naturais e corrente ajustável.',
    category: 'Pulseiras',
    color: 'Rose Gold',
    images: ['https://picsum.photos/seed/p3/600/800'],
    stock: 8,
    rating: 5.0,
    isBestSeller: true
  },
  {
    id: '4',
    name: 'Anel Vintage Flor',
    price: 32.00,
    description: 'Anel ajustável com design floral vintage e banho de ouro envelhecido.',
    category: 'Anéis',
    color: 'Silver',
    images: ['https://picsum.photos/seed/p4/600/800'],
    stock: 5,
    rating: 4.2
  },
  {
    id: '5',
    name: 'Conjunto Noiva Elegance',
    price: 120.00,
    description: 'Conjunto completo de colar e brincos em zircónia premium para ocasiões especiais.',
    category: 'Conjuntos',
    color: 'Silver',
    images: ['https://picsum.photos/seed/p5/600/800'],
    stock: 3,
    rating: 4.9,
    isNew: true
  }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Ana Silva',
  email: 'ana.silva@email.com',
  role: 'admin',
  avatar: 'https://i.pravatar.cc/150?u=ana',
  addresses: [
    {
      id: 'a1',
      name: 'Casa',
      street: 'Rua das Flores, 123',
      city: 'Lisboa',
      zipCode: '1000-001',
      country: 'Portugal',
      isDefault: true
    }
  ],
  points: 150,
  level: 'Prata'
};
