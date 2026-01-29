// app/api/settings/route.ts
// GET /api/settings - Get homepage settings (singleton)
// PUT /api/settings - Update homepage settings (requires auth)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { HomepageSettingsSchema, formatZodErrors } from '@/lib/validations';
import { ZodError } from 'zod';

// GET - Get homepage settings (create if not exists)
export async function GET() {
  try {
    // Find the singleton settings record (or create one)
    let settings = await prisma.homepageSettings.findFirst();

    if (!settings) {
      // Create default settings
      settings = await prisma.homepageSettings.create({
        data: {
          heroTitle: 'Find the Best Products & Services',
          heroSubtitle: 'Expert reviews and comparisons to help you make informed decisions',
          featuredGroupIds: [],
          trendingItems: [],
          statsListsCount: '500+',
          statsHoursCount: '5,000+',
          statsDecisionsCount: '16M+',
          expertIds: [],
          missionTitle: 'Our Mission',
          missionContent: 'We help millions of people make better decisions every day.',
          brandLogos: [],
          moreArticleIds: [],
        },
      });
    }

    // Map featuredGroupIds to featuredCategoryIds for frontend compatibility
    const response = {
      ...settings,
      featuredCategoryIds: settings.featuredGroupIds || [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT - Update homepage settings (requires auth)
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate with Zod
    const validatedData = HomepageSettingsSchema.parse(body);

    // Find existing settings or create new
    let settings = await prisma.homepageSettings.findFirst();

    if (settings) {
      // Update existing
      settings = await prisma.homepageSettings.update({
        where: { id: settings.id },
        data: {
          ...(validatedData.heroTagline !== undefined && { heroTagline: validatedData.heroTagline }),
          ...(validatedData.heroTitle !== undefined && { heroTitle: validatedData.heroTitle }),
          ...(validatedData.heroSubtitle !== undefined && { heroSubtitle: validatedData.heroSubtitle }),
          ...(validatedData.featuredCategoryIds !== undefined && { featuredGroupIds: validatedData.featuredCategoryIds }),
          ...(validatedData.trendingItems !== undefined && { trendingItems: validatedData.trendingItems }),
          ...(validatedData.statsListsCount !== undefined && { statsListsCount: validatedData.statsListsCount }),
          ...(validatedData.statsHoursCount !== undefined && { statsHoursCount: validatedData.statsHoursCount }),
          ...(validatedData.statsDecisionsCount !== undefined && { statsDecisionsCount: validatedData.statsDecisionsCount }),
          ...(validatedData.expertIds !== undefined && { expertIds: validatedData.expertIds }),
          ...(validatedData.missionTitle !== undefined && { missionTitle: validatedData.missionTitle }),
          ...(validatedData.missionContent !== undefined && { missionContent: validatedData.missionContent }),
          ...(validatedData.brandLogos !== undefined && { brandLogos: validatedData.brandLogos }),
          ...(validatedData.moreArticleIds !== undefined && { moreArticleIds: validatedData.moreArticleIds }),
        },
      });
    } else {
      // Create new
      settings = await prisma.homepageSettings.create({
        data: {
          heroTagline: validatedData.heroTagline,
          heroTitle: validatedData.heroTitle,
          heroSubtitle: validatedData.heroSubtitle,
          featuredGroupIds: validatedData.featuredCategoryIds || [],
          trendingItems: validatedData.trendingItems || [],
          statsListsCount: validatedData.statsListsCount,
          statsHoursCount: validatedData.statsHoursCount,
          statsDecisionsCount: validatedData.statsDecisionsCount,
          expertIds: validatedData.expertIds || [],
          missionTitle: validatedData.missionTitle,
          missionContent: validatedData.missionContent,
          brandLogos: validatedData.brandLogos || [],
          moreArticleIds: validatedData.moreArticleIds || [],
        },
      });
    }

    // Map featuredGroupIds to featuredCategoryIds for frontend compatibility
    const response = {
      ...settings,
      featuredCategoryIds: settings.featuredGroupIds || [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update settings error:', error);

    if (error instanceof ZodError) {
      const details = formatZodErrors(error);
      console.error('Validation details:', JSON.stringify(details, null, 2));
      console.error('Zod issues:', JSON.stringify(error.issues, null, 2));
      return NextResponse.json(
        {
          error: 'Validation failed',
          details,
          issues: error.issues,
        },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Server error details:', errorMessage, errorStack);
    return NextResponse.json(
      { error: 'Failed to update settings', message: errorMessage },
      { status: 500 }
    );
  }
}
