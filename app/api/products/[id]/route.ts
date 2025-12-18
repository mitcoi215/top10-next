// app/api/products/[id]/route.ts
// GET /api/products/:id - Get single product
// PUT /api/products/:id - Update product (requires auth)
// DELETE /api/products/:id - Delete product (requires auth)

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single product
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

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
export async function PUT(request: Request, { params }: RouteParams) {
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

    // If categoryId is provided, verify it exists
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(rank !== undefined && { rank }),
        ...(title && { title }),
        ...(description && { description }),
        ...(detailedDescription !== undefined && { detailedDescription }),
        ...(image && { image }),
        ...(rating !== undefined && { rating }),
        ...(price !== undefined && { price }),
        ...(features && { features }),
        ...(pros && { pros }),
        ...(cons && { cons }),
        ...(affiliateLink !== undefined && { affiliateLink }),
        ...(featured !== undefined && { featured }),
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product (requires auth)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
