
export enum VoiceType {
  HUMAN = 'HUMAN',
  AI = 'AI'
}

export interface VoiceActor {
  id: string;
  name: string;
  category: string[];
  tags: string[];
  priceRange: string;
  avatarUrl: string;
  demoUrl?: string;
  rating: number;
  reviews: number;
  type: VoiceType;
}

export interface SoundSample {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  duration: string;
  bpm?: number;
  audioUrl: string;
  price: number; // 0 for free
  createdAt: number;
}

export enum AIVoiceName {
  Kore = 'Kore',
  Puck = 'Puck',
  Charon = 'Charon',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr',
  Aura = 'Aura',
  Luna = 'Luna',
  Terra = 'Terra',
  Nova = 'Nova',
  Eos = 'Eos',
  CUSTOM = 'Vlastní hlas'
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  cta: string;
  recommended: boolean;
  iconType: 'zap' | 'star' | 'shield';
}

export interface GlobalConfig {
  siteTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  isMaintenanceMode: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'actor' | 'admin';
  avatarUrl?: string;
}

export interface DBState {
  actors: VoiceActor[];
  plans: PricingPlan[];
  config: GlobalConfig;
  users: User[];
  sounds: SoundSample[];
}
