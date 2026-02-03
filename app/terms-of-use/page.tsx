import { StaticPageLayout } from '@/components/top10/static-page';
import { getStaticPageBySlug } from '@/lib/static-page';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const page = await getStaticPageBySlug('terms-of-use').catch(() => null);
  return {
    title: page?.metaTitle || page?.title || 'Terms of Use | 10rating',
    description: page?.metaDescription || page?.description || '',
  };
}

export default async function TermsOfUsePage() {
  const page = await getStaticPageBySlug('terms-of-use');
  return <StaticPageLayout title={page.title} description={page.description} content={page.content} />;
}
