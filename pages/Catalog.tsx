
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../store';
import { CATEGORIES, COLORS } from '../constants';
import ProductCard from '../components/ProductCard';

const Catalog: React.FC = () => {
  const { products } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'Todos';
  const searchQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedColor, setSelectedColor] = useState('Todos');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState(200);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setSelectedCategory(cat);
    else if (!searchParams.get('q')) setSelectedCategory('Todos');

    const color = searchParams.get('color');
    if (color) setSelectedColor(color);
    else setSelectedColor('Todos');
  }, [searchParams]);

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesColor = selectedColor === 'Todos' || p.color === selectedColor;
    const matchesPrice = p.price <= priceRange;
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesColor && matchesPrice && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // Default newest (not indexed here)
  });

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const params = new URLSearchParams(searchParams);
    if (cat === 'Todos') params.delete('cat');
    else params.set('cat', cat);
    setSearchParams(params);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const params = new URLSearchParams(searchParams);
    if (color === 'Todos') params.delete('color');
    else params.set('color', color);
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar Filters - Desktop */}
        <aside className="hidden md:block w-64 space-y-8 flex-shrink-0">
          <div>
            <h3 className="font-serif font-bold text-xl mb-4 border-b pb-2">Categorias</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange('Todos')}
                className={`block w-full text-left py-1 hover:text-pink-500 transition-colors ${selectedCategory === 'Todos' ? 'text-pink-500 font-bold' : 'text-gray-600 dark:text-gray-300'}`}
              >
                Todos os Produtos
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`block w-full text-left py-1 hover:text-pink-500 transition-colors ${selectedCategory === cat ? 'text-pink-500 font-bold' : 'text-gray-600 dark:text-gray-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-xl mb-4 border-b pb-2">Cores</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleColorChange('Todos')}
                className={`block w-full text-left py-1 hover:text-pink-500 transition-colors ${selectedColor === 'Todos' ? 'text-pink-500 font-bold' : 'text-gray-600 dark:text-gray-300'}`}
              >
                Todas as Cores
              </button>
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`block w-full text-left py-1 hover:text-pink-500 transition-colors ${selectedColor === color ? 'text-pink-500 font-bold' : 'text-gray-600 dark:text-gray-300'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-xl mb-4 border-b pb-2">Preço Máximo: {priceRange}€</h3>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </div>

          <div className="bg-pink-50 dark:bg-gray-800 p-6 rounded-2xl text-center">
            <h4 className="font-serif font-bold text-pink-500 mb-2">Cupão Primeira Compra</h4>
            <p className="text-xs text-gray-500 mb-4">Use o código BEMVINDA10 para 10% OFF</p>
            <div className="text-pink-500 font-mono font-bold border-2 border-dashed border-pink-200 p-2 rounded">BEMVINDA10</div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow">
          {/* Header & Mobile Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
              {searchQuery ? (
                <>Resultados para "<span className="text-pink-500 italic">{searchQuery}</span>"</>
              ) : (
                selectedCategory === 'Todos' ? 'Toda a Coleção' : selectedCategory
              )}
              <span className="text-sm font-normal text-gray-400 ml-3">({filteredProducts.length} itens)</span>
            </h1>

            <div className="flex items-center space-x-4 w-full sm:w-auto">
              {/* Mobile Filter Trigger (Just UI for now) */}
              <button className="md:hidden flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm dark:text-gray-200">
                <Filter size={16} className="mr-2" /> Filtrar
              </button>

              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm outline-none appearance-none pr-8 cursor-pointer dark:text-gray-200"
                >
                  <option value="newest">Mais Recentes</option>
                  <option value="price-asc">Preço: Baixo a Alto</option>
                  <option value="price-desc">Preço: Alto a Baixo</option>
                  <option value="rating">Melhor Avaliados</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-3xl">
              <SlidersHorizontal size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-serif font-bold mb-2 dark:text-white">Sem resultados</h3>
              <p className="text-gray-500 dark:text-gray-400">Tente ajustar os filtros ou a categoria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('Todos');
                  setSelectedColor('Todos');
                  setPriceRange(200);
                  setSearchParams({});
                }}
                className="mt-6 text-pink-500 font-bold underline"
              >
                Limpar todos os filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
