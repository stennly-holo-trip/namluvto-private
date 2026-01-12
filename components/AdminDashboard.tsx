
import React, { useState, useEffect } from 'react';
import { db } from '../services/dbService';
import { VoiceActor, PricingPlan, GlobalConfig, VoiceType, SoundSample } from '../types';
import { Settings, Users, CreditCard, Save, Plus, Trash2, Edit2, X, Globe, Phone, Mail, CheckCircle, Music, Music2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'actors' | 'pricing' | 'config' | 'sounds'>('actors');
  const [actors, setActors] = useState<VoiceActor[]>(db.getActors());
  const [plans, setPlans] = useState<PricingPlan[]>(db.getPlans());
  const [config, setConfig] = useState<GlobalConfig>(db.getConfig());
  const [sounds, setSounds] = useState<SoundSample[]>(db.getSounds());
  const [isEditingActor, setIsEditingActor] = useState<VoiceActor | null>(null);
  const [isEditingSound, setIsEditingSound] = useState<SoundSample | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setActors([...db.getActors()]);
      setPlans([...db.getPlans()]);
      setConfig({...db.getConfig()});
      setSounds([...db.getSounds()]);
    };
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateConfig(config);
    alert('Nastavení uloženo!');
  };

  const handleDeleteActor = (id: string) => {
    if (confirm('Opravdu smazat tohoto herce?')) {
      db.deleteActor(id);
    }
  };

  const handleDeleteSound = (id: string) => {
    if (confirm('Opravdu smazat tento zvuk?')) {
      db.deleteSound(id);
    }
  };

  return (
    <div className="flex flex-col h-full text-tertiary">
      <div className="flex border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'actors', label: 'Hlasová banka', icon: <Users size={18} /> },
          { id: 'sounds', label: 'Knihovna zvuků', icon: <Music size={18} /> },
          { id: 'pricing', label: 'Ceník a tarify', icon: <CreditCard size={18} /> },
          { id: 'config', label: 'Konfigurace webu', icon: <Settings size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 font-black text-xs uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-400 hover:text-tertiary'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-4">
        {activeTab === 'actors' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <div>
                <h3 className="font-black text-xl mb-1">Správa interpretů</h3>
                <p className="text-xs text-gray-400 font-bold uppercase">Celkem {actors.length} aktivních profilů</p>
              </div>
              <button 
                onClick={() => setIsEditingActor({ id: Date.now().toString(), name: '', category: [], tags: [], priceRange: 'od 0 Kč', avatarUrl: 'https://picsum.photos/150/150', rating: 5.0, reviews: 0, type: VoiceType.HUMAN })}
                className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-secondary transition-all"
              >
                <Plus size={18} /> Přidat interpreta
              </button>
            </div>

            <div className="grid gap-4">
              {actors.map(actor => (
                <div key={actor.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <img src={actor.avatarUrl} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-black text-sm">{actor.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{actor.priceRange} • {actor.category.join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditingActor(actor)} className="p-3 bg-gray-50 text-tertiary rounded-xl hover:bg-primary hover:text-white transition-all"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteActor(actor.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sounds' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <div>
                <h3 className="font-black text-xl mb-1">Správa zvukové knihovny</h3>
                <p className="text-xs text-gray-400 font-bold uppercase">Celkem {sounds.length} vzorků</p>
              </div>
              <button 
                onClick={() => setIsEditingSound({ id: Date.now().toString(), title: '', authorId: 'admin', authorName: 'Admin', category: 'FX', tags: [], duration: '0:05', audioUrl: '', price: 0, createdAt: Date.now() })}
                className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-secondary transition-all"
              >
                <Plus size={18} /> Přidat zvuk
              </button>
            </div>

            <div className="grid gap-4">
              {sounds.map(sound => (
                <div key={sound.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-tertiary text-white rounded-xl flex items-center justify-center">
                        <Music2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm">{sound.title}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{sound.category} • od {sound.authorName} • {sound.price === 0 ? 'FREE' : `${sound.price} kr.`}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditingSound(sound)} className="p-3 bg-gray-50 text-tertiary rounded-xl hover:bg-primary hover:text-white transition-all"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteSound(sound.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map(plan => (
              <div key={plan.id} className="bg-gray-50 p-8 rounded-[40px] border border-gray-100 relative group">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-black text-2xl uppercase tracking-tighter">{plan.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-primary">DOPORUČENO</span>
                    <input 
                        type="checkbox" 
                        checked={plan.recommended} 
                        onChange={(e) => db.updatePlan({...plan, recommended: e.target.checked})}
                        className="w-5 h-5 accent-primary"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Měsíční cena (Kč)</label>
                    <input 
                        type="text" 
                        value={plan.price} 
                        onChange={(e) => db.updatePlan({...plan, price: e.target.value})}
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-black text-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Funkce (jedna na řádek)</label>
                    <textarea 
                        value={plan.features.join('\n')} 
                        onChange={(e) => db.updatePlan({...plan, features: e.target.value.split('\n')})}
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-bold text-sm h-32"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'config' && (
          <form onSubmit={handleSaveConfig} className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                  <Globe size={18} className="text-primary" /> Obsah hlavní strany
                </h4>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Hlavní nadpis (Hero)</label>
                  <input type="text" value={config.heroTitle} onChange={e => setConfig({...config, heroTitle: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Podnadpis</label>
                  <textarea value={config.heroSubtitle} onChange={e => setConfig({...config, heroSubtitle: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-bold h-24" />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                  <Mail size={18} className="text-primary" /> Kontakty & Systém
                </h4>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">E-mail pro kontakt</label>
                  <input type="email" value={config.contactEmail} onChange={e => setConfig({...config, contactEmail: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Telefon</label>
                  <input type="text" value={config.contactPhone} onChange={e => setConfig({...config, contactPhone: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-2xl font-bold" />
                </div>
                <div className="pt-4 flex items-center gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="flex-1">
                    <p className="font-black text-red-600 text-xs">REŽIM ÚDRŽBY</p>
                    <p className="text-[10px] text-red-400">Vypne generování AI hlasů pro veřejnost.</p>
                  </div>
                  <input type="checkbox" checked={config.isMaintenanceMode} onChange={e => setConfig({...config, isMaintenanceMode: e.target.checked})} className="w-6 h-6 accent-red-600" />
                </div>
              </div>
            </div>
            <button type="submit" className="w-full py-5 bg-tertiary text-white rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-3">
              <Save size={24} /> ULOŽIT KONFIGURACI
            </button>
          </form>
        )}
      </div>

      {isEditingActor && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl p-10 shadow-2xl relative">
            <button onClick={() => setIsEditingActor(null)} className="absolute top-8 right-8 text-gray-300 hover:text-red-500"><X size={28} /></button>
            <h3 className="text-3xl font-black mb-8">Detail interpreta</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Jméno</label>
                <input type="text" value={isEditingActor.name} onChange={e => setIsEditingActor({...isEditingActor, name: e.target.value})} className="w-full p-4 bg-gray-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 transition-all font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Startovní cena</label>
                <input type="text" value={isEditingActor.priceRange} onChange={e => setIsEditingActor({...isEditingActor, priceRange: e.target.value})} className="w-full p-4 bg-gray-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 transition-all font-bold" />
              </div>
              <div className="md:col-span-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Kategorie (čárkou)</label>
                 <input type="text" value={isEditingActor.category.join(',')} onChange={e => setIsEditingActor({...isEditingActor, category: e.target.value.split(',')})} className="w-full p-4 bg-gray-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 transition-all font-bold" />
              </div>
              <div className="md:col-span-2">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-4">Profilový obrázek</p>
                <div className="flex items-center gap-6">
                  <img src={isEditingActor.avatarUrl} className="w-24 h-24 rounded-[30px] object-cover shadow-lg" />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        const url = await db.uploadFile(e.target.files[0]);
                        setIsEditingActor({...isEditingActor, avatarUrl: url});
                      }
                    }}
                    className="text-xs font-bold text-gray-400"
                  />
                </div>
              </div>
            </div>
            <button 
              onClick={() => { db.updateActor(isEditingActor); setIsEditingActor(null); }}
              className="w-full mt-10 py-5 bg-primary text-white rounded-[20px] font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
            >
              <CheckCircle size={24} /> ULOŽIT INTERPRETA
            </button>
          </div>
        </div>
      )}

      {isEditingSound && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl p-10 shadow-2xl relative">
            <button onClick={() => setIsEditingSound(null)} className="absolute top-8 right-8 text-gray-300 hover:text-red-500"><X size={28} /></button>
            <h3 className="text-3xl font-black mb-8">Detail zvukového vzorku</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Název zvuku</label>
                <input type="text" value={isEditingSound.title} onChange={e => setIsEditingSound({...isEditingSound, title: e.target.value})} className="w-full p-4 bg-gray-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 transition-all font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Cena (Kredity)</label>
                <input type="number" value={isEditingSound.price} onChange={e => setIsEditingSound({...isEditingSound, price: parseInt(e.target.value)})} className="w-full p-4 bg-gray-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 transition-all font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Kategorie</label>
                <select value={isEditingSound.category} onChange={e => setIsEditingSound({...isEditingSound, category: e.target.value})} className="w-full p-4 bg-gray-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 transition-all font-bold">
                    <option value="FX">FX</option>
                    <option value="Atmosféry">Atmosféry</option>
                    <option value="Hudební smyčky">Hudební smyčky</option>
                    <option value="Vokály">Vokály</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Délka (např. 0:05)</label>
                <input type="text" value={isEditingSound.duration} onChange={e => setIsEditingSound({...isEditingSound, duration: e.target.value})} className="w-full p-4 bg-gray-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 transition-all font-bold" />
              </div>
              <div className="md:col-span-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Tagy (čárkou)</label>
                 <input type="text" value={isEditingSound.tags.join(',')} onChange={e => setIsEditingSound({...isEditingSound, tags: e.target.value.split(',')})} className="w-full p-4 bg-gray-50 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 transition-all font-bold" />
              </div>
              <div className="md:col-span-2">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-4">Audio soubor</p>
                <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <Music2 size={32} className="text-primary" />
                  <input 
                    type="file" 
                    accept="audio/*"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        const url = await db.uploadFile(e.target.files[0]);
                        setIsEditingSound({...isEditingSound, audioUrl: url});
                      }
                    }}
                    className="text-xs font-bold text-gray-400"
                  />
                </div>
              </div>
            </div>
            <button 
              onClick={() => { db.updateSound(isEditingSound); setIsEditingSound(null); }}
              className="w-full mt-10 py-5 bg-tertiary text-white rounded-[20px] font-black shadow-xl flex items-center justify-center gap-3"
            >
              <CheckCircle size={24} /> ULOŽIT ZVUK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
