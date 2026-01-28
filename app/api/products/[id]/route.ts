// app/api/products/[id]/route.ts
// GET /api/products/:id - Get single product
// PUT /api/products/:id - Update product (requires auth)
// DELETE /api/products/:id - Delete product (requires auth)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { ProductUpdateSchema, formatZodErrors } from '@/lib/validations';
import { ZodError } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single product with full details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Try to find by ID first, then by slug
    let product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            name: true,
            icon: true,
            criteriaDefinitions: true,
            highlightDefinitions: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            title: true,
          },
        },
      },
    });

    // If not found by ID, try by slug
    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: id },
        include: {
          category: {
            select: {
              id: true,
              slug: true,
              name: true,
              icon: true,
              criteriaDefinitions: true,
              highlightDefinitions: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
              title: true,
            },
          },
        },
      });
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - Update product (requires auth)
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

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Validate with Zod
    const validatedData = ProductUpdateSchema.parse(body);

    // If slug is being changed, check for conflicts
    if (validatedData.slug && validatedData.slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'A product with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // If categoryId is provided, verify it exists
    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId },
      });
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 400 }
        );
      }
    }

    // Update product with all fields
    const product = await prisma.product.update({
      where: { id },
      data: {
        // Basic Info
        ...(validatedData.slug !== undefined && { slug: validatedData.slug }),
        ...(validatedData.name !== undefined && { name: validatedData.name }),
        ...(validatedData.logoUrl !== undefined && { logoUrl: validatedData.logoUrl }),
        ...(validatedData.ctaUrl !== undefined && { ctaUrl: validatedData.ctaUrl }),
        ...(validatedData.ctaText !== undefined && { ctaText: validatedData.ctaText }),
        ...(validatedData.reviewHref !== undefined && { reviewHref: validatedData.reviewHref }),
        ...(validatedData.status !== undefined && { status: validatedData.status }),
        ...(validatedData.categoryId !== undefined && { categoryId: validatedData.categoryId }),
        ...(validatedData.authorId !== undefined && { authorId: validatedData.authorId }),

        // Category Listing Data
        ...(validatedData.rank !== undefined && { rank: validatedData.rank }),
        ...(validatedData.ribbon !== undefined && { ribbon: validatedData.ribbon }),
        ...(validatedData.tagline !== undefined && { tagline: validatedData.tagline }),
        ...(validatedData.bottomLine !== undefined && { bottomLine: validatedData.bottomLine }),
        ...(validatedData.bestFor !== undefined && { bestFor: validatedData.bestFor }),
        ...(validatedData.basePrice !== undefined && { basePrice: validatedData.basePrice }),

        // Scores
        ...(validatedData.overallScore !== undefined && { overallScore: validatedData.overallScore }),
        ...(validatedData.scoreLabel !== undefined && { scoreLabel: validatedData.scoreLabel }),
        ...(validatedData.scores !== undefined && { scores: validatedData.scores }),
        ...(validatedData.highlights !== undefined && { highlights: validatedData.highlights }),
        ...(validatedData.features !== undefined && { features: validatedData.features }),
        ...(validatedData.quote !== undefined && { quote: validatedData.quote }),

        // Review Content
        ...(validatedData.reviewTitle !== undefined && { reviewTitle: validatedData.reviewTitle }),
        ...(validatedData.reviewSubtitle !== undefined && { reviewSubtitle: validatedData.reviewSubtitle }),
        ...(validatedData.reviewHeroImage !== undefined && { reviewHeroImage: validatedData.reviewHeroImage }),
        ...(validatedData.rating !== undefined && { rating: validatedData.rating }),
        ...(validatedData.reviewCount !== undefined && { reviewCount: validatedData.reviewCount }),
        ...(validatedData.heroSummary !== undefined && { heroSummary: validatedData.heroSummary }),
        ...(validatedData.pros !== undefined && { pros: validatedData.pros }),
        ...(validatedData.cons !== undefined && { cons: validatedData.cons }),
        ...(validatedData.mainContent !== undefined && { mainContent: validatedData.mainContent }),
        ...(validatedData.verdict !== undefined && { verdict: validatedData.verdict }),
        ...(validatedData.images !== undefined && { images: validatedData.images }),

        // FAQ & Extras
        ...(validatedData.faqs !== undefined && { faqs: validatedData.faqs }),
        ...(validatedData.userRatings !== undefined && { userRatings: validatedData.userRatings }),
        ...(validatedData.relatedProductIds !== undefined && { relatedProductIds: validatedData.relatedProductIds }),

        // SEO
        ...(validatedData.metaTitle !== undefined && { metaTitle: validatedData.metaTitle }),
        ...(validatedData.metaDescription !== undefined && { metaDescription: validatedData.metaDescription }),
        ...(validatedData.ogImage !== undefined && { ogImage: validatedData.ogImage }),
        ...(validatedData.canonical !== undefined && { canonical: validatedData.canonical }),
      },
      include: {
        category: true,
        author: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Update product error:', error);

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
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product (requires auth)
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

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
