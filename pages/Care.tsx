
import React from 'react';
import { Droplets, Sun, Box, Sparkles } from 'lucide-react';

const Care: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Cuidados com as Peças</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Para garantir que as suas joias Aura Bijoux mantenham o brilho e a qualidade por muito tempo, siga estas recomendações simples.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 flex items-start hover:shadow-lg transition-all">
                    <div className="bg-blue-50 p-3 rounded-xl mr-6 text-blue-500">
                        <Droplets size={28} />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-lg mb-2">Evite o contacto com água</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Embora muitas peças sejam resistentes, o contacto frequente com água, especialmente salgada ou com cloro, pode acelerar o desgaste. Retire as peças antes do banho ou piscina.
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 flex items-start hover:shadow-lg transition-all">
                    <div className="bg-yellow-50 p-3 rounded-xl mr-6 text-yellow-500">
                        <Sun size={28} />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-lg mb-2">Proteja do sol e calor</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            A exposição prolongada à luz solar direta ou calor excessivo pode alterar a cor de algumas pedras e metais.
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 flex items-start hover:shadow-lg transition-all">
                    <div className="bg-purple-50 p-3 rounded-xl mr-6 text-purple-500">
                        <Box size={28} />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-lg mb-2">Armazenamento correto</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Guarde as suas peças individualmente na bolsa original ou numa caixa de joias forrada para evitar riscos e emaranhados.
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 flex items-start hover:shadow-lg transition-all">
                    <div className="bg-pink-50 p-3 rounded-xl mr-6 text-pink-500">
                        <Sparkles size={28} />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-lg mb-2">Limpeza suave</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Limpe as peças regularmente com um pano macio e seco. Evite utilizar produtos químicos ou abrasivos que possam danificar o acabamento.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-pink-50 rounded-3xl p-10 text-center">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Dúvidas?</h2>
                <p className="text-gray-600 mb-6">
                    Se tiver alguma questão específica sobre a manutenção de uma peça, não hesite em contactar-nos.
                </p>
                <a href="/contact" className="inline-block bg-pink-500 text-white font-bold px-8 py-3 rounded-full hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200">
                    Fale Connosco
                </a>
            </div>
        </div>
    );
};

export default Care;
