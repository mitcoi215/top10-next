// app/api/category-groups/route.ts
// GET /api/category-groups - Get all category groups
// POST /api/category-groups - Create new category group (requires auth)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET - Get all category groups with their categories
export async function GET() {
  try {
    const groups = await prisma.categoryGroup.findMany({
      orderBy: { order: 'asc' },
      include: {
        categories: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
    });

    return NextResponse.json(groups);
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
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name if not provided
    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug already exists
    const existing = await prisma.categoryGroup.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Category group with this slug already exists' },
        { status: 400 }
      );
    }

    // Get max order
    const maxOrder = await prisma.categoryGroup.aggregate({
      _max: { order: true },
    });

    const group = await prisma.categoryGroup.create({
      data: {
        name: body.name,
        slug,
        icon: body.icon || null,
        order: body.order ?? (maxOrder._max.order || 0) + 1,
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error('Create category group error:', error);
    return NextResponse.json(
      { error: 'Failed to create category group' },
      { status: 500 }
    );
  }
}
