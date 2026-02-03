import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export async function getStaticPageBySlug(slug: string) {
  const page = await prisma.staticPage.findUnique({ where: { slug } });
  if (!page) notFound();
  return page;
}
