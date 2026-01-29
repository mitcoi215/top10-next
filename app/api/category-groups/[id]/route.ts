// app/api/category-groups/[id]/route.ts
// GET /api/category-groups/:id - Get single category group
// PUT /api/category-groups/:id - Update category group (requires auth)
// DELETE /api/category-groups/:id - Delete category group (requires auth)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET - Get single category group
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const group = await prisma.categoryGroup.findUnique({
      where: { id },
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

    if (!group) {
      return NextResponse.json(
        { error: 'Category group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error('Get category group error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category group' },
      { status: 500 }
    );
  }
}

// PUT - Update category group (requires auth)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Check if group exists
    const existing = await prisma.categoryGroup.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Category group not found' },
        { status: 404 }
      );
    }

    // Update group with provided fields
    const group = await prisma.categoryGroup.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.slug !== undefined && { slug: body.slug }),
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error('Update category group error:', error);
    return NextResponse.json(
      { error: 'Failed to update category group' },
      { status: 500 }
    );
  }
}

// DELETE - Delete category group (requires auth)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if group exists
    const existing = await prisma.categoryGroup.findUnique({
      where: { id },
      include: { categories: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Category group not found' },
        { status: 404 }
      );
    }

    // Check if has categories
    if (existing.categories.length > 0) {
      return NextResponse.json(
        { error: `Cannot delete group with ${existing.categories.length} categories. Move or delete categories first.` },
        { status: 400 }
      );
    }

    // Delete group
    await prisma.categoryGroup.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Category group deleted' });
  } catch (error) {
    console.error('Delete category group error:', error);
    return NextResponse.json(
      { error: 'Failed to delete category group' },
      { status: 500 }
    );
  }
}
