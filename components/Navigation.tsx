
import React, { useState } from 'react';
import { Logo } from './Logo';
import { Menu, X, User, LogOut, Briefcase, CreditCard, Music } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  onLoginClick: () => void;
  onProfileClick: () => void;
  onProjectsClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onProfileClick, onProjectsClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="fixed w-full z-[80] bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo className="h-10 w-auto" />
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => scrollToSection('how-it-works')} className="text-tertiary hover:text-primary font-bold transition-colors">Jak to funguje</button>
            <button onClick={() => scrollToSection('marketplace')} className="text-tertiary hover:text-primary font-bold transition-colors">Hlasy</button>
            <button onClick={() => scrollToSection('sound-library')} className="text-tertiary hover:text-primary font-bold transition-colors">Zvuky</button>
            <button onClick={() => scrollToSection('pricing')} className="text-tertiary hover:text-primary font-bold transition-colors">Ceník</button>
            <button onClick={() => scrollToSection('ai-studio')} className="text-tertiary hover:text-primary font-bold transition-colors">AI Studio</button>
            
            {isAuthenticated ? (
              <div className="relative ml-4">
                <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}&background=D90429&color=fff`} alt="User avatar" className="w-10 h-10 rounded-full border-2 border-primary/20" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 py-3 z-50 border border-gray-100 overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-50 mb-2">
                      <p className="text-sm font-extrabold text-tertiary">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <button onClick={() => { onProfileClick(); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-tertiary font-bold hover:bg-gray-50 transition-colors text-left"><User size={18} className="text-primary"/> Můj profil</button>
                    <button onClick={() => { onProjectsClick(); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-tertiary font-bold hover:bg-gray-50 transition-colors text-left"><Briefcase size={18} className="text-primary"/> Moje projekty</button>
                    {user?.role === 'actor' && (
                        <button onClick={() => scrollToSection('sound-library')} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-tertiary font-bold hover:bg-gray-50 transition-colors text-left"><Music size={18} className="text-primary"/> Moje samply</button>
                    )}
                    <button onClick={() => scrollToSection('pricing')} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-tertiary font-bold hover:bg-gray-50 transition-colors text-left"><CreditCard size={18} className="text-primary"/> Předplatné</button>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-5 py-4 text-sm text-red-600 font-bold hover:bg-red-50 border-t border-gray-50 mt-2">
                      <LogOut size={18}/> Odhlásit se
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                <button onClick={onLoginClick} className="text-tertiary font-black hover:text-primary transition-colors">Přihlásit</button>
                <button onClick={onLoginClick} className="bg-primary text-white px-6 py-3 rounded-full font-black hover:bg-secondary transition-all shadow-xl shadow-primary/20">
                  Chci nahrávku
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-tertiary">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-2xl">
          <div className="px-4 pt-4 pb-8 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-4 border-b border-gray-50 mb-2">
                    <img src={user?.avatarUrl} className="w-12 h-12 rounded-full" />
                    <div>
                        <p className="font-black text-tertiary">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                </div>
                <button onClick={() => {onProfileClick(); setIsMenuOpen(false);}} className="block w-full text-left px-4 py-3 text-tertiary font-bold hover:bg-gray-50 rounded-xl">Můj profil</button>
                <button onClick={() => {onProjectsClick(); setIsMenuOpen(false);}} className="block w-full text-left px-4 py-3 text-tertiary font-bold hover:bg-gray-50 rounded-xl">Moje projekty</button>
                <button onClick={() => scrollToSection('sound-library')} className="block w-full text-left px-4 py-3 text-tertiary font-bold hover:bg-gray-50 rounded-xl">Knihovna zvuků</button>
                <button onClick={() => scrollToSection('pricing')} className="block w-full text-left px-4 py-3 text-tertiary font-bold hover:bg-gray-50 rounded-xl">Ceník</button>
                <div className="pt-4">
                   <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-black">Odhlásit se</button>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left px-4 py-3 text-tertiary font-bold hover:bg-gray-50 rounded-xl">Jak to funguje</button>
                <button onClick={() => scrollToSection('marketplace')} className="block w-full text-left px-4 py-3 text-tertiary font-bold hover:bg-gray-50 rounded-xl">Hlasy</button>
                <button onClick={() => scrollToSection('sound-library')} className="block w-full text-left px-4 py-3 text-tertiary font-bold hover:bg-gray-50 rounded-xl">Zvuky</button>
                <button onClick={() => scrollToSection('ai-studio')} className="block w-full text-left px-4 py-3 text-tertiary font-bold hover:bg-gray-50 rounded-xl">AI Studio</button>
                <button onClick={() => scrollToSection('pricing')} className="block w-full text-left px-4 py-3 text-tertiary font-bold hover:bg-gray-50 rounded-xl">Ceník</button>
                <div className="pt-6 flex flex-col gap-3">
                  <button onClick={onLoginClick} className="w-full text-tertiary font-black py-3 border-2 border-tertiary rounded-xl">Přihlásit</button>
                  <button onClick={onLoginClick} className="w-full bg-primary text-white py-4 rounded-xl font-black shadow-lg shadow-primary/20">Chci nahrávku</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
