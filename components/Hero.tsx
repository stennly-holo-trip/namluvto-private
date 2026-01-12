
import React from 'react';
import { Mic, Zap, CheckCircle, ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-light rounded-l-[100px] -z-10 opacity-50"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs mb-8 uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              První digitální hlasová banka v ČR
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-tertiary tracking-tight leading-[1.1] mb-8">
              Najdi si <br/>
              <span className="text-primary italic">svůj</span> hlas.
            </h1>
            
            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Získejte perfektní voiceover během několika minut. Vyberte si z stovek lidských interpretů nebo využijte naši revoluční AI technologii klonování.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <button 
                onClick={() => document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:bg-secondary hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Mic size={24} />
                Najít interpreta
              </button>
              <button 
                onClick={() => document.getElementById('ai-studio')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-tertiary text-white rounded-2xl font-black text-lg shadow-2xl shadow-tertiary/20 hover:bg-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Zap size={24} className="text-primary" />
                Vyzkoušet AI
              </button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-gray-400 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-primary" />
                <span>Ověření profíci</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-primary" />
                <span>Rychlé dodání</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-primary" />
                <span>Plná licence</span>
              </div>
            </div>
          </div>

          <div className="relative lg:ml-12">
            <div className="relative z-10 bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] p-8 border border-gray-100 transform rotate-1 hover:rotate-0 transition-all duration-700">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shadow-inner">
                            <img src="https://picsum.photos/100/100?random=1" alt="Voice Actor" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-tertiary">Marek Černý</h3>
                            <p className="text-sm font-bold text-primary">Reklamní hlas • Tenor</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-2xl font-black text-tertiary">od 800 Kč</span>
                        <span className="text-xs font-bold text-gray-300 uppercase">za nahrávku</span>
                    </div>
                </div>
                
                <div className="bg-light rounded-3xl p-6 mb-8">
                    <div className="flex items-end justify-center gap-1.5 h-24">
                        {[...Array(24)].map((_, i) => (
                            <div 
                                key={i} 
                                className="w-2 bg-primary rounded-full" 
                                style={{ 
                                    height: `${20 + Math.random() * 80}%`,
                                    opacity: 0.3 + (i / 24) * 0.7
                                }}
                            ></div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        <span>0:00</span>
                        <span>UKÁZKA PRÁCE</span>
                        <span>0:30</span>
                    </div>
                </div>

                <button className="w-full bg-tertiary text-white font-black py-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 group">
                    Zobrazit detaily <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-10 -right-10 bg-primary text-white p-6 rounded-[32px] shadow-2xl animate-bounce" style={{ animationDuration: '4s' }}>
                <Zap size={32} fill="white" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[32px] shadow-2xl border border-gray-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <CheckCircle size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">Dostupnost</p>
                    <p className="font-black text-tertiary">ONLINE IHNED</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};