// app/api/articles/route.ts
// GET /api/articles - Get all articles (for selection in editors)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET - Get all articles (minimal data for selectors)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');

    let whereClause: any = {};

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (status && (status === 'draft' || status === 'published')) {
      whereClause.status = status;
    }

    const articles = await prisma.article.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        articleType: true,
        status: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Get articles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
