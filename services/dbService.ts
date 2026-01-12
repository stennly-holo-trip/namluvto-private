
import { DBState, VoiceActor, PricingPlan, GlobalConfig, VoiceType, SoundSample } from '../types';

const DB_KEY = 'namluvto_db_v1';

const INITIAL_STATE: DBState = {
  actors: [
    {
      id: '1',
      name: 'Petr Svoboda',
      category: ['Reklama', 'Audioknihy'],
      tags: ['Hluboký', 'Důvěryhodný'],
      priceRange: 'od 1200 Kč',
      avatarUrl: 'https://picsum.photos/150/150?random=2',
      demoUrl: 'https://actions.google.com/sounds/v1/speech/voice_male_en_us_greeting.ogg',
      rating: 4.9,
      reviews: 124,
      type: VoiceType.HUMAN
    },
    {
      id: '2',
      name: 'Jana Kovářová',
      category: ['E-learning', 'Ústředny'],
      tags: ['Jemný', 'Mladý'],
      priceRange: 'od 1000 Kč',
      avatarUrl: 'https://picsum.photos/150/150?random=3',
      demoUrl: 'https://actions.google.com/sounds/v1/speech/voice_female_en_us_greeting.ogg',
      rating: 5.0,
      reviews: 89,
      type: VoiceType.HUMAN
    }
  ],
  plans: [
    {
      id: 'plan_free',
      name: "AI FREE",
      price: "0",
      features: ["5x AI voiceover denně", "Standardní AI hlasy", "Kvalita 128kbps"],
      cta: "Vyzkoušet zdarma",
      recommended: false,
      iconType: 'zap'
    },
    {
      id: 'plan_pro',
      name: "PROFESSIONAL",
      price: "490",
      features: ["Neomezené AI voiceovery", "Všechny prémiové hlasy", "Komerční licence"],
      cta: "Začít hned",
      recommended: true,
      iconType: 'star'
    }
  ],
  config: {
    siteTitle: "namluv.to - Digitální hlasová platforma",
    heroTitle: "Najdi si svůj hlas.",
    heroSubtitle: "Získejte perfektní voiceover během několika minut. Vyberte si z stovek lidských interpretů.",
    contactEmail: "hello@namluv.to",
    contactPhone: "+420 777 666 555",
    isMaintenanceMode: false
  },
  users: [],
  sounds: [
    {
      id: 's1',
      title: 'Cinematic Transition Swoosh',
      authorId: 'admin',
      authorName: 'namluv.to Team',
      category: 'FX',
      tags: ['Cinematic', 'Swoosh', 'Action'],
      duration: '0:03',
      audioUrl: 'https://actions.google.com/sounds/v1/foley/swoosh_transition.ogg',
      price: 0,
      createdAt: Date.now()
    },
    {
      id: 's2',
      title: 'Cozy Rain Ambience',
      authorId: '1',
      authorName: 'Petr Svoboda',
      category: 'Atmosféry',
      tags: ['Nature', 'Rain', 'Relax'],
      duration: '1:30',
      audioUrl: 'https://actions.google.com/sounds/v1/weather/rain_on_roof.ogg',
      price: 50,
      createdAt: Date.now()
    }
  ]
};

class DatabaseService {
  private state: DBState;

  constructor() {
    const saved = localStorage.getItem(DB_KEY);
    this.state = saved ? JSON.parse(saved) : INITIAL_STATE;
    if (!saved) this.save();
  }

  private save() {
    localStorage.setItem(DB_KEY, JSON.stringify(this.state));
    window.dispatchEvent(new CustomEvent('db-update'));
  }

  // Actors
  getActors() { return this.state.actors; }
  updateActor(actor: VoiceActor) {
    const index = this.state.actors.findIndex(a => a.id === actor.id);
    if (index > -1) {
      this.state.actors[index] = actor;
    } else {
      this.state.actors.push(actor);
    }
    this.save();
  }
  deleteActor(id: string) {
    this.state.actors = this.state.actors.filter(a => a.id !== id);
    this.save();
  }

  // Sounds
  getSounds() { return this.state.sounds; }
  updateSound(sound: SoundSample) {
    const index = this.state.sounds.findIndex(s => s.id === sound.id);
    if (index > -1) {
      this.state.sounds[index] = sound;
    } else {
      this.state.sounds.push(sound);
    }
    this.save();
  }
  deleteSound(id: string) {
    this.state.sounds = this.state.sounds.filter(s => s.id !== id);
    this.save();
  }

  // Pricing
  getPlans() { return this.state.plans; }
  updatePlan(plan: PricingPlan) {
    const index = this.state.plans.findIndex(p => p.id === plan.id);
    if (index > -1) this.state.plans[index] = plan;
    this.save();
  }

  // Config
  getConfig() { return this.state.config; }
  updateConfig(config: GlobalConfig) {
    this.state.config = config;
    this.save();
  }

  // Storage Simulation
  async uploadFile(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}

export const db = new DatabaseService();
