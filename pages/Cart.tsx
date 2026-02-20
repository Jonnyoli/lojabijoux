
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag, Plus, Minus, CreditCard } from 'lucide-react';
import { useApp } from '../store';

const Cart: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart } = useApp();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.90;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center space-y-10 animate-fade-in">
          <div className="relative inline-block">
            {/* Decorative background blur */}
            <div className="absolute inset-0 bg-pink-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>

            <div className="relative bg-white p-12 rounded-full shadow-2xl shadow-pink-100/50 border border-pink-50 inline-flex items-center justify-center">
              <ShoppingBag size={80} className="text-pink-200 stroke-[1.2]" />
              <div className="absolute top-8 right-8 bg-gold text-white text-[10px] font-bold h-6 w-6 flex items-center justify-center rounded-full shadow-lg border-2 border-white">
                0
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
              O seu carrinho <br />
              <span className="text-pink-500 italic">ainda está vazio</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
              Parece que ainda não encontrou a sua peça perfeita. Explore a nossa curadoria de joalharia e deixe-se encantar pela elegância.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/catalog"
              className="group relative inline-flex items-center justify-center px-12 py-5 font-bold text-white transition-all duration-300 bg-pink-500 rounded-2xl hover:bg-pink-600 shadow-2xl shadow-pink-200 hover:-translate-y-1 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center gap-3 text-lg">
                Explorar Loja <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" size={22} />
              </span>
            </Link>
          </div>

          <div className="pt-12">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-300 font-bold mb-6">Inspiração para si</p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto opacity-60 hover:opacity-100 transition-opacity duration-500">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <img src="https://picsum.photos/seed/aura1/300/300" alt="Inspiration" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <img src="https://picsum.photos/seed/aura2/300/300" alt="Inspiration" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <img src="https://picsum.photos/seed/aura3/300/300" alt="Inspiration" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-10 flex items-center gap-3">
        Carrinho de Compras <span className="text-sm font-normal text-gray-400">({cart.length} itens)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="hidden sm:grid grid-cols-4 pb-4 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <div className="col-span-2">Produto</div>
            <div className="text-center">Quantidade</div>
            <div className="text-right">Total</div>
          </div>

          {cart.map((item) => (
            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-6 pb-6 border-b border-gray-50 dark:border-gray-800 group transition-colors">
              {/* Product Info */}
              <div className="col-span-1 sm:col-span-2 flex items-center gap-4">
                <Link to={`/product/${item.id}`} className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div>
                  <h3 className="font-serif font-bold text-lg text-gray-800 dark:text-gray-100 hover:text-pink-500 transition-colors">
                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                  </h3>
                  <p className="text-xs text-gray-400 mb-2">{item.category}</p>
                  <p className="text-sm font-bold text-gold">{item.price.toFixed(2)}€</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} className="mr-1" /> Remover
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex justify-center">
                <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                  <button
                    onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="p-2 hover:bg-white dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-sm font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                    className="p-2 hover:bg-white dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-right font-bold text-gray-900 dark:text-white">
                {(item.price * item.quantity).toFixed(2)}€
              </div>
            </div>
          ))}

          <Link to="/catalog" className="inline-flex items-center text-gray-400 hover:text-pink-500 transition-colors font-medium text-sm pt-4">
            <ArrowLeft size={16} className="mr-2" /> Continuar a comprar
          </Link>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 sticky top-32 border border-transparent dark:border-gray-700 transition-colors">
            <h3 className="font-serif font-bold text-2xl mb-6 text-gray-900 dark:text-white">Resumo</h3>

            <div className="space-y-4 mb-6">
              {/* Free Shipping Progress Bar */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-pink-50 dark:border-pink-900/20 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Progresso para Envio Grátis</span>
                  <span className="text-xs font-bold text-pink-500">{subtotal >= 50 ? '100%' : `${Math.round((subtotal / 50) * 100)}%`}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-gradient-to-r from-pink-400 to-pink-600 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-center">
                  {subtotal >= 50 ? (
                    <span className="text-emerald-500 font-bold flex items-center justify-center gap-1">
                      Envio Grátis Desbloqueado! 🎉
                    </span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">
                      Faltam <span className="text-pink-500 font-bold">{(50 - subtotal).toFixed(2)}€</span> para ter envio grátis! 🚚
                    </span>
                  )}
                </p>
              </div>

              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Envio</span>
                <span>{shipping === 0 ? <span className="text-emerald-500 font-bold">Grátis</span> : `${shipping.toFixed(2)}€`}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-8 flex justify-between items-end">
              <span className="text-gray-900 dark:text-white font-bold text-lg uppercase tracking-wider">Total</span>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{total.toFixed(2)}€</span>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-pink-500 text-white py-4 rounded-xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-100 flex items-center justify-center gap-2"
              >
                Finalizar Encomenda <CreditCard size={18} />
              </button>
              <p className="text-[11px] text-center text-gray-400">IVA incluído à taxa legal em vigor.</p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-widest">Cupão de Desconto?</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código"
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none flex-grow text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500"
                />
                <button className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors">Aplicar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
