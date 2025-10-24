import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile, getDashboardData } from '@/lib/server/auth';
import { DashboardApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      );
    }

    // Fetch user profile and dashboard data
    const [userProfile, dashboardData] = await Promise.all([
      getUserProfile(token),
      getDashboardData(token)
    ]);

    if (!userProfile) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const response: DashboardApiResponse = {
      success: true,
      userProfile,
      dashboardData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
