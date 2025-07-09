export interface CoachProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio: string;
  profileImage?: string;
  specialties: string[];
  yearsExperience: number;
  location: string;
  trainingStyle: string[];
  responseTime: string;
  coachingModality: string[];
  rating?: number;
  testimonialCount?: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Tag fields for UI consistency
  divisions?: string[];
  federations?: string[];
  
  // Certifications
  certifications?: string[];
  
  // Competition Experience
  competitionHistory?: {
    federations: string[];  // IFBB, NABBA, IPF, USAPL, etc.
    achievements: string[]; // Titles, placings, records
    yearsCompeting: number;
  };

  // Technical Specializations
  technicalExpertise?: {
    formCorrection: boolean;
    posingCoaching: boolean;
    injuryPrevention: boolean;
    specialtyLifts: string[];
  };

  // Programming Preferences
  programmingStyle?: {
    trainingFrequency: string[]; // "3-4x/week", "5-6x/week", etc.
    volumeApproach: string[]; // "High Volume", "Low Volume", "Moderate Volume"
    intensityTracking: string[]; // "RPE", "Percentage Based", "Both"
    equipmentPreference: string[]; // "Free Weights", "Machines", "Both"
  };

  // Client Categories
  clientTypes?: {
    natural: boolean;
    enhanced: boolean;
    beginners: boolean;
    advanced: boolean;
    competitors: boolean;
    weightClasses?: string[]; // Specific weight classes they have experience with
  };

  // Contest Prep
  contestPrep?: {
    experienceLevel: string; // "Beginner", "Intermediate", "Expert"
    successfulPreps: number;
    typicalPrepLength: string;
    offSeasonExperience: boolean;
  };
} 