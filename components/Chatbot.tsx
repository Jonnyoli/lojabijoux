
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User, ShoppingBag } from 'lucide-react';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';

interface Message {
    id: string;
    type: 'user' | 'bot';
    text: string;
    options?: { label: string; action: string; value?: string }[];
    products?: string[]; // Product IDs
}

const Chatbot: React.FC = () => {
    const { products } = useApp();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'bot',
            text: 'Olá! Sou a sua Personal Shopper Aura com IA. ✨\nEm que posso ajudar hoje?',
            options: [
                { label: '🎁 Encontrar Presente', action: 'gift' },
                { label: '💎 Ver Novidades', action: 'new' },
                { label: '❓ Ajuda com Pedido', action: 'support' },
            ]
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleOptionClick = (action: string, value?: string) => {
        const userMsg: Message = { id: Date.now().toString(), type: 'user', text: value || action };

        // Friendly label mapping
        if (action === 'gift') userMsg.text = 'Quero encontrar um presente';
        if (action === 'new') userMsg.text = 'Quero ver as novidades';
        if (action === 'support') userMsg.text = 'Preciso de ajuda com um pedido';
        if (action === 'budget_low') userMsg.text = 'Até 50€';
        if (action === 'budget_mid') userMsg.text = 'Entre 50€ e 150€';
        if (action === 'budget_high') userMsg.text = 'Mais de 150€';

        setMessages(prev => [...prev, userMsg]);
        processResponse(action);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        processResponse('unknown', input); // Simple NLP fallback
    };

    const processResponse = (action: string, text?: string) => {
        setIsTyping(true);

        setTimeout(() => {
            let botMsg: Message = { id: Date.now().toString(), type: 'bot', text: '' };

            switch (action) {
                case 'gift':
                    botMsg.text = 'Que gesto bonito! Para quem é o presente?';
                    botMsg.options = [
                        { label: '💑 Namorada/Esposa', action: 'recipient_partner' },
                        { label: '👩 Mãe', action: 'recipient_mom' },
                        { label: '👯 Amiga', action: 'recipient_friend' },
                        { label: '👸 Para Mim!', action: 'recipient_self' },
                    ];
                    break;

                case 'recipient_partner':
                case 'recipient_mom':
                case 'recipient_friend':
                case 'recipient_self':
                    botMsg.text = 'Perfeito. E qual é o orçamento aproximado?';
                    botMsg.options = [
                        { label: 'Até 50€', action: 'budget_low' },
                        { label: '50€ - 150€', action: 'budget_mid' },
                        { label: '+150€', action: 'budget_high' },
                    ];
                    break;

                case 'budget_low':
                    botMsg.text = 'Selecionei algumas peças maravilhosas e acessíveis para si. ✨';
                    botMsg.products = products.filter(p => p.price <= 50).slice(0, 3).map(p => p.id);
                    botMsg.options = [{ label: 'Ver mais opções', action: 'gift' }];
                    break;

                case 'budget_mid':
                    botMsg.text = 'Excelente escolha. Estas peças são muito populares!';
                    botMsg.products = products.filter(p => p.price > 50 && p.price <= 150).slice(0, 3).map(p => p.id);
                    botMsg.options = [{ label: 'Ver mais opções', action: 'gift' }];
                    break;

                case 'budget_high':
                    botMsg.text = 'O luxo intemporal da Aura. Aqui estão as nossas joias mais exclusivas. 💎';
                    botMsg.products = products.filter(p => p.price > 150).slice(0, 3).map(p => p.id);
                    botMsg.options = [{ label: 'Ver mais opções', action: 'gift' }];
                    break;

                case 'new':
                    botMsg.text = 'Acabaram de chegar! Veja as novidades da coleção Primavera/Verão.';
                    botMsg.products = products.filter(p => p.isNew).slice(0, 3).map(p => p.id);
                    break;

                case 'support':
                    botMsg.text = 'Para questões sobre pedidos, pode consultar a nossa área de cliente ou contactar-nos diretamente.';
                    botMsg.options = [
                        { label: '📦 Rastrear Encomenda', action: 'track' },
                        { label: '📞 Contactos', action: 'contact' },
                    ];
                    break;

                case 'track':
                    botMsg.text = 'Pode ver o estado das suas encomendas no seu Perfil > Histórico de Encomendas.';
                    break;

                case 'contact':
                    botMsg.text = 'Estamos disponíveis por email (apoio@aurabijoux.com) ou telefone (+351 912 345 678).';
                    break;

                default:
                    botMsg.text = 'Ainda estou a aprender! Por favor, selecione uma das opções abaixo para que eu possa ajudar melhor.';
                    botMsg.options = [
                        { label: '🎁 Encontrar Presente', action: 'gift' },
                        { label: '💎 Ver Novidades', action: 'new' },
                        { label: '❓ Ajuda com Pedido', action: 'support' },
                    ];
            }

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1000 + Math.random() * 500); // Simulate typing delay
    };

    const getProduct = (id: string) => products.find(p => p.id === id);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-40 bg-gray-900 dark:bg-pink-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transistion-transform duration-300 flex items-center gap-2 ${isOpen ? 'hidden' : 'flex'}`}
            >
                <Sparkles size={20} className="animate-pulse" />
                <span className="font-bold text-sm hidden md:inline">Personal Shopper</span>
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 width-full sm:w-[380px] h-[500px] sm:h-[600px] max-w-[calc(100vw-32px)] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl z-50 flex flex-col border border-gray-100 dark:border-gray-700 transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>

                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-pink-600 dark:to-pink-700 p-4 rounded-t-3xl flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Aura Personal Shopper</h3>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-[10px] opacity-80">Online agora</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50 scrollbar-hide">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>

                            {/* Message Bubble */}
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.type === 'user'
                                    ? 'bg-gray-900 dark:bg-pink-600 text-white rounded-br-none'
                                    : 'bg-white dark:bg-gray-700 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-600 rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>

                            {/* Product Recommendations */}
                            {msg.products && (
                                <div className="mt-3 flex gap-2 overflow-x-auto w-full pb-2 scrollbar-none snap-x">
                                    {msg.products.map(pid => {
                                        const p = getProduct(pid);
                                        if (!p) return null;
                                        return (
                                            <div key={pid} className="flex-shrink-0 w-40 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 snap-center cursor-pointer" onClick={() => { setIsOpen(false); navigate(`/product/${p.id}`); }}>
                                                <div className="h-40 overflow-hidden">
                                                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="p-2">
                                                    <p className="text-xs font-bold text-gray-800 dark:text-white truncate">{p.name}</p>
                                                    <p className="text-xs text-pink-500 font-bold">{p.price.toFixed(2)}€</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Options */}
                            {msg.options && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {msg.options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleOptionClick(opt.action, opt.label)}
                                            className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-pink-600 dark:text-pink-400 px-3 py-1.5 rounded-full hover:bg-pink-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex items-start">
                            <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-600">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-bounce delay-0"></div>
                                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 rounded-b-3xl">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escreva uma mensagem..."
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-full pl-4 pr-12 py-2 text-sm outline-none focus:border-pink-300 dark:focus:border-pink-500 dark:text-white transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="absolute right-1 top-1 p-1.5 bg-gray-900 dark:bg-pink-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Chatbot;
