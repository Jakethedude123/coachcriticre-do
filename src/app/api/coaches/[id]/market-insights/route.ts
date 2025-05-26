import { NextResponse } from 'next/server';
import { getCoach } from '@/lib/firebase/firebaseUtils';
import { Coach } from '@/lib/firebase/models/coach';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const coach = await getCoach(params.id);
    
    if (!coach) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }

    // Calculate market insights based on coach data
    const insights = {
      demand: calculateDemandScore(coach),
      competition: calculateCompetitionScore(coach),
      pricing: calculatePricingScore(coach),
      recommendations: generateRecommendations(coach)
    };

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error fetching market insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market insights' },
      { status: 500 }
    );
  }
}

// Helper functions for calculating insights
function calculateDemandScore(coach: Coach): number {
  // Implement demand score calculation
  return 0;
}

function calculateCompetitionScore(coach: Coach): number {
  // Implement competition score calculation
  return 0;
}

function calculatePricingScore(coach: Coach): number {
  // Implement pricing score calculation
  return 0;
}

function generateRecommendations(coach: Coach): string[] {
  // Implement recommendation generation
  return [];
} 