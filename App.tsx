
import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Marketplace } from './components/Marketplace';
import { AIStudio } from './components/AIStudio';
import { Pricing } from './components/Pricing';
import { SoundLibrary } from './components/SoundLibrary';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { db } from './services/dbService';
import { X, Briefcase, User, Calendar, MessageCircle, FileText, LayoutDashboard, Settings, Music } from 'lucide-react';

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode; full?: boolean }> = ({ title, onClose, children, full }) => (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div className={`relative bg-white rounded-[40px] shadow-2xl w-full ${full ? 'max-w-7xl h-[90vh]' : 'max-w-4xl max-h-[90vh]'} overflow-hidden flex flex-col animate-scale-in`}>
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-3xl font-black text-tertiary uppercase tracking-tight">{title}</h2>
                <button onClick={onClose} className="p-4 bg-gray-50 text-gray-400 hover:text-red-500 rounded-full transition-all">
                    <X size={24} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                {children}
            </div>
        </div>
    </div>
);

const AppContent: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'login' | 'profile' | 'projects' | 'admin' | 'upload_sound' | null>(null);
  const { isAuthenticated, user } = useAuth();
  const [config, setConfig] = useState(db.getConfig());

  useEffect(() => {
    const handleUpdate = () => setConfig(db.getConfig());
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-white text-tertiary font-sans selection:bg-primary/20 selection:text-primary">
      <Navigation 
        onLoginClick={() => setActiveModal('login')} 
        onProfileClick={() => setActiveModal('profile')}
        onProjectsClick={() => setActiveModal('projects')}
      />
      
      {/* Admin Quick Link */}
      {isAuthenticated && user?.role === 'admin' && (
        <button 
          onClick={() => setActiveModal('admin')}
          className="fixed bottom-8 left-8 z-50 bg-tertiary text-white p-5 rounded-3xl shadow-2xl flex items-center gap-3 hover:scale-110 active:scale-95 transition-all border border-white/10 group"
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-black text-xs uppercase tracking-widest pr-2">Administrace webu</span>
        </button>
      )}

      {/* Actor Quick Upload Link */}
      {isAuthenticated && user?.role === 'actor' && (
        <button 
          onClick={() => setActiveModal('admin')} // Redirect to management
          className="fixed bottom-8 right-8 z-50 bg-primary text-white p-5 rounded-3xl shadow-2xl flex items-center gap-3 hover:scale-110 active:scale-95 transition-all group"
        >
          <div className="w-10 h-10 bg-white text-primary rounded-xl flex items-center justify-center">
            <Music size={20} />
          </div>
          <span className="font-black text-xs uppercase tracking-widest pr-2">Můj Studio Panel</span>
        </button>
      )}

      <main>
        <Hero />
        <HowItWorks />
        <Marketplace />
        <SoundLibrary />
        <AIStudio />
        <Pricing />
        
        <section className="py-24 bg-tertiary text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 pointer-events-none"></div>
            <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                <h2 className="text-4xl lg:text-6xl font-black mb-10 leading-tight">Jste připraveni dát <br/>svému projektu <span className="text-primary italic">hlas</span>?</h2>
                <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-xl font-medium">
                    Ať už potřebujete lidský dotek emocí nebo bleskovou AI rychlost, na namluv.to najdete to nejlepší z obou světů.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <button onClick={() => setActiveModal('login')} className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all">
                        Zaregistrovat se
                    </button>
                    <button className="bg-white/10 backdrop-blur-md border-2 border-white/20 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all">
                        Kontaktovat tým
                    </button>
                </div>
            </div>
        </section>
      </main>

      <Footer />

      {activeModal === 'login' && <LoginPage onClose={() => setActiveModal(null)} />}
      {activeModal === 'admin' && <Modal title="System Administration" full onClose={() => setActiveModal(null)}><AdminDashboard /></Modal>}
      
      {activeModal === 'profile' && (
        <Modal title="Můj profil" onClose={() => setActiveModal(null)}>
            <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-1 text-center">
                    <div className="relative inline-block mb-6">
                        <img src={user?.avatarUrl || "https://picsum.photos/200/200?random=10"} className="w-48 h-48 rounded-[40px] shadow-2xl border-4 border-white" />
                        <div className="absolute -bottom-4 -right-4 bg-primary text-white p-4 rounded-3xl shadow-xl">
                            <User size={24} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-black mb-1">{user?.name}</h3>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">
                        {user?.role === 'admin' ? 'Administrátor' : user?.role === 'actor' ? 'Hlasový Interpret' : 'Zákazník Premium'}
                    </p>
                    {user?.role === 'admin' && (
                        <button onClick={() => setActiveModal('admin')} className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg mb-4 flex items-center justify-center gap-2"><Settings size={18}/> Správa webu</button>
                    )}
                    {user?.role === 'actor' && (
                        <button onClick={() => setActiveModal('admin')} className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg mb-4 flex items-center justify-center gap-2"><Music size={18}/> Správa mých zvuků</button>
                    )}
                    <button className="w-full py-4 bg-gray-50 text-tertiary font-black rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all mb-4">Upravit údaje</button>
                </div>
                <div className="md:col-span-2 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Kredit k čerpání</p>
                            <p className="text-3xl font-black text-tertiary">2 450 Kč</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Moje nahrávky</p>
                            <p className="text-3xl font-black text-tertiary">14</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-black text-lg uppercase tracking-widest mb-4">Moje Aktivita</h4>
                        {[
                            { icon: <MessageCircle className="text-primary" />, t: "Zpráva od Jana Nováka", d: "Před 2 hodinami" },
                            { icon: <FileText className="text-blue-500" />, t: "Nahrávka 'Spot_Final.wav' připravena", d: "Včera v 18:40" },
                            { icon: <Calendar className="text-green-500" />, t: "Platba za tarif Professional proběhla", d: "3. dubna 2025" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer group">
                                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-all">{item.icon}</div>
                                <div>
                                    <p className="font-bold text-tertiary">{item.t}</p>
                                    <p className="text-xs text-gray-400">{item.d}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
      )}

      {activeModal === 'projects' && (
        <Modal title="Moje projekty" onClose={() => setActiveModal(null)}>
            <div className="space-y-8">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex gap-4">
                        <button className="px-6 py-2 bg-primary text-white rounded-xl font-black text-sm">Aktivní (3)</button>
                        <button className="px-6 py-2 bg-gray-50 text-gray-400 rounded-xl font-black text-sm hover:text-tertiary">Archiv (12)</button>
                    </div>
                    <button className="px-6 py-3 bg-tertiary text-white rounded-xl font-black text-sm hover:bg-black transition-all">+ Nový projekt</button>
                </div>
                
                {[
                    { name: "Radiospot Jaro 2025", actor: "Jan Novák", status: "Čeká na schválení", color: "bg-orange-500" },
                    { name: "Audiokniha: Kapitola 1", actor: "AI - Kore", status: "Dokončeno", color: "bg-green-500" },
                    { name: "E-learning pro školy", actor: "Jana Kovářová", status: "V nahrávání", color: "bg-blue-500" }
                ].map((project, i) => (
                    <div key={i} className="group bg-gray-50 p-8 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                                <Briefcase size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-tertiary mb-1">{project.name}</h3>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Interpret: {project.actor}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-lg text-white text-[10px] font-black uppercase mb-2 ${project.color}`}>{project.status}</span>
                                <p className="text-xs text-gray-400 font-bold uppercase">Aktualizováno: Dnes</p>
                            </div>
                            <button className="p-4 bg-white rounded-2xl text-tertiary hover:bg-primary hover:text-white transition-all shadow-sm">
                                <ArrowRight size={24} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}

const ArrowRight = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
