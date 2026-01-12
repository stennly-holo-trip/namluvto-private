
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/dbService';
import { SoundSample } from '../types';
import { Play, Pause, Search, Filter, Download, Music, Tag, User, Clock, ShoppingCart } from 'lucide-react';

export const SoundLibrary: React.FC = () => {
  const [sounds, setSounds] = useState<SoundSample[]>(db.getSounds());
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Vše');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleUpdate = () => setSounds([...db.getSounds()]);
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  const handlePlayToggle = (sound: SoundSample) => {
    if (playingId === sound.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) audioRef.current.pause();
    const newAudio = new Audio(sound.audioUrl);
    newAudio.onended = () => setPlayingId(null);
    newAudio.play().catch(e => console.error(e));
    audioRef.current = newAudio;
    setPlayingId(sound.id);
  };

  const categories = ['Vše', 'FX', 'Atmosféry', 'Hudební smyčky', 'Vokály'];

  const filteredSounds = sounds.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'Vše' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="sound-library" className="py-24 bg-tertiary text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 pointer-events-none skew-x-12 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6">
              <Music size={14} className="text-primary" />
              SAMPLES & SOUNDS
            </div>
            <h2 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">Zvuková <span className="text-primary">knihovna</span>.</h2>
            <p className="text-gray-400 font-medium max-w-xl text-lg">
              Tisíce profesionálních samplů, ruchů a hudebních podkladů pro váš další projekt. Od komunity pro komunitu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Hledat zvuk nebo tag..." 
                className="pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:border-primary/50 transition-all font-bold w-full sm:w-80"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-black hover:bg-secondary transition-all">
              <Filter size={20} /> FILTRY
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeCategory === cat ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="bg-white/5 rounded-[40px] border border-white/10 overflow-hidden backdrop-blur-md">
          <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-6 border-b border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <div className="col-span-1"></div>
            <div className="col-span-4">Název zvukové stopy</div>
            <div className="col-span-2">Kategorie</div>
            <div className="col-span-2">Autor</div>
            <div className="col-span-2">Délka</div>
            <div className="col-span-1 text-right">Cena</div>
          </div>

          <div className="divide-y divide-white/10">
            {filteredSounds.map((sound) => (
              <div 
                key={sound.id} 
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-8 py-6 items-center transition-all hover:bg-white/5 group ${playingId === sound.id ? 'bg-primary/5' : ''}`}
              >
                <div className="col-span-1 flex justify-center md:justify-start">
                  <button 
                    onClick={() => handlePlayToggle(sound)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      playingId === sound.id ? 'bg-primary text-white animate-pulse' : 'bg-white/10 text-white hover:bg-primary'
                    }`}
                  >
                    {playingId === sound.id ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                  </button>
                </div>

                <div className="col-span-4">
                  <h4 className="font-black text-white text-lg mb-1">{sound.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {sound.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold text-gray-500 bg-black/30 px-2 py-0.5 rounded-md uppercase tracking-wider">#{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <span className="md:hidden text-[10px] font-black text-gray-500 uppercase">Kat:</span>
                  <span className="text-sm font-bold text-gray-400">{sound.category}</span>
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <span className="md:hidden text-[10px] font-black text-gray-500 uppercase">Autor:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <User size={12} className="text-gray-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-400 truncate">{sound.authorName}</span>
                  </div>
                </div>

                <div className="col-span-2 flex items-center gap-2">
                   <span className="md:hidden text-[10px] font-black text-gray-500 uppercase">Délka:</span>
                   <span className="text-sm font-bold text-gray-400 font-mono tracking-tighter flex items-center gap-2">
                      <Clock size={14} className="opacity-40" /> {sound.duration}
                   </span>
                </div>

                <div className="col-span-1 text-right flex md:block items-center justify-between">
                   <span className="md:hidden text-[10px] font-black text-gray-500 uppercase">Cena:</span>
                   <div className="flex items-center md:justify-end gap-4">
                      <span className="font-black text-primary text-lg">
                        {sound.price === 0 ? 'FREE' : `${sound.price} kr.`}
                      </span>
                      <button className="p-3 bg-white/10 text-white rounded-xl hover:bg-primary transition-all group-hover:scale-110">
                        {sound.price === 0 ? <Download size={18} /> : <ShoppingCart size={18} />}
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSounds.length === 0 && (
            <div className="py-24 text-center">
              <Music size={64} className="mx-auto text-white/10 mb-6" />
              <p className="text-2xl font-black text-gray-600 uppercase tracking-widest">Nebyly nalezeny žádné zvuky</p>
            </div>
          )}
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-between p-12 bg-primary rounded-[40px] shadow-2xl shadow-primary/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 mb-8 md:mb-0">
                <h3 className="text-3xl font-black mb-2">Chcete prodávat své zvuky?</h3>
                <p className="font-bold opacity-80">Přidejte se k stovkám interpretů, kteří vydělávají na své tvorbě.</p>
            </div>
            <button className="relative z-10 px-10 py-5 bg-white text-primary rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl">
                STÁT SE AUTOREM
            </button>
        </div>
      </div>
    </section>
  );
};
