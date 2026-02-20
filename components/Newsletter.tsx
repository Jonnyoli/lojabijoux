
import React, { useState } from 'react';
import { Send, Sparkles, CheckCircle2 } from 'lucide-react';

const Newsletter: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1500);
    };

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background with subtle glow */}
            <div className="absolute inset-0 bg-slate-900">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold opacity-10 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-500 opacity-10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] p-8 md:p-16 text-center max-w-4xl mx-auto overflow-hidden">
                    {status === 'success' ? (
                        <div className="animate-fade-in space-y-6 py-8">
                            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 scale-125">
                                <CheckCircle2 size={40} />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Bem-vinda à Família Aura!</h2>
                            <p className="text-slate-400 text-lg max-w-md mx-auto">
                                Obrigada por se juntar a nós. Em breve receberá as melhores novidades e ofertas exclusivas no seu e-mail.
                            </p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="text-gold font-bold hover:underline mt-4"
                            >
                                Subscrever outro e-mail
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-bold uppercase tracking-widest border border-gold/20 mb-4">
                                <Sparkles size={14} /> Newsletter Exclusiva
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                                    Receba <span className="text-gold italic font-normal">Brilho</span> na sua Caixa de Entrada
                                </h2>
                                <p className="text-slate-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                                    Subscreva a nossa newsletter para receber 10% de desconto na primeira compra e acesso antecipado a novas coleções.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mt-10">
                                <input
                                    type="email"
                                    placeholder="O seu melhor e-mail..."
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={status === 'loading'}
                                    className="flex-grow bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-gold/30 transition-all placeholder:text-slate-500"
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="bg-gold text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-gold/90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-gold/20"
                                >
                                    {status === 'loading' ? (
                                        <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                                    ) : (
                                        <>Subscrever <Send size={18} /></>
                                    )}
                                </button>
                            </form>

                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-6">
                                Ao subscrever, concorda com a nossa <span className="text-slate-400 cursor-pointer hover:text-gold transition-colors">Política de Privacidade</span>.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
