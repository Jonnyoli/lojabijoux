
import React from 'react';
import { Truck, RotateCcw, ShieldCheck } from 'lucide-react';

const Shipping: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Envios e Devoluções</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Tudo o que precisa de saber sobre como enviamos as suas peças e a nossa política de satisfação.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-pink-50 rounded-2xl p-8 text-center hover:bg-pink-100 transition-colors">
                    <Truck size={40} className="text-pink-500 mx-auto mb-4" />
                    <h3 className="text-xl font-serif font-bold mb-2">Envio Rápido</h3>
                    <p className="text-gray-600 text-sm">Entregas em 24-48h úteis para Portugal Continental.</p>
                </div>
                <div className="bg-pink-50 rounded-2xl p-8 text-center hover:bg-pink-100 transition-colors">
                    <RotateCcw size={40} className="text-pink-500 mx-auto mb-4" />
                    <h3 className="text-xl font-serif font-bold mb-2">Devoluções Simples</h3>
                    <p className="text-gray-600 text-sm">Tem 14 dias para devolver ou trocar se não ficar satisfeita.</p>
                </div>
                <div className="bg-pink-50 rounded-2xl p-8 text-center hover:bg-pink-100 transition-colors">
                    <ShieldCheck size={40} className="text-pink-500 mx-auto mb-4" />
                    <h3 className="text-xl font-serif font-bold mb-2">Compra Segura</h3>
                    <p className="text-gray-600 text-sm">Pagamentos 100% seguros e dados encriptados.</p>
                </div>
            </div>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 border-b border-pink-100 pb-2">Prazos de Entrega</h2>
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                        <ul className="space-y-4 text-gray-600">
                            <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                                <span>Portugal Continental</span>
                                <span className="font-bold text-gray-800">24 a 48H úteis</span>
                            </li>
                            <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                                <span>Madeira e Açores</span>
                                <span className="font-bold text-gray-800">3 a 5 dias úteis</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span>Europa</span>
                                <span className="font-bold text-gray-800">5 a 10 dias úteis</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 border-b border-pink-100 pb-2">Política de Devoluções</h2>
                    <div className="prose prose-pink text-gray-600">
                        <p className="mb-4">
                            Queremos que adore as suas peças Aura Bijoux. Se por algum motivo não ficar satisfeita, pode efetuar a devolução no prazo de 14 dias após a receção da encomenda.
                        </p>
                        <p className="mb-4">
                            Para ser elegível para devolução, o artigo deve estar nas mesmas condições em que o recebeu: sem uso, com as etiquetas originais e na embalagem original.
                        </p>
                        <p className="font-bold">Como proceder:</p>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Envie um email para <a href="mailto:devolucoes@aurabijoux.pt" className="text-pink-500 hover:underline">devolucoes@aurabijoux.pt</a> com o número da encomenda.</li>
                            <li>Receberá as instruções de envio e o formulário de devolução.</li>
                            <li>Embale cuidadosamente a peça e envie para a morada indicada.</li>
                            <li>Após receção e verificação, o reembolso será processado no mesmo método de pagamento.</li>
                        </ol>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Shipping;
