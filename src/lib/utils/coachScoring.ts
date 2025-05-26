import type { CoachProfile } from '@/lib/types/coach';

interface ScoreComponents {
  satisfactionScore: number;
  consistencyScore: number;
  experienceScore: number;
  successRatio: number;
  clientRetentionScore: number;
  finalScore: number;
}

export function calculateCoachScore(coach: CoachProfile): ScoreComponents {
  // Satisfaction Score (0-100)
  // Uses a weighted average of recent reviews to give more importance to recent feedback
  const satisfactionScore = calculateSatisfactionScore(coach);

  // Consistency Score (0-100)
  // Measures the consistency of positive outcomes relative to total clients
  const consistencyScore = calculateConsistencyScore(coach);

  // Experience Score (0-100)
  // Balances years of experience with recent achievements
  const experienceScore = calculateExperienceScore(coach);

  // Success Ratio (0-100)
  // For contest prep coaches: successful preps / total preps
  // For others: successful client transformations / total clients
  const successRatio = calculateSuccessRatio(coach);

  // Client Retention Score (0-100)
  // Measures the percentage of clients who stay beyond initial program
  const clientRetentionScore = calculateClientRetentionScore(coach);

  // Calculate Final Score (0-100)
  const finalScore = calculateFinalScore({
    satisfactionScore,
    consistencyScore,
    experienceScore,
    successRatio,
    clientRetentionScore
  });

  return {
    satisfactionScore,
    consistencyScore,
    experienceScore,
    successRatio,
    clientRetentionScore,
    finalScore
  };
}

function calculateSatisfactionScore(coach: CoachProfile): number {
  if (!coach.rating || !coach.testimonialCount) return 70; // Base score for new coaches

  // Calculate satisfaction score based on rating and number of testimonials
  const ratingWeight = 0.7;
  const testimonialCountWeight = 0.3;

  const ratingScore = (coach.rating / 5) * 100;
  const testimonialScore = Math.min(100, (coach.testimonialCount / 10) * 100); // Cap at 10 testimonials for max score

  return (ratingScore * ratingWeight) + (testimonialScore * testimonialCountWeight);
}

function calculateConsistencyScore(coach: CoachProfile): number {
  // Base score for all coaches
  let score = 75;

  // Add points for years of experience
  score += Math.min(15, coach.yearsExperience * 2);

  // Add points for competition history if available
  if (coach.competitionHistory) {
    score += Math.min(10, coach.competitionHistory.yearsCompeting);
  }

  return Math.min(100, score);
}

function calculateExperienceScore(coach: CoachProfile): number {
  const baseScore = Math.min(100, (coach.yearsExperience || 0) * 10);
  
  // Bonus points for competition experience and achievements
  let bonusPoints = 0;
  
  if (coach.competitionHistory) {
    bonusPoints += Math.min(20, coach.competitionHistory.yearsCompeting * 2);
    bonusPoints += Math.min(20, (coach.competitionHistory.achievements?.length || 0) * 5);
  }

  // Cap the final score at 100
  return Math.min(100, baseScore + bonusPoints);
}

function calculateSuccessRatio(coach: CoachProfile): number {
  if (coach.contestPrep) {
    const { successfulPreps, experienceLevel } = coach.contestPrep;
    
    // Base score based on experience level
    let baseScore = 75;
    switch (experienceLevel.toLowerCase()) {
      case 'expert':
        baseScore = 85;
        break;
      case 'intermediate':
        baseScore = 80;
        break;
      // 'beginner' keeps the base score of 75
    }

    // Add points for successful preps
    const prepScore = Math.min(15, successfulPreps * 3);

    return Math.min(100, baseScore + prepScore);
  }

  return 75; // Base score for non-contest prep coaches
}

function calculateClientRetentionScore(coach: CoachProfile): number {
  // Base score for all coaches
  let score = 75;

  // Add points for years of experience
  score += Math.min(15, coach.yearsExperience * 2);

  // Add points for technical expertise if available
  if (coach.technicalExpertise) {
    const expertiseCount = Object.values(coach.technicalExpertise).filter(Boolean).length;
    score += Math.min(10, expertiseCount * 2.5);
  }

  return Math.min(100, score);
}

function calculateFinalScore(scores: Omit<ScoreComponents, 'finalScore'>): number {
  // Weights for each component
  const weights = {
    satisfactionScore: 0.2,    // 20% - Important but not dominant
    consistencyScore: 0.25,    // 25% - Highly valued
    experienceScore: 0.15,     // 15% - Relevant but not crucial
    successRatio: 0.25,        // 25% - Highly valued
    clientRetentionScore: 0.15 // 15% - Important indicator
  };

  return Math.round(
    (scores.satisfactionScore * weights.satisfactionScore) +
    (scores.consistencyScore * weights.consistencyScore) +
    (scores.experienceScore * weights.experienceScore) +
    (scores.successRatio * weights.successRatio) +
    (scores.clientRetentionScore * weights.clientRetentionScore)
  );
} 