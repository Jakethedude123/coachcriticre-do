import { Timestamp } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';

export interface Testimonial {
  id: string;
  authorId: string;
  authorName: string;
  rating: number;
  text: string;
  date: Timestamp;
  verificationBadge?: {
    type: 'paid' | 'verified' | 'longTerm';
    text: string;
  };
  achievements?: string[];
  progress?: string;
}

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    address: string;
    notifications: {
      profileViews: boolean;
      searchAppearances: boolean;
      profileClicks: boolean;
    };
  };
  sms: {
    enabled: boolean;
    phoneNumber?: string;
    notifications: {
      profileViews: boolean;
      searchAppearances: boolean;
      profileClicks: boolean;
    };
  };
}

export type DaySchedule = string[];

export type WeeklySchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
};

export type PricingInfo = {
  currency: string;
  rate: number;
  interval: 'hour' | 'session' | 'month';
};

export type AnalyticsData = {
  profileViews: number;
  messagesSent: number;
  inquiriesReceived: number;
  clientsGained: number;
  searchAppearances: number;
  profileClicks: number;
  history: Array<{
    date: string;
    metric: string;
    value: number;
  }>;
};

export interface SocialLinks {
  instagram: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  website: string;
}

export interface CoachListing {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "1 month", "12 months"
  price: number; // Price in cents (Stripe requirement)
  features: string[]; // List of features/benefits
  stripePriceId?: string; // Reference to Stripe price object
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

export type CoachTier = 'free' | 'tier1' | 'tier2';

export interface TierBenefits {
  analytics: boolean;
  spotlight: boolean;
  verifiedBadge: boolean;
  prioritySearch: boolean;
  customBranding: boolean;
  premiumBadge: boolean;
  realTimeViews: boolean;
  advancedAnalytics: boolean;
  marketInsights: boolean;
}

export const TIER_BENEFITS: Record<CoachTier, TierBenefits> = {
  free: {
    analytics: false,
    spotlight: false,
    verifiedBadge: false,
    prioritySearch: false,
    customBranding: false,
    premiumBadge: false,
    realTimeViews: false,
    advancedAnalytics: false,
    marketInsights: false,
  },
  tier1: {
    analytics: true,
    spotlight: true,
    verifiedBadge: true,
    prioritySearch: false,
    customBranding: false,
    premiumBadge: false,
    realTimeViews: false,
    advancedAnalytics: false,
    marketInsights: false,
  },
  tier2: {
    analytics: true,
    spotlight: true,
    verifiedBadge: true,
    prioritySearch: true,
    customBranding: true,
    premiumBadge: true,
    realTimeViews: true,
    advancedAnalytics: true,
    marketInsights: true,
  },
};

export const TIER_PRICES = {
  tier1: 10.00,
  tier2: 15.00,
};

export interface Coach {
  userId: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  specialties: string[];
  experience: string;
  credentials: string[];
  certifications: string[];
  availability: {
    timezone: string;
    schedule: WeeklySchedule;
  };
  pricing: PricingInfo;
  analytics: AnalyticsData;
  social: SocialLinks;
  status: 'pending' | 'active' | 'suspended';
  featured: boolean;
  verified: boolean;
  avatar: string;
  coverImage: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  trainingStyle: string[];
  responseTime: string;
  stripeAccountId: string;
  stripeSubscriptionId: string;
  subscription: {
    plan: 'free' | 'pro' | 'premium';
    status: 'active' | 'cancelled' | 'past_due';
    stripeCustomerId: string;
    stripeSubscriptionId: string;
  };
  notificationPreferences?: {
    email: {
      enabled: boolean;
      address: string;
      notifications: {
        profileViews: boolean;
        searchAppearances: boolean;
        profileClicks: boolean;
      };
    };
    sms: {
      enabled: boolean;
      phoneNumber?: string;
      notifications: {
        profileViews: boolean;
        searchAppearances: boolean;
        profileClicks: boolean;
      };
    };
  };
}

export type CoachFormData = Omit<Coach, 'id' | 'rating' | 'reviewCount' | 'testimonials' | 'createdAt' | 'updatedAt'>;

export const DEFAULT_COACH_VALUES: Coach = {
  userId: '',
  name: '',
  email: '',
  phone: '',
  bio: '',
  specialties: [],
  experience: '',
  credentials: [],
  certifications: [],
  availability: {
    timezone: 'UTC',
    schedule: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    }
  },
  pricing: {
    rate: 0,
    currency: 'USD',
    interval: 'hour'
  },
  analytics: {
    profileViews: 0,
    messagesSent: 0,
    inquiriesReceived: 0,
    clientsGained: 0,
    searchAppearances: 0,
    profileClicks: 0,
    history: []
  },
  social: {
    instagram: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    website: ''
  },
  status: 'pending',
  featured: false,
  verified: false,
  avatar: '',
  coverImage: '',
  location: {
    city: '',
    state: '',
    country: ''
  },
  trainingStyle: [],
  responseTime: '',
  stripeAccountId: '',
  stripeSubscriptionId: '',
  subscription: {
    plan: 'free',
    status: 'active',
    stripeCustomerId: '',
    stripeSubscriptionId: ''
  }
};

export const defaultCoach: Coach = {
  userId: '',
  name: '',
  email: '',
  phone: '',
  bio: '',
  specialties: [],
  experience: '',
  credentials: [],
  certifications: [],
  availability: {
    timezone: '',
    schedule: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    }
  },
  pricing: {
    currency: 'USD',
    rate: 0,
    interval: 'hour'
  },
  analytics: {
    profileViews: 0,
    messagesSent: 0,
    inquiriesReceived: 0,
    clientsGained: 0,
    searchAppearances: 0,
    profileClicks: 0,
    history: []
  },
  social: {
    instagram: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    website: ''
  },
  status: 'active',
  featured: false,
  verified: false,
  avatar: '',
  coverImage: '',
  location: {
    city: '',
    state: '',
    country: ''
  },
  trainingStyle: [],
  responseTime: '',
  stripeAccountId: '',
  stripeSubscriptionId: '',
  subscription: {
    plan: 'free',
    status: 'active',
    stripeCustomerId: '',
    stripeSubscriptionId: ''
  }
}; 