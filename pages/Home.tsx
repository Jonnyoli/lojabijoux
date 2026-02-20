
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, RefreshCcw, Sparkles } from 'lucide-react';
import { useApp } from '../store';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';
import SocialFeed from '../components/SocialFeed';

const Home: React.FC = () => {
  const { products, theme } = useApp();
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic Hero Image based on Theme
  const heroImage = theme === 'dark'
    ? "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&q=80&w=1920" // Darker, elegant jewelry image
    : "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1920"; // Original light image

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden transition-colors duration-300">
      {/* Enhanced Hero Section with Parallax */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-pink-50/30 dark:bg-gray-900 transition-colors duration-300">
        <div className="absolute inset-0 z-0">
          <img
            key={theme} // Force re-render on theme change for animation
            src={heroImage}
            alt="Joalharia Aura"
            className="w-full h-full object-cover animate-fade-in transition-opacity duration-700"
            style={{ transform: `translateY(${scrollY * 0.5}px) scale(1.1)` }} // Parallax Effect
          />
          {/* Subtle Pink and White Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent dark:from-gray-900/95 dark:via-gray-900/60 dark:to-transparent transition-colors duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-pink-100/20 to-transparent dark:from-gray-900/40"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
          <div className="max-w-2xl space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100/80 dark:bg-pink-900/40 backdrop-blur-sm text-pink-600 dark:text-pink-300 font-bold text-xs uppercase tracking-[0.2em] rounded-full shadow-sm animate-bounce-slow">
              <Sparkles size={14} />
              Nova Coleção Aura 2024
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl font-serif font-bold text-gray-900 dark:text-white leading-[1.1]">
                Onde o <span className="text-gold italic font-normal">Brilho</span><br />
                Encontra a <span className="relative text-gray-900 dark:text-white">Alma
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                    <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="#f9a8d4" strokeWidth="4" />
                  </svg>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg font-light">
                Descubra peças artesanais banhadas a ouro e pedras naturais, desenhadas para realçar a sua beleza única em todos os momentos.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/catalog"
                className="group relative overflow-hidden bg-pink-500 text-white px-10 py-5 rounded-full font-bold transition-all shadow-xl shadow-pink-200/50 hover:bg-pink-600 active:scale-95 flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center">
                  Descobrir Coleção <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
              </Link>
              <Link
                to="/catalog?cat=Conjuntos"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-2 border-gold/30 text-gold px-10 py-5 rounded-full font-bold hover:bg-gold hover:text-white transition-all hover:border-gold text-center active:scale-95"
              >
                Ver Conjuntos
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 bottom-0 p-10 hidden lg:block opacity-50 animate-fade-in delay-300">
          <div className="text-gold font-serif text-sm tracking-widest uppercase vertical-text">
            Elegância • Sofisticação • Amor
          </div>
        </div>
      </section>

      {/* Categories Fast Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Colares', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400' },
            { name: 'Brincos', img: 'https://images.unsplash.com/photo-1535633302703-b070b4628bc5?auto=format&fit=crop&q=80&w=400' },
            { name: 'Anéis', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3f4ad?auto=format&fit=crop&q=80&w=400' },
            { name: 'Pulseiras', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400' }
          ].map((cat, idx) => (
            <Link key={cat.name} to={`/catalog?cat=${cat.name}`} className="group relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-sm border border-pink-50 dark:border-gray-700">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-pink-900/40 transition-colors flex items-end p-8">
                <div>
                  <h3 className="text-white font-serif text-3xl font-bold mb-1">{cat.name}</h3>
                  <span className="text-pink-100 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Ver Tudo</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Seleção Especial</span>
            <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">Destaques da Semana</h2>
          </div>
          <Link to="/catalog" className="hidden sm:flex items-center text-pink-500 font-bold hover:gap-3 transition-all gap-2">
            Ver Loja Completa <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* About Us (Family Story) - Refined */}
      <section className="bg-gradient-to-b from-white to-pink-50 dark:from-gray-900 dark:to-gray-800 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-60"></div>
              <div className="relative group">
                <div className="absolute -top-6 -left-6 w-full h-full border border-gold rounded-[3rem] group-hover:-top-4 group-hover:-left-4 transition-all duration-500"></div>
                <img
                  src="https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&q=80&w=800"
                  alt="Nossa Oficina"
                  className="relative rounded-[3rem] shadow-2xl z-10 grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[2rem] shadow-xl z-20 border border-pink-50 text-center animate-bounce-slow">
                <p className="text-gold font-serif text-5xl font-bold mb-1">25</p>
                <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest">Anos de <br />Tradição</p>
              </div>
            </div>
            <div className="space-y-8 order-1 md:order-2">
              <div className="space-y-4">
                <span className="text-pink-400 font-bold uppercase tracking-[0.3em] text-xs">O Nosso Legado</span>
                <h2 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white leading-tight">Uma Paixão <br />Pela <span className="text-gold italic font-normal">Artesania</span></h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-light">
                O que começou numa pequena oficina artesanal no coração de Lisboa, transformou-se numa marca que celebra a feminilidade e a elegância. A Aura Bijoux não é apenas uma loja; é a concretização de um sonho passado de mãe para filha através de gerações.
              </p>
              <div className="grid grid-cols-2 gap-8 py-4 border-y border-pink-100">
                <div>
                  <h4 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-1">Design Exclusivo</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cada peça é desenhada para ser única.</p>
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-1">Alta Qualidade</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Materiais nobres e hipoalergénicos.</p>
                </div>
              </div>
              <button className="group text-gray-900 dark:text-white font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Conheça a Nossa Equipa <ArrowRight size={18} className="text-pink-500" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals with a horizontal scroll/grid focus */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4 text-center md:text-left">
          <div>
            <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">Novas Descobertas</h2>
            <p className="text-gray-500 dark:text-gray-400 font-light mt-2">Peças recém-chegadas que iluminam o seu estilo.</p>
          </div>
          <div className="h-[1px] bg-pink-100 dark:bg-pink-900/30 flex-grow mx-8 hidden lg:block"></div>
          <Link to="/catalog" className="px-6 py-2 border-2 border-pink-100 dark:border-pink-900 text-pink-500 rounded-full font-bold hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors">Ver Coleção 2024</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Social Feed Section */}
      <SocialFeed />

      {/* Enhanced Testimonials */}
      <section className="bg-white dark:bg-gray-900 py-24 border-y border-pink-50 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Experiências Aura</span>
            <h2 className="text-4xl font-serif font-bold mb-4 text-gray-900 dark:text-white">O Que Dizem Nossas Clientes</h2>
            <div className="flex justify-center text-yellow-400 gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Marta R.", role: "Influencer", text: "As peças são ainda mais bonitas ao vivo. O atendimento é super atencioso e a embalagem é pura poesia.", img: "https://i.pravatar.cc/100?u=marta" },
              { name: "Sofia L.", role: "Noiva", text: "Comprei um conjunto para o meu casamento e foi a melhor escolha. Delicado, elegante e atemporal.", img: "https://i.pravatar.cc/100?u=sofia" },
              { name: "Catarina S.", role: "Cliente Fiel", text: "A qualidade superou minhas expectativas. Uso minhas peças Aura todos os dias e o brilho continua o mesmo.", img: "https://i.pravatar.cc/100?u=cat" }
            ].map((t, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-6 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-pink-100 rounded-full scale-110 group-hover:rotate-12 transition-transform"></div>
                  <img src={t.img} alt={t.name} className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg" />
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300 italic font-light text-lg leading-relaxed">"{t.text}"</p>
                  <div>
                    <h4 className="font-serif font-bold text-xl text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-[10px] text-pink-400 font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refined Features Icons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 border border-pink-50 dark:border-gray-700 text-gold rounded-full flex items-center justify-center mb-6 shadow-xl shadow-pink-100/20 dark:shadow-none group-hover:-translate-y-2 transition-transform duration-500">
              <Truck size={32} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif font-bold text-2xl mb-2 text-gray-900 dark:text-white">Envio Premium</h3>
            <p className="text-gray-500 dark:text-gray-400 font-light text-sm">Gratuito em compras +50€. <br />Seguro e com número de seguimento.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 border border-pink-50 dark:border-gray-700 text-gold rounded-full flex items-center justify-center mb-6 shadow-xl shadow-pink-100/20 dark:shadow-none group-hover:-translate-y-2 transition-transform duration-500">
              <ShieldCheck size={32} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif font-bold text-2xl mb-2 text-gray-900 dark:text-white">Garantia Aura</h3>
            <p className="text-gray-500 dark:text-gray-400 font-light text-sm">Pagamentos 100% seguros e <br />materiais com garantia de brilho.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 border border-pink-50 dark:border-gray-700 text-gold rounded-full flex items-center justify-center mb-6 shadow-xl shadow-pink-100/20 dark:shadow-none group-hover:-translate-y-2 transition-transform duration-500">
              <RefreshCcw size={32} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif font-bold text-2xl mb-2 text-gray-900 dark:text-white">Satisfação Total</h3>
            <p className="text-gray-500 dark:text-gray-400 font-light text-sm">Tem 14 dias para trocas ou <br />devoluções sem complicações.</p>
          </div>
        </div>
      </section>
      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
};

export default Home;
