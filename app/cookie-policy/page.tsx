import { StaticPageLayout } from '@/components/top10/static-page';
import { getStaticPageBySlug } from '@/lib/static-page';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const page = await getStaticPageBySlug('cookie-policy').catch(() => null);
  return {
    title: page?.metaTitle || page?.title || 'Cookie Policy | 10rating',
    description: page?.metaDescription || page?.description || '',
  };
}

export default async function CookiePolicyPage() {
  const page = await getStaticPageBySlug('cookie-policy');
  return <StaticPageLayout title={page.title} description={page.description} content={page.content} />;
}
