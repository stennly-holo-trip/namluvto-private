
import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Logo className="h-10 mb-8" />
            <p className="text-gray-400 font-bold text-sm leading-relaxed mb-8">
              První digitální ekosystém pro audioprodukci v ČR. Spojujeme lidský talent s revoluční AI.
            </p>
            <div className="flex gap-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-primary transition-all cursor-pointer"></div>
                ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-tertiary text-lg mb-8 uppercase tracking-widest">Platforma</h4>
            <ul className="space-y-4 font-bold text-sm text-gray-500">
              <li><a href="#marketplace" className="hover:text-primary transition-colors">Hlasová banka</a></li>
              <li><a href="#ai-studio" className="hover:text-primary transition-colors">AI Studio</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Ceník služeb</a></li>
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">Jak to funguje</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-tertiary text-lg mb-8 uppercase tracking-widest">Podpora</h4>
            <ul className="space-y-4 font-bold text-sm text-gray-500">
              <li><a href="#" className="hover:text-primary transition-colors">Centrum nápovědy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Obchodní podmínky</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Ochrana údajů</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kontaktujte nás</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-tertiary text-lg mb-8 uppercase tracking-widest">Kontakt</h4>
            <div className="space-y-6 font-bold text-sm text-gray-500">
              <p>Email: <span className="text-tertiary">hello@namluv.to</span></p>
              <p>Telefon: <span className="text-tertiary">+420 777 666 555</span></p>
              <div className="pt-4 border-t border-gray-50">
                <p className="text-xs text-gray-300 mb-2">PROVOZOVATEL:</p>
                <p className="text-tertiary uppercase font-black">namluv.to digital s.r.o.</p>
                <p>IČO: 012345678</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">© 2025 namluv.to — VYROBENO S LÁSKOU V PRAZE</p>
          <div className="flex gap-8 text-[10px] font-black text-gray-300 uppercase tracking-widest">
            <a href="#" className="hover:text-primary">LinkedIn</a>
            <a href="#" className="hover:text-primary">Instagram</a>
            <a href="#" className="hover:text-primary">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
};