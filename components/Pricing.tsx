
import React, { useState, useEffect } from 'react';
import { db } from '../services/dbService';
import { PricingPlan } from '../types';
import { Check, Zap, Star, ShieldCheck } from 'lucide-react';

export const Pricing: React.FC = () => {
  const [plans, setPlans] = useState<PricingPlan[]>(db.getPlans());

  useEffect(() => {
    const handleUpdate = () => setPlans([...db.getPlans()]);
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'star': return <Star size={24} />;
      case 'shield': return <ShieldCheck size={24} />;
      default: return <Zap size={24} />;
    }
  };

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Plány a ceny</span>
          <h2 className="text-4xl lg:text-5xl font-black text-tertiary">Investice do vašeho <span className="text-primary">hlasu</span></h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={plan.id} 
              className={`relative rounded-[40px] p-10 flex flex-col transition-all duration-500 hover:shadow-2xl ${
                plan.recommended 
                ? 'bg-tertiary text-white shadow-2xl scale-105 border-4 border-primary z-10' 
                : 'bg-gray-50 text-tertiary border border-gray-100 hover:-translate-y-2'
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">
                    Doporučujeme
                </div>
              )}
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${plan.recommended ? 'bg-primary text-white' : 'bg-white shadow-sm text-primary'}`}>
                {getIcon(plan.iconType)}
              </div>
              
              <h3 className="text-2xl font-black mb-2 uppercase tracking-wider">{plan.name}</h3>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-black">{plan.price === "Dohodou" ? "" : plan.price}</span>
                {plan.price !== "Dohodou" && plan.price !== "0" && <span className="text-lg font-bold mb-1 opacity-50">Kč / měsíc</span>}
                {plan.price === "0" && <span className="text-lg font-bold mb-1 opacity-50">ZDARMA</span>}
                {plan.price === "Dohodou" && <span className="text-4xl font-black">Individuálně</span>}
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check size={18} className="text-primary" strokeWidth={3} />
                    <span className="text-sm font-bold opacity-80">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-5 rounded-2xl font-black transition-all ${
                plan.recommended 
                ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-white hover:text-tertiary' 
                : 'bg-white text-tertiary border-2 border-tertiary hover:bg-tertiary hover:text-white'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
