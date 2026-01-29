// app/api/homepage/route.ts
// API route to fetch homepage data

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch homepage settings
    const settings = await prisma.homepageSettings.findFirst();

    // Fetch category groups with their categories
    const categoryGroups = await prisma.categoryGroup.findMany({
      orderBy: { order: 'asc' },
      include: {
        categories: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            slug: true,
            name: true,
            icon: true,
            exploreHref: true,
            compareHref: true,
          },
        },
      },
    });

    // Fetch experts (authors)
    let experts: any[] = [];
    if (settings?.expertIds && settings.expertIds.length > 0) {
      experts = await prisma.author.findMany({
        where: { id: { in: settings.expertIds } },
        select: {
          id: true,
          slug: true,
          name: true,
          avatar: true,
          title: true,
        },
      });
    }

    // Fetch more articles
    let moreArticles: any[] = [];
    if (settings?.moreArticleIds && settings.moreArticleIds.length > 0) {
      moreArticles = await prisma.article.findMany({
        where: { id: { in: settings.moreArticleIds } },
        select: {
          id: true,
          slug: true,
          title: true,
          featuredImage: true,
          category: {
            select: { slug: true },
          },
        },
      });
    }

    return NextResponse.json({
      settings: settings || {},
      categoryGroups,
      experts,
      moreArticles,
    });
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage data' },
      { status: 500 }
    );
  }
}
