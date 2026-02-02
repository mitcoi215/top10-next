// app/api/categories/[id]/route.ts
// GET /api/categories/:id - Get single category
// PUT /api/categories/:id - Update category (requires auth)
// DELETE /api/categories/:id - Delete category (requires auth)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { CategoryUpdateSchema, formatZodErrors } from '@/lib/validations';
import { ZodError } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single category with products
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Try to find by ID first, then by slug
    let category = await prisma.category.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatar: true,
            title: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            rank: true,
            logoUrl: true,
            status: true,
            overallScore: true,
            scoreLabel: true,
            bottomLine: true,
            ribbon: true,
            ctaUrl: true,
            ctaText: true,
            features: true,
            tagline: true,
            bestFor: true,
          },
          orderBy: { rank: 'asc' },
        },
        _count: {
          select: { products: true, articles: true },
        },
      },
    });

    // If not found by ID, try by slug
    if (!category) {
      category = await prisma.category.findUnique({
        where: { slug: id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              slug: true,
              avatar: true,
              title: true,
            },
          },
          products: {
            select: {
              id: true,
              name: true,
              slug: true,
              rank: true,
              logoUrl: true,
              status: true,
              overallScore: true,
              scoreLabel: true,
              bottomLine: true,
              ribbon: true,
              ctaUrl: true,
              ctaText: true,
              features: true,
              tagline: true,
              bestFor: true,
            },
            orderBy: { rank: 'asc' },
          },
          _count: {
            select: { products: true, articles: true },
          },
        },
      });
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT - Update category (requires auth)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Validate with Zod
    const validatedData = CategoryUpdateSchema.parse(body);

    // If slug is being changed, check for conflicts
    if (validatedData.slug && validatedData.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'A category with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Auto-generate slug if name changed but slug is empty/same
    let finalSlug = validatedData.slug;
    if (validatedData.name && !validatedData.slug) {
      const newSlug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      // Check if new slug is available
      const slugExists = await prisma.category.findFirst({
        where: {
          slug: newSlug,
          id: { not: id },
        },
      });

      if (!slugExists) {
        finalSlug = newSlug;
      }
    }

    // Update category with all fields
    const category = await prisma.category.update({
      where: { id },
      data: {
        // Basic Info
        ...(finalSlug !== undefined && { slug: finalSlug }),
        ...(validatedData.name !== undefined && { name: validatedData.name }),
        ...(validatedData.icon !== undefined && { icon: validatedData.icon }),
        ...(validatedData.color !== undefined && { color: validatedData.color }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),

        // Display settings
        ...(validatedData.featured !== undefined && { featured: validatedData.featured }),
        ...(validatedData.order !== undefined && { order: validatedData.order }),

        // Author
        ...(validatedData.authorId !== undefined && {
          authorId: validatedData.authorId || null
        }),

        // Hero & Intro
        ...(validatedData.heroImage !== undefined && { heroImage: validatedData.heroImage }),
        ...(validatedData.heroTitle !== undefined && { heroTitle: validatedData.heroTitle }),
        ...(validatedData.introContent !== undefined && { introContent: validatedData.introContent }),

        // JSON fields - Criteria & Highlights
        ...(validatedData.criteriaDefinitions !== undefined && { criteriaDefinitions: validatedData.criteriaDefinitions }),
        ...(validatedData.highlightDefinitions !== undefined && { highlightDefinitions: validatedData.highlightDefinitions }),

        // Methodology
        ...(validatedData.methodologyIntro !== undefined && { methodologyIntro: validatedData.methodologyIntro }),
        ...(validatedData.methodologyCriteria !== undefined && { methodologyCriteria: validatedData.methodologyCriteria }),
        ...(validatedData.exploreCards !== undefined && { exploreCards: validatedData.exploreCards }),

        // Bottom Content (above FAQ)
        ...(validatedData.bottomContent !== undefined && { bottomContent: validatedData.bottomContent }),

        // Additional Content (below Bottom Content)
        ...(validatedData.additionalContent !== undefined && { additionalContent: validatedData.additionalContent }),

        // Review List Page
        ...(validatedData.reviewListIntro !== undefined && { reviewListIntro: validatedData.reviewListIntro }),
        ...(validatedData.reviewListHeroImage !== undefined && { reviewListHeroImage: validatedData.reviewListHeroImage }),
        ...(validatedData.tenThingsToKnow !== undefined && { tenThingsToKnow: validatedData.tenThingsToKnow }),
        ...(validatedData.mustReadArticleIds !== undefined && { mustReadArticleIds: validatedData.mustReadArticleIds }),

        // FAQs
        ...(validatedData.faqs !== undefined && { faqs: validatedData.faqs }),

        // Comparison Page - Hero
        ...(validatedData.comparisonTitle !== undefined && { comparisonTitle: validatedData.comparisonTitle }),
        ...(validatedData.comparisonSubtitle !== undefined && { comparisonSubtitle: validatedData.comparisonSubtitle }),
        ...(validatedData.comparisonHeroImage !== undefined && { comparisonHeroImage: validatedData.comparisonHeroImage }),

        // Comparison Page - Top 3 Bar
        ...(validatedData.comparisonTop3Enabled !== undefined && { comparisonTop3Enabled: validatedData.comparisonTop3Enabled }),
        ...(validatedData.comparisonTop3Title !== undefined && { comparisonTop3Title: validatedData.comparisonTop3Title }),
        ...(validatedData.comparisonTop3ProductIds !== undefined && { comparisonTop3ProductIds: validatedData.comparisonTop3ProductIds }),
        ...(validatedData.comparisonTop3Ribbon !== undefined && { comparisonTop3Ribbon: validatedData.comparisonTop3Ribbon }),

        // Comparison Page - Right Sidebar
        ...(validatedData.comparisonRightSidebarEnabled !== undefined && { comparisonRightSidebarEnabled: validatedData.comparisonRightSidebarEnabled }),
        ...(validatedData.comparisonRightSidebarProductId !== undefined && { comparisonRightSidebarProductId: validatedData.comparisonRightSidebarProductId || null }),

        // Comparison Page - Left Sidebar
        ...(validatedData.comparisonLeftSidebarEnabled !== undefined && { comparisonLeftSidebarEnabled: validatedData.comparisonLeftSidebarEnabled }),
        ...(validatedData.comparisonSocialProofCount !== undefined && { comparisonSocialProofCount: validatedData.comparisonSocialProofCount }),
        ...(validatedData.comparisonScoreBreakdown !== undefined && { comparisonScoreBreakdown: validatedData.comparisonScoreBreakdown }),

        // Comparison Page - Below FAQ Content
        ...(validatedData.comparisonBelowFaqContent !== undefined && { comparisonBelowFaqContent: validatedData.comparisonBelowFaqContent }),

        // SEO
        ...(validatedData.metaTitle !== undefined && { metaTitle: validatedData.metaTitle }),
        ...(validatedData.metaDescription !== undefined && { metaDescription: validatedData.metaDescription }),
        ...(validatedData.ogImage !== undefined && { ogImage: validatedData.ogImage }),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Update category error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formatZodErrors(error),
        },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : 'Failed to update category';
    return NextResponse.json(
      { error: 'Failed to update category', message },
      { status: 500 }
    );
  }
}

// DELETE - Delete category (requires auth)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if category exists and has products
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Prevent deletion if category has products
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category with ${existingCategory._count.products} products. Please move or delete products first.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
