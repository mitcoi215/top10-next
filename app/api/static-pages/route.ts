import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    const pages = await prisma.staticPage.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, slug: true, title: true, description: true, updatedAt: true },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Get static pages error:', error);
    return NextResponse.json({ error: 'Failed to fetch static pages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    if (!body.slug || !body.title) {
      return NextResponse.json({ error: 'Slug and title are required' }, { status: 400 });
    }

    const existing = await prisma.staticPage.findUnique({ where: { slug: body.slug } });
    if (existing) {
      return NextResponse.json({ error: 'Page with this slug already exists' }, { status: 400 });
    }

    const page = await prisma.staticPage.create({
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description || null,
        content: body.content || '',
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Create static page error:', error);
    return NextResponse.json({ error: 'Failed to create static page' }, { status: 500 });
  }
}
