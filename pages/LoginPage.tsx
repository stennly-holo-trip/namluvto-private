
import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Shield, Mic } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';

interface LoginPageProps {
  onClose: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const { login } = useAuth();

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auth Simulation Logic
    const emailLower = email.toLowerCase();
    const isAdmin = emailLower === 'admin@namluv.to';
    const isActor = emailLower === 'actor@namluv.to';
    
    login({ 
      id: isAdmin ? 'admin_1' : isActor ? 'actor_1' : 'user_1',
      name: isAdmin ? 'Hlavní Administrátor' : isActor ? 'Petr Svoboda' : 'Anna Soukupová', 
      email: email || 'anna.soukupova@email.com', 
      role: isAdmin ? 'admin' : isActor ? 'actor' : 'customer',
      avatarUrl: isAdmin 
        ? 'https://ui-avatars.com/api/?name=Admin&background=2B2D42&color=fff' 
        : isActor 
        ? 'https://picsum.photos/150/150?random=2'
        : 'https://picsum.photos/100/100?random=10' 
    });
    onClose();
  };

  const title = isLoginView ? 'Vítejte zpět!' : 'Vytvořit účet';
  const subtitle = isLoginView 
    ? 'Přihlaste se ke svému digitálnímu hlasovému studiu.' 
    : 'Získejte přístup k stovkám hlasů a AI klonování.';
  const buttonText = isLoginView ? 'Přihlásit se' : 'Zaregistrovat se';

  return (
    <div className="fixed inset-0 z-[100] bg-tertiary/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 lg:p-14 transform animate-scale-in">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-300 hover:text-red-500 transition-all">
          <X size={28} />
        </button>
        
        <div className="text-center mb-12">
          <Logo className="h-12 mx-auto mb-8" />
          <h2 className="text-3xl font-black text-tertiary tracking-tight">{title}</h2>
          <p className="text-gray-400 font-bold mt-3 text-sm">{subtitle}</p>
        </div>

        <form onSubmit={handleAuthAction} className="space-y-6">
          {!isLoginView && (
            <div className="relative">
              <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Celé jméno" 
                required 
                className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-transparent rounded-[20px] focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all font-bold" 
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail" 
              required 
              className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-transparent rounded-[20px] focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all font-bold" 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Heslo" 
              required 
              className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-transparent rounded-[20px] focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all font-bold" 
            />
          </div>
          
          <button type="submit" className="w-full bg-primary text-white py-5 rounded-[20px] font-black text-lg shadow-2xl shadow-primary/30 hover:bg-secondary transition-all transform active:scale-[0.98] flex items-center justify-center gap-3">
            {buttonText} <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 space-y-2">
            <div className="p-3 bg-tertiary/5 rounded-2xl flex items-center gap-3 border border-tertiary/5">
                <Shield size={16} className="text-tertiary opacity-40" />
                <p className="text-[9px] font-bold text-gray-400 uppercase leading-tight">Admin: <span className="text-tertiary">admin@namluv.to</span></p>
            </div>
            <div className="p-3 bg-primary/5 rounded-2xl flex items-center gap-3 border border-primary/5">
                <Mic size={16} className="text-primary opacity-40" />
                <p className="text-[9px] font-bold text-gray-400 uppercase leading-tight">Interpret: <span className="text-primary">actor@namluv.to</span></p>
            </div>
        </div>

        <div className="text-center mt-10">
          <button onClick={() => setIsLoginView(!isLoginView)} className="text-sm font-black text-gray-300 hover:text-primary transition-colors uppercase tracking-widest">
            {isLoginView ? 'Nemáte účet? Zaregistrujte se' : 'Máte již účet? Přihlaste se'}
          </button>
        </div>
      </div>
    </div>
  );
};
