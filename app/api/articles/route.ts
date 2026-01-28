// app/api/articles/route.ts
// GET /api/articles - Get all articles
// POST /api/articles - Create new article

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { ArticleCreateSchema, formatZodErrors } from '@/lib/validations';
import { ZodError } from 'zod';

// GET - Get all articles with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');
    const articleType = searchParams.get('type');
    const authorId = searchParams.get('authorId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (status && (status === 'draft' || status === 'published')) {
      whereClause.status = status;
    }

    if (articleType && ['charticle', 'blog', 'guide'].includes(articleType)) {
      whereClause.articleType = articleType;
    }

    if (authorId) {
      whereClause.authorId = authorId;
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          slug: true,
          subtitle: true,
          articleType: true,
          status: true,
          featuredImage: true,
          excerpt: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
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
          createdAt: true,
          updatedAt: true,
          publishedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.article.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get articles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST - Create new article (requires auth)
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
    const validatedData = ArticleCreateSchema.parse(body);

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: 'An article with this slug already exists' },
        { status: 400 }
      );
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

    // Create article
    const article = await prisma.article.create({
      data: {
        slug: validatedData.slug,
        title: validatedData.title,
        subtitle: validatedData.subtitle,
        articleType: validatedData.articleType,
        status: validatedData.status,
        categoryId: validatedData.categoryId,
        authorId: validatedData.authorId,
        featuredImage: validatedData.featuredImage,
        featuredImageAlt: validatedData.featuredImageAlt,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        productIds: validatedData.productIds || [],
        breadcrumbs: validatedData.breadcrumbs,
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,
        ogImage: validatedData.ogImage,
        canonical: validatedData.canonical,
        publishedAt: validatedData.status === 'published' ? new Date() : null,
      },
      include: {
        category: true,
        author: true,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Create article error:', error);

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
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
