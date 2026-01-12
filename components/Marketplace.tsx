
import React, { useState, useRef, useEffect } from 'react';
import { VoiceActor, VoiceType } from '../types';
import { db } from '../services/dbService';
import { Play, Pause, Star, BadgeCheck, Search, Filter } from 'lucide-react';

export const Marketplace: React.FC = () => {
  const [playingActorId, setPlayingActorId] = useState<string | null>(null);
  const [actors, setActors] = useState<VoiceActor[]>(db.getActors());
  const [searchTerm, setSearchTerm] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleUpdate = () => setActors([...db.getActors()]);
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  const handlePlayToggle = (actor: VoiceActor) => {
    if (!actor.demoUrl) return;
    if (playingActorId === actor.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingActorId(null);
      }
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const newAudio = new Audio(actor.demoUrl);
    newAudio.onended = () => setPlayingActorId(null);
    newAudio.onerror = () => setPlayingActorId(null);
    newAudio.play().catch(e => console.error(e));
    audioRef.current = newAudio;
    setPlayingActorId(actor.id);
  };

  const filteredActors = actors.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.category.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <section id="marketplace" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl lg:text-5xl font-black text-tertiary mb-6">Lidské hlasy s <span className="text-primary">duší</span>.</h2>
            <p className="text-gray-500 font-medium text-lg">
              Najměte si profesionála pro svůj projekt. Každý interpret je ověřen naším týmem a disponuje vlastní nahrávací technikou.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Hledat hlas..." 
                    className="pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm w-full md:w-64" 
                />
            </div>
            <button className="p-4 bg-tertiary text-white rounded-2xl hover:bg-black transition-colors">
                <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredActors.map((actor) => (
            <div key={actor.id} className="group bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <img src={actor.avatarUrl} alt={actor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                  <Star size={14} className="text-primary fill-primary" />
                  <span className="text-sm font-black text-tertiary">{actor.rating}</span>
                </div>
                <div className={`absolute inset-0 bg-tertiary/40 transition-opacity flex items-center justify-center ${playingActorId === actor.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button 
                        onClick={() => handlePlayToggle(actor)}
                        className="bg-white p-6 rounded-full text-primary hover:scale-110 active:scale-90 transition-all shadow-2xl"
                    >
                        {playingActorId === actor.id ? (
                            <Pause size={28} fill="currentColor" />
                        ) : (
                            <Play size={28} fill="currentColor" className="ml-1" />
                        )}
                    </button>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 mb-3">
                    <h3 className="font-black text-xl text-tertiary">{actor.name}</h3>
                    <BadgeCheck size={18} className="text-blue-500" />
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {actor.category.map((cat, i) => (
                    <span key={i} className="text-[10px] font-black text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase">Startovní cena</p>
                        <p className="font-black text-primary text-lg">{actor.priceRange}</p>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-tertiary hover:bg-primary hover:text-white transition-all">
                        <ArrowRight size={20} />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredActors.length === 0 && (
          <div className="py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
             <Search size={48} className="mx-auto text-gray-300 mb-4" />
             <p className="text-xl font-black text-gray-400 uppercase">Žádný interpret neodpovídá vyhledávání</p>
          </div>
        )}

        <div className="mt-16 text-center">
            <button className="px-12 py-5 border-2 border-tertiary text-tertiary rounded-2xl font-black hover:bg-tertiary hover:text-white transition-all shadow-xl shadow-tertiary/5">
                Procházet všech 150+ interpretů
            </button>
        </div>
      </div>
    </section>
  );
};

const ArrowRight = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
