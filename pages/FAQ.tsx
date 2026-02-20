
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqData = [
  {
    question: "Quanto tempo demora o envio?",
    answer: "Os envios para Portugal Continental demoram normalmente 24 a 48 horas úteis após o processamento da encomenda. Para as Ilhas, o prazo pode estender-se até 5 dias úteis."
  },
  {
    question: "Quais são os métodos de pagamento aceites?",
    answer: "Aceitamos Multibanco, MBWAY, Cartão de Crédito (Visa/Mastercard) e Paypal. Todas as transações são seguras e encriptadas."
  },
  {
    question: "Posso devolver um artigo?",
    answer: "Sim, aceitamos devoluções no prazo de 14 dias após a receção da encomenda, desde que os artigos estejam nas condições originais e com a embalagem intacta."
  },
  {
    question: "As peças são de aço inoxidável?",
    answer: "Sim, a maioria das nossas peças é fabricada em aço inoxidável de alta qualidade, resistente à água e hipoalergénico. Consulte a descrição de cada produto para detalhes específicos."
  },
  {
    question: "Fazem envios internacionais?",
    answer: "Atualmente enviamos para toda a Europa. Os custos de envio são calculados no checkout com base no destino."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Perguntas Frequentes</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Encontre respostas para as dúvidas mais comuns sobre as nossas peças, envios e serviços.
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div 
            key={index} 
            className={`border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'bg-pink-50/50 shadow-md border-pink-100' : 'bg-white hover:border-pink-200'
            }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <HelpCircle size={20} className={`flex-shrink-0 ${openIndex === index ? 'text-pink-500' : 'text-gray-300'}`} />
                <span className={`font-bold text-lg ${openIndex === index ? 'text-gray-900' : 'text-gray-700'}`}>
                  {faq.question}
                </span>
              </div>
              {openIndex === index ? (
                <ChevronUp className="text-pink-500" />
              ) : (
                <ChevronDown className="text-gray-400" />
              )}
            </button>
            
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-6 pt-0 text-gray-600 leading-relaxed ml-11 border-l-2 border-pink-100 pl-6 mb-6">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
