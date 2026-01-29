// app/api/products/route.ts
// GET /api/products - Get all products (with optional category filter)
// POST /api/products - Create new product (requires auth)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { ProductCreateSchema, formatZodErrors } from '@/lib/validations';
import { ZodError } from 'zod';

// GET - Get all products (with optional category filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const categorySlug = searchParams.get('category');
    const status = searchParams.get('status');

    let whereClause: any = {};

    // Filter by category
    if (categoryId) {
      whereClause.categoryId = categoryId;
    } else if (categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });
      if (category) {
        whereClause.categoryId = category.id;
      }
    }

    // Filter by status
    if (status && (status === 'draft' || status === 'published')) {
      whereClause.status = status;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { rank: 'asc' },
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            name: true,
            icon: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new product (requires auth)
export async function POST(request: NextRequest) {
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
    const validatedData = ProductCreateSchema.parse(body);

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    // Create product with all fields
    const product = await prisma.product.create({
      data: {
        // Basic Info
        slug: validatedData.slug,
        name: validatedData.name,
        logoUrl: validatedData.logoUrl,
        ctaUrl: validatedData.ctaUrl,
        ctaText: validatedData.ctaText,
        reviewHref: validatedData.reviewHref,
        status: validatedData.status,
        categoryId: validatedData.categoryId,
        authorId: validatedData.authorId,

        // Category Listing Data
        rank: validatedData.rank,
        ribbon: validatedData.ribbon,
        tagline: validatedData.tagline,
        bottomLine: validatedData.bottomLine,
        bestFor: validatedData.bestFor,
        basePrice: validatedData.basePrice,

        // Scores
        overallScore: validatedData.overallScore,
        scoreLabel: validatedData.scoreLabel,
        scores: validatedData.scores,
        highlights: validatedData.highlights,
        features: validatedData.features,
        quote: validatedData.quote,

        // Review Content
        reviewTitle: validatedData.reviewTitle,
        reviewSubtitle: validatedData.reviewSubtitle,
        reviewHeroImage: validatedData.reviewHeroImage,
        rating: validatedData.rating,
        reviewCount: validatedData.reviewCount,
        heroSummary: validatedData.heroSummary,
        videoUrl: validatedData.videoUrl,
        pros: validatedData.pros,
        cons: validatedData.cons,
        mainContent: validatedData.mainContent,
        verdict: validatedData.verdict,
        images: validatedData.images,

        // FAQ & Extras
        faqs: validatedData.faqs,
        userRatings: validatedData.userRatings,
        relatedProductIds: validatedData.relatedProductIds,

        // SEO
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,
        ogImage: validatedData.ogImage,
        canonical: validatedData.canonical,
      },
      include: {
        category: true,
        author: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);

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
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
