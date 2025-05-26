import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/services/StripeService';
import { getCoachByStripeAccount } from '@/lib/firebase/firebaseUtils';
import type { CoachData } from '@/lib/firebase/coachUtils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') as '7d' | '30d' | '90d' | 'all';
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Missing accountId parameter' },
        { status: 400 }
      );
    }

    // Get coach data
    const coachData = await getCoachByStripeAccount(accountId);
    if (!coachData) {
      return NextResponse.json(
        { error: 'Coach not found' },
        { status: 404 }
      );
    }

    const coach = {
      id: coachData.userId,
      name: coachData.name,
      trainingStyle: coachData.trainingStyle,
      responseTime: coachData.responseTime,
      rating: 0,
      testimonialCount: 0,
      credentials: coachData.credentials,
      yearsExperience: coachData.experience,
      specialties: coachData.specialties,
      coachingModality: '',
      location: {
        address: `${coachData.location.city}, ${coachData.location.state}`,
        lat: 0,
        lng: 0
      },
      divisions: [],
      clientTypes: [],
      federations: [],
      bio: coachData.bio,
      profileImageUrl: coachData.avatar,
      userId: coachData.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      listings: [] as Array<{ title: string; stripePriceId: string; active: boolean }>
    };

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
    }

    // Get Stripe data
    const [balance, charges] = await Promise.all([
      StripeService.getAccountBalance(accountId),
      StripeService.listCharges(accountId, startDate)
    ]);

    // Calculate summary
    const totalEarnings = balance.available[0].amount + balance.pending[0].amount;
    const periodCharges = charges.filter(charge => 
      new Date(charge.created * 1000) >= startDate
    );
    const periodEarnings = periodCharges.reduce((sum, charge) => 
      sum + (charge.amount - (charge.application_fee_amount || 0)), 0
    );
    const totalSales = charges.length;
    const activeSubscribers = coach.listings.reduce((sum, listing) => 
      sum + (listing.active ? 1 : 0), 0
    );

    // Generate sales data
    const salesByDate = new Map<string, { amount: number; sales: number }>();
    periodCharges.forEach(charge => {
      const date = new Date(charge.created * 1000).toISOString().split('T')[0];
      const existing = salesByDate.get(date) || { amount: 0, sales: 0 };
      salesByDate.set(date, {
        amount: existing.amount + (charge.amount - (charge.application_fee_amount || 0)),
        sales: existing.sales + 1
      });
    });

    const salesData = Array.from(salesByDate.entries()).map(([date, data]) => ({
      date,
      ...data
    }));

    // Calculate package stats
    const packageStats = coach.listings.map(listing => {
      const listingCharges = charges.filter(charge => 
        charge.metadata.priceId === listing.stripePriceId
      );
      return {
        name: listing.title,
        sales: listingCharges.length,
        revenue: listingCharges.reduce((sum, charge) => 
          sum + (charge.amount - (charge.application_fee_amount || 0)), 0
        )
      };
    });

    return NextResponse.json({
      summary: {
        totalEarnings,
        periodEarnings,
        totalSales,
        activeSubscribers
      },
      salesData: salesData.sort((a, b) => a.date.localeCompare(b.date)),
      packageStats
    });
  } catch (err) {
    console.error('Error fetching earnings:', err);
    return NextResponse.json(
      { error: 'Failed to fetch earnings data' },
      { status: 500 }
    );
  }
} 