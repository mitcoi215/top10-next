// app/api/articles/[id]/route.ts
// GET /api/articles/:id - Get single article
// PUT /api/articles/:id - Update article
// DELETE /api/articles/:id - Delete article

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { ArticleUpdateSchema, formatZodErrors } from '@/lib/validations';
import { ZodError } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single article with full details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Try to find by ID first, then by slug
    let article = await prisma.article.findUnique({
      where: { id },
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
            slug: true,
            name: true,
            avatar: true,
            title: true,
            bio: true,
          },
        },
      },
    });

    // If not found by ID, try by slug
    if (!article) {
      article = await prisma.article.findUnique({
        where: { slug: id },
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
              slug: true,
              name: true,
              avatar: true,
              title: true,
              bio: true,
            },
          },
        },
      });
    }

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Fetch related products if productIds exist
    let relatedProducts = [];
    if (article.productIds && article.productIds.length > 0) {
      relatedProducts = await prisma.product.findMany({
        where: {
          id: { in: article.productIds },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          overallScore: true,
        },
      });
    }

    return NextResponse.json({
      ...article,
      relatedProducts,
    });
  } catch (error) {
    console.error('Get article error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// PUT - Update article (requires auth)
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

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Validate with Zod
    const validatedData = ArticleUpdateSchema.parse(body);

    // If slug is being changed, check for conflicts
    if (validatedData.slug && validatedData.slug !== existingArticle.slug) {
      const slugExists = await prisma.article.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'An article with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Auto-generate slug if title changed but slug is empty
    let finalSlug = validatedData.slug;
    if (validatedData.title && !validatedData.slug) {
      const newSlug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const slugExists = await prisma.article.findFirst({
        where: {
          slug: newSlug,
          id: { not: id },
        },
      });

      if (!slugExists) {
        finalSlug = newSlug;
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

    // If authorId is provided, verify it exists
    if (validatedData.authorId) {
      const author = await prisma.author.findUnique({
        where: { id: validatedData.authorId },
      });
      if (!author) {
        return NextResponse.json(
          { error: 'Author not found' },
          { status: 400 }
        );
      }
    }

    // Determine if we need to set publishedAt
    let publishedAt = undefined;
    if (validatedData.status === 'published' && existingArticle.status !== 'published') {
      publishedAt = new Date();
    }

    // Update article
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(finalSlug !== undefined && { slug: finalSlug }),
        ...(validatedData.title !== undefined && { title: validatedData.title }),
        ...(validatedData.subtitle !== undefined && { subtitle: validatedData.subtitle }),
        ...(validatedData.articleType !== undefined && { articleType: validatedData.articleType }),
        ...(validatedData.status !== undefined && { status: validatedData.status }),
        ...(validatedData.categoryId !== undefined && { categoryId: validatedData.categoryId }),
        ...(validatedData.authorId !== undefined && { authorId: validatedData.authorId }),
        ...(validatedData.featuredImage !== undefined && { featuredImage: validatedData.featuredImage }),
        ...(validatedData.featuredImageAlt !== undefined && { featuredImageAlt: validatedData.featuredImageAlt }),
        ...(validatedData.content !== undefined && { content: validatedData.content }),
        ...(validatedData.excerpt !== undefined && { excerpt: validatedData.excerpt }),
        ...(validatedData.productIds !== undefined && { productIds: validatedData.productIds }),
        ...(validatedData.breadcrumbs !== undefined && { breadcrumbs: validatedData.breadcrumbs }),
        ...(validatedData.metaTitle !== undefined && { metaTitle: validatedData.metaTitle }),
        ...(validatedData.metaDescription !== undefined && { metaDescription: validatedData.metaDescription }),
        ...(validatedData.ogImage !== undefined && { ogImage: validatedData.ogImage }),
        ...(validatedData.canonical !== undefined && { canonical: validatedData.canonical }),
        ...(publishedAt !== undefined && { publishedAt }),
      },
      include: {
        category: true,
        author: true,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Update article error:', error);

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
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE - Delete article (requires auth)
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

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
