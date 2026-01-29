// app/api/authors/[id]/route.ts
// GET /api/authors/:id - Get single author
// PUT /api/authors/:id - Update author (requires auth)
// DELETE /api/authors/:id - Delete author (requires auth)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET - Get single author
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const author = await prisma.author.findUnique({
      where: { id },
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

    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    // Transform socialLinks JSON to flat fields for frontend
    const socialLinks = author.socialLinks as Record<string, string> | null;
    const transformedAuthor = {
      ...author,
      twitter: socialLinks?.twitter || null,
      linkedin: socialLinks?.linkedin || null,
      website: socialLinks?.website || null,
      email: socialLinks?.email || null,
    };

    return NextResponse.json(transformedAuthor);
  } catch (error) {
    console.error('Get author error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch author' },
      { status: 500 }
    );
  }
}

// PUT - Update author (requires auth)
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

    // Check if author exists
    const existingAuthor = await prisma.author.findUnique({
      where: { id },
    });

    if (!existingAuthor) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    // Build socialLinks from separate fields or use existing socialLinks object
    let socialLinks = body.socialLinks;
    if (socialLinks === undefined && (body.twitter !== undefined || body.linkedin !== undefined || body.website !== undefined || body.email !== undefined)) {
      // Get existing socialLinks to merge
      const existingSocialLinks = (existingAuthor.socialLinks as Record<string, string> | null) || {};
      socialLinks = {
        ...existingSocialLinks,
        ...(body.twitter !== undefined && { twitter: body.twitter || null }),
        ...(body.linkedin !== undefined && { linkedin: body.linkedin || null }),
        ...(body.website !== undefined && { website: body.website || null }),
        ...(body.email !== undefined && { email: body.email || null }),
      };
      // Clean up empty values
      Object.keys(socialLinks).forEach(key => {
        if (!socialLinks[key]) delete socialLinks[key];
      });
      if (Object.keys(socialLinks).length === 0) socialLinks = null;
    }

    // Update author with provided fields
    const author = await prisma.author.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.avatar !== undefined && { avatar: body.avatar }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(socialLinks !== undefined && { socialLinks }),
      },
    });

    // Return with flat social link fields for frontend
    const updatedSocialLinks = author.socialLinks as Record<string, string> | null;
    const transformedAuthor = {
      ...author,
      twitter: updatedSocialLinks?.twitter || null,
      linkedin: updatedSocialLinks?.linkedin || null,
      website: updatedSocialLinks?.website || null,
      email: updatedSocialLinks?.email || null,
    };

    return NextResponse.json(transformedAuthor);
  } catch (error) {
    console.error('Update author error:', error);
    return NextResponse.json(
      { error: 'Failed to update author' },
      { status: 500 }
    );
  }
}

// DELETE - Delete author (requires auth)
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

    // Check if author exists
    const existingAuthor = await prisma.author.findUnique({
      where: { id },
    });

    if (!existingAuthor) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    // Delete author
    await prisma.author.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Author deleted' });
  } catch (error) {
    console.error('Delete author error:', error);
    return NextResponse.json(
      { error: 'Failed to delete author' },
      { status: 500 }
    );
  }
}
