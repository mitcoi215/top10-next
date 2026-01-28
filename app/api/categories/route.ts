// app/api/categories/route.ts
// GET /api/categories - Get all categories
// POST /api/categories - Create new category (requires auth)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { CategoryCreateSchema, formatZodErrors } from '@/lib/validations';
import { ZodError } from 'zod';

// GET - Get all categories with product count
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    const categories = await prisma.category.findMany({
      where: featured === 'true' ? { featured: true } : undefined,
      orderBy: [
        { order: 'asc' },
        { name: 'asc' },
      ],
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create new category (requires auth)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate with Zod
    const validatedData = CategoryCreateSchema.parse(body);

    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    // Create category with all fields
    const category = await prisma.category.create({
      data: {
        // Basic Info
        slug: validatedData.slug,
        name: validatedData.name,
        icon: validatedData.icon,
        color: validatedData.color,
        description: validatedData.description,

        // Display settings
        featured: validatedData.featured,
        order: validatedData.order,

        // Hero & Intro
        heroImage: validatedData.heroImage,
        heroTitle: validatedData.heroTitle,
        introContent: validatedData.introContent,

        // JSON fields - Criteria & Highlights
        criteriaDefinitions: validatedData.criteriaDefinitions,
        highlightDefinitions: validatedData.highlightDefinitions,

        // Methodology
        methodologyIntro: validatedData.methodologyIntro,
        methodologyCriteria: validatedData.methodologyCriteria,
        exploreCards: validatedData.exploreCards,

        // Review List Page
        reviewListIntro: validatedData.reviewListIntro,
        reviewListHeroImage: validatedData.reviewListHeroImage,
        tenThingsToKnow: validatedData.tenThingsToKnow,
        mustReadArticleIds: validatedData.mustReadArticleIds,

        // FAQs
        faqs: validatedData.faqs,

        // SEO
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,
        ogImage: validatedData.ogImage,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formatZodErrors(error),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
