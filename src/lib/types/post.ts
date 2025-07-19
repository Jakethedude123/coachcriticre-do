import { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  coachId: string;
  coachName: string;
  coachAvatar?: string;
  coachRating?: number;
  content: string;
  imageUrl?: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likes: string[]; // Array of user IDs who liked the post
  comments: Comment[];
  analytics: PostAnalytics;
  isProUser: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Timestamp;
  likes: string[];
}

export interface PostAnalytics {
  views: number;
  imageClicks: number;
  profileVisits: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  history: Array<{
    date: string;
    metric: string;
    value: number;
  }>;
}

export interface CreatePostData {
  content: string;
  imageFile?: File;
  tags: string[];
}

export interface PostFilters {
  filter: 'all' | 'my-posts' | 'followed-tags';
  coachId?: string;
  followedTags?: string[];
}

export const POST_TAGS = [
  // Training & Technique
  'Form Tips', 'Progressive Overload', 'Recovery', 'Nutrition', 'Supplements',
  'Contest Prep', 'Posing', 'Injury Prevention', 'Mobility', 'Strength Training',
  
  // Competition
  'Meet Day', 'Weight Cutting', 'Peaking', 'Competition Strategy', 'Judging Criteria',
  'Federation Rules', 'Drug Testing', 'Backstage Prep', 'Stage Presence',
  
  // Lifestyle
  'Mindset', 'Goal Setting', 'Consistency', 'Work-Life Balance', 'Stress Management',
  'Sleep', 'Hormone Optimization', 'Body Composition', 'Transformation',
  
  // Specialized
  'Female Athletes', 'Natural Bodybuilding', 'Enhanced Athletes', 'Masters Division',
  'Powerlifting', 'Bodybuilding', 'Strongman', 'CrossFit', 'Olympic Lifting',
  
  // Coaching
  'Client Success', 'Programming', 'Periodization', 'Deloading', 'Plateau Breaking',
  'Motivation', 'Accountability', 'Progress Tracking', 'Goal Achievement'
];

export const DEFAULT_POST_ANALYTICS: PostAnalytics = {
  views: 0,
  imageClicks: 0,
  profileVisits: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  engagementRate: 0,
  history: []
}; 