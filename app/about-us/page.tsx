import { StaticPageLayout } from '@/components/top10/static-page';
import { getStaticPageBySlug } from '@/lib/static-page';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const page = await getStaticPageBySlug('about-us').catch(() => null);
  return {
    title: page?.metaTitle || page?.title || 'About Us | 10rating',
    description: page?.metaDescription || page?.description || '',
  };
}

export default async function AboutUsPage() {
  const page = await getStaticPageBySlug('about-us');
  return <StaticPageLayout title={page.title} description={page.description} content={page.content} />;
}
