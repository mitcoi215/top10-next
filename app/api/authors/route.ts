// app/api/authors/route.ts
// GET /api/authors - Get all authors
// POST /api/authors - Create new author (requires auth)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET - Get all authors
export async function GET(request: NextRequest) {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        slug: true,
        name: true,
        avatar: true,
        title: true,
        bio: true,
        socialLinks: true,
        _count: {
          select: { articles: true },
        },
      },
    });

    // Transform socialLinks JSON to flat fields for frontend
    const transformedAuthors = authors.map((author) => {
      const socialLinks = author.socialLinks as Record<string, string> | null;
      return {
        ...author,
        twitter: socialLinks?.twitter || null,
        linkedin: socialLinks?.linkedin || null,
        website: socialLinks?.website || null,
        email: socialLinks?.email || null,
      };
    });

    return NextResponse.json(transformedAuthors);
  } catch (error) {
    console.error('Get authors error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}

// POST - Create new author (requires auth)
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
    const existingAuthor = await prisma.author.findUnique({
      where: { slug },
    });

    if (existingAuthor) {
      return NextResponse.json(
        { error: 'Author with this slug already exists' },
        { status: 400 }
      );
    }

    // Build socialLinks from separate fields or use existing socialLinks object
    let socialLinks = body.socialLinks || null;
    if (!socialLinks && (body.twitter || body.linkedin || body.website || body.email)) {
      socialLinks = {
        ...(body.twitter && { twitter: body.twitter }),
        ...(body.linkedin && { linkedin: body.linkedin }),
        ...(body.website && { website: body.website }),
        ...(body.email && { email: body.email }),
      };
    }

    const author = await prisma.author.create({
      data: {
        name: body.name,
        slug,
        avatar: body.avatar || null,
        title: body.title || null,
        bio: body.bio || null,
        socialLinks,
      },
    });

    // Return with flat social link fields for frontend
    const transformedAuthor = {
      ...author,
      twitter: (socialLinks as Record<string, string> | null)?.twitter || null,
      linkedin: (socialLinks as Record<string, string> | null)?.linkedin || null,
      website: (socialLinks as Record<string, string> | null)?.website || null,
      email: (socialLinks as Record<string, string> | null)?.email || null,
    };

    return NextResponse.json(transformedAuthor, { status: 201 });
  } catch (error) {
    console.error('Create author error:', error);
    return NextResponse.json(
      { error: 'Failed to create author' },
      { status: 500 }
    );
  }
}
