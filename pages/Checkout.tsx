
import React, { useState } from 'react';
// Added Link to the imports from react-router-dom
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, CreditCard, Truck, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '../store';

const Checkout: React.FC = () => {
  const { cart, user, addOrder, clearCart } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [giftOptions, setGiftOptions] = useState({
    isGift: false,
    luxuryPackaging: false,
    giftMessage: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 50 ? 0 : 5.90;
  const giftFee = giftOptions.luxuryPackaging ? 2.00 : 0;
  const total = subtotal + shippingFee + giftFee;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    zipCode: user?.addresses?.[0]?.zipCode || '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateShipping = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.address) newErrors.address = 'Morada é obrigatória';
    if (!formData.city) newErrors.city = 'Cidade é obrigatória';
    if (!/^\d{4}-\d{3}$|^\d{4}$/.test(formData.zipCode)) newErrors.zipCode = 'Código Postal inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Cartão inválido (16 dígitos)';
    if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) newErrors.expiry = 'Validade inválida (MM/AA)';
    if (!/^\d{3}$/.test(formData.cvv)) newErrors.cvv = 'CVV inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validatePayment()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder = {
        id: `ORD-${Math.floor(Math.random() * 100000)}`,
        userId: user?.id || 'anonymous',
        items: [...cart],
        total,
        status: 'Processando' as const,
        date: new Date().toISOString(),
        address: {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name,
          street: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: 'Portugal',
          isDefault: false
        },
        isGift: giftOptions.isGift,
        giftMessage: giftOptions.giftMessage,
        luxuryPackaging: giftOptions.luxuryPackaging
      };
      addOrder(newOrder);
      setIsProcessing(false);
      setStep(3);
      clearCart();
    }, 2000);
  };

  if (cart.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Steps UI */}
      <div className="flex items-center justify-center mb-12">
        {[
          { id: 1, label: 'Envio' },
          { id: 2, label: 'Pagamento' },
          { id: 3, label: 'Confirmação' }
        ].map((s, i, arr) => (
          <React.Fragment key={s.id}>
            <div className={`flex items-center ${step >= s.id ? 'text-pink-500' : 'text-gray-300'}`}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-300 ${step >= s.id ? 'border-pink-500 bg-pink-50 scale-110' : 'border-gray-200'}`}>
                {step > s.id ? <CheckCircle2 size={20} /> : s.id}
              </div>
              <span className="hidden sm:block ml-2 text-sm font-bold">{s.label}</span>
            </div>
            {i < arr.length - 1 && (
              <div className={`w-12 md:w-24 h-0.5 mx-4 transition-colors duration-500 ${step > s.id ? 'bg-pink-500' : 'bg-gray-200'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-8">
          {step === 1 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in">
              <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2">
                <MapPin className="text-gold" /> Morada de Envio
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); if (validateShipping()) setStep(2); }}>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className={`w-full bg-gray-50 border ${errors.name ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200'} rounded-xl px-4 py-3 outline-none focus:border-pink-300 transition-all`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Morada</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className={`w-full bg-gray-50 border ${errors.address ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200'} rounded-xl px-4 py-3 outline-none focus:border-pink-300 transition-all`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1 font-bold">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Cidade</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    className={`w-full bg-gray-50 border ${errors.city ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200'} rounded-xl px-4 py-3 outline-none focus:border-pink-300 transition-all`}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1 font-bold">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Código Postal</label>
                  <input
                    type="text"
                    placeholder="0000-000"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    required
                    className={`w-full bg-gray-50 border ${errors.zipCode ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200'} rounded-xl px-4 py-3 outline-none focus:border-pink-300 transition-all`}
                  />
                  {errors.zipCode && <p className="text-red-500 text-xs mt-1 font-bold">{errors.zipCode}</p>}
                </div>
                <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${giftOptions.isGift ? 'bg-pink-100 text-pink-500' : 'bg-gray-200 text-gray-400'}`}>
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">Esta encomenda é para presente?</p>
                        <p className="text-[10px] text-gray-500">Adicione uma nota personalizada ou embalagem de luxo.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGiftOptions({ ...giftOptions, isGift: !giftOptions.isGift })}
                      className={`w-12 h-6 rounded-full relative transition-colors ${giftOptions.isGift ? 'bg-pink-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${giftOptions.isGift ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>

                  {giftOptions.isGift && (
                    <div className="space-y-4 animate-fade-in pl-4 border-l-2 border-pink-100 ml-4">
                      <div className="flex items-center gap-4 p-4 bg-white border border-pink-50 rounded-2xl shadow-sm">
                        <input
                          type="checkbox"
                          id="luxuryPack"
                          checked={giftOptions.luxuryPackaging}
                          onChange={(e) => setGiftOptions({ ...giftOptions, luxuryPackaging: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer"
                        />
                        <label htmlFor="luxuryPack" className="flex-grow cursor-pointer">
                          <p className="font-bold text-gray-800 text-sm">Embalagem de Luxo Aura (+2.00€)</p>
                          <p className="text-[10px] text-gray-400 italic">Caixa rígida premium, papel de seda e selo de cera.</p>
                        </label>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Mensagem Personalizada</label>
                        <textarea
                          placeholder="Escreva aqui a sua dedicatória..."
                          rows={3}
                          value={giftOptions.giftMessage}
                          onChange={(e) => setGiftOptions({ ...giftOptions, giftMessage: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-300 transition-all resize-none"
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 pt-6">
                  <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center shadow-lg shadow-gray-200 active:scale-95">
                    Continuar para Pagamento <ChevronRight size={18} className="ml-2" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in">
              <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2">
                <CreditCard className="text-gold" /> Pagamento Seguro
              </h2>

              <div className="space-y-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Número do Cartão</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                        className={`w-full bg-gray-50 border ${errors.cardNumber ? 'border-red-300' : 'border-gray-200'} rounded-xl px-4 py-3 pl-12 outline-none focus:border-pink-300 transition-all font-mono`}
                      />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                    </div>
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1 font-bold">{errors.cardNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Validade</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5}
                      value={formData.expiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                        setFormData({ ...formData, expiry: val });
                      }}
                      className={`w-full bg-gray-50 border ${errors.expiry ? 'border-red-300' : 'border-gray-200'} rounded-xl px-4 py-3 outline-none focus:border-pink-300 transition-all`}
                    />
                    {errors.expiry && <p className="text-red-500 text-xs mt-1 font-bold">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={3}
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                      className={`w-full bg-gray-50 border ${errors.cvv ? 'border-red-300' : 'border-gray-200'} rounded-xl px-4 py-3 outline-none focus:border-pink-300 transition-all`}
                    />
                    {errors.cvv && <p className="text-red-500 text-xs mt-1 font-bold">{errors.cvv}</p>}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start border border-blue-100">
                  <ShieldCheck className="text-blue-500 flex-shrink-0" size={20} />
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    A sua transação é encriptada e segura. Não guardamos os dados do seu cartão nos nossos servidores.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95">
                  Voltar
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-[2] bg-pink-500 text-white py-4 rounded-xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-100 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processando...</span>
                    </div>
                  ) : (
                    <>Pagar {total.toFixed(2)}€</>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-20 animate-fade-in bg-white rounded-[3rem] shadow-sm border border-pink-50">
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500 animate-bounce-slow">
                <CheckCircle2 size={64} />
              </div>
              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Encomenda Confirmada!</h1>
              <p className="text-gray-500 mb-4 max-w-sm mx-auto">Obrigado pela sua preferência. Receberá em breve um e-mail com os detalhes da sua encomenda e o número de seguimento.</p>

              <div className="bg-gold/10 border border-gold/20 rounded-2xl p-4 max-w-xs mx-auto mb-10 animate-fade-in-up">
                <p className="text-gold font-serif font-bold text-lg leading-tight">Ganhou {Math.floor(total)} pontos!</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Aura Club Bonus</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/profile" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                  Ver Encomenda
                </Link>
                <Link to="/catalog" className="bg-pink-50 text-pink-500 border border-pink-200 px-8 py-4 rounded-xl font-bold hover:bg-pink-100 transition-all">
                  Continuar a Comprar
                </Link>
              </div>
            </div>
          )}
        </div>


        {/* Order Summary Sidebar */}
        {step < 3 && (
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-white shadow-inner sticky top-24">
              <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2">
                Resumo <span className="text-sm font-sans text-gray-400 font-normal">({cart.length} itens)</span>
              </h3>
              <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover bg-white border border-gray-100" />
                    <div>
                      <p className="font-bold text-sm text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500 mb-1">{item.color}</p>
                      <p className="text-xs font-bold text-pink-500">{item.quantity}x {item.price.toFixed(2)}€</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-gray-900">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Envio</span>
                  <span className="font-bold text-gray-900">{subtotal > 50 ? 'Grátis' : '5.90€'}</span>
                </div>
                {giftOptions.luxuryPackaging && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Embalagem Luxo</span>
                    <span className="font-bold text-pink-500">+2.00€</span>
                  </div>
                )}
                {subtotal > 50 && (
                  <div className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg text-center">
                    Oferta de portes aplicada!
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-gray-900 font-bold text-lg">Total</span>
                  <span className="text-3xl font-serif font-bold text-pink-500">{total.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
