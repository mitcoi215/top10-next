// app/api/products/route.ts
// GET /api/products - Get all products (with optional category filter)
// POST /api/products - Create new product (requires auth)

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET - Get all products (with optional category filter)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const categorySlug = searchParams.get('category');

    let whereClause = {};

    if (categoryId) {
      whereClause = { categoryId };
    } else if (categorySlug) {
      // Find category by slug first
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });
      if (category) {
        whereClause = { categoryId: category.id };
      }
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
export async function POST(request: Request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      rank,
      title,
      description,
      detailedDescription,
      image,
      rating,
      price,
      features,
      pros,
      cons,
      affiliateLink,
      featured,
      categoryId,
    } = body;

    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { error: 'Title, description, and categoryId are required' },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        rank: rank || 1,
        title,
        description,
        detailedDescription: detailedDescription || null,
        image: image || '/top10/1.jpg',
        rating: rating || null,
        price: price || null,
        features: features || [],
        pros: pros || [],
        cons: cons || [],
        affiliateLink: affiliateLink || '',
        featured: featured || false,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
