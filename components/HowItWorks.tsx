
import React from 'react';
import { Search, MessageSquareText, Download, Wallet, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: <Search className="w-10 h-10 text-white" />,
    title: "Výběr hlasu",
    desc: "Projděte si naše interprety nebo nahrajte svůj vlastní hlas pro okamžitý klon."
  },
  {
    icon: <MessageSquareText className="w-10 h-10 text-white" />,
    title: "Zadání textu",
    desc: "Vložte scénář, vyberte tempo a tón. AI nebo interpret se pustí do práce."
  },
  {
    icon: <Download className="w-10 h-10 text-white" />,
    title: "Hotová nahrávka",
    desc: "Stáhněte si profesionální audio soubor v plné kvalitě během několika minut."
  },
  {
    icon: <Wallet className="w-10 h-10 text-white" />,
    title: "Platba & Licence",
    desc: "Transparentní ceny bez skrytých poplatků. Vše legálně s licencí."
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Process Flow</span>
          <h2 className="text-4xl lg:text-5xl font-black text-tertiary">Jak to celé <span className="text-primary">funguje</span>?</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-12 relative">
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 border-t-2 border-dashed border-gray-200 -z-10 -translate-y-[100px]"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="w-32 h-32 rounded-[40px] bg-white shadow-2xl flex items-center justify-center mb-8 relative z-10 border border-gray-100 transition-all group-hover:bg-primary group-hover:-translate-y-3 duration-500">
                <div className="w-20 h-20 rounded-[30px] bg-tertiary flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                    {step.icon}
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white font-black border-4 border-white shadow-lg">
                    {index + 1}
                </div>
              </div>
              <h3 className="text-2xl font-black text-tertiary mb-4">{step.title}</h3>
              <p className="text-gray-400 font-bold text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};