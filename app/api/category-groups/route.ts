// app/api/category-groups/route.ts
// GET /api/category-groups - Get all category groups
// POST /api/category-groups - Create new category group (requires auth)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET - Get all category groups with their categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeCategories = searchParams.get('include') === 'categories';

    const categoryGroups = await prisma.categoryGroup.findMany({
      orderBy: { order: 'asc' },
      include: includeCategories
        ? {
            categories: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                slug: true,
                name: true,
                icon: true,
                color: true,
                description: true,
                featured: true,
              },
            },
          }
        : undefined,
    });

    return NextResponse.json(categoryGroups);
  } catch (error) {
    console.error('Get category groups error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category groups' },
      { status: 500 }
    );
  }
}

// POST - Create new category group (requires auth)
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

    // Basic validation
    if (!body.slug || !body.name) {
      return NextResponse.json(
        { error: 'Slug and name are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.categoryGroup.findUnique({
      where: { slug: body.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A category group with this slug already exists' },
        { status: 400 }
      );
    }

    // Create category group
    const categoryGroup = await prisma.categoryGroup.create({
      data: {
        slug: body.slug,
        name: body.name,
        icon: body.icon || null,
        order: body.order || 0,
      },
    });

    return NextResponse.json(categoryGroup, { status: 201 });
  } catch (error) {
    console.error('Create category group error:', error);
    return NextResponse.json(
      { error: 'Failed to create category group' },
      { status: 500 }
    );
  }
}
