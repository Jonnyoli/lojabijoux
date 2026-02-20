
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        alert('Mensagem enviada com sucesso! Entraremos em contacto brevemente.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">Fale Connosco</h1>
                    <p className="text-gray-500 mb-10 text-lg leading-relaxed">
                        Tem alguma dúvida sobre uma peça, uma encomenda ou apenas quer dizer olá? Estamos aqui para ajudar. Preencha o formulário ou utilize os nossos contactos diretos.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start">
                            <div className="bg-pink-50 p-3 rounded-lg mr-4 text-pink-500">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Email</h3>
                                <p className="text-gray-500">geral@aurabijoux.pt</p>
                                <p className="text-gray-400 text-sm mt-1">Respondemos em 24h úteis.</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-pink-50 p-3 rounded-lg mr-4 text-pink-500">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Telefone</h3>
                                <p className="text-gray-500">+351 912 345 678</p>
                                <p className="text-gray-400 text-sm mt-1">Seg-Sex, 9h às 18h.</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-pink-50 p-3 rounded-lg mr-4 text-pink-500">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Showroom</h3>
                                <p className="text-gray-500">Avenida da Liberdade, 123</p>
                                <p className="text-gray-500">1250-001 Lisboa</p>
                                <p className="text-gray-400 text-sm mt-1">Visitas por marcação.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-pink-50 p-8 border border-pink-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nome</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all outline-none"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Assunto</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all outline-none"
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                            >
                                <option value="">Selecione um assunto...</option>
                                <option value="encomenda">Informação sobre Encomenda</option>
                                <option value="produto">Dúvida sobre Produto</option>
                                <option value="devolucao">Devolução / Troca</option>
                                <option value="parceria">Parcerias</option>
                                <option value="outro">Outro</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Mensagem</label>
                            <textarea
                                required
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all outline-none resize-none"
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-pink-200 flex items-center justify-center gap-2"
                        >
                            <Send size={18} /> Enviar Mensagem
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
