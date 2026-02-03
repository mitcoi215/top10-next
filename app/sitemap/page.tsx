import '@/styles/top10.css';
import { Metadata } from 'next';
import prisma from '@/lib/db';
import SetoffBox from '@/components/top10/category/SetoffBox';
import Top10Header from '@/components/top10/layout/Top10Header';
import Top10Footer from '@/components/top10/layout/Top10Footer';
import SitemapAccordion from '@/components/top10/sitemap/SitemapAccordion';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sitemap | 10Rating',
  description: 'Browse all pages on 10Rating',
};

interface SitemapCategory {
  slug: string;
  name: string;
  products: { slug: string; name: string }[];
  articles: { slug: string; title: string }[];
}

interface SitemapAuthor {
  slug: string;
  name: string;
}

async function getSitemapData() {
  const [categories, authors, staticPages] = await Promise.all([
    prisma.category.findMany({
      select: {
        slug: true,
        name: true,
        products: {
          select: { slug: true, name: true },
          orderBy: { rank: 'asc' },
        },
        articles: {
          where: { status: 'published' },
          select: { slug: true, title: true },
          orderBy: { publishedAt: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.author.findMany({
      select: { slug: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.staticPage.findMany({
      select: { slug: true, title: true },
      orderBy: { title: 'asc' },
    }),
  ]);

  return { categories, authors, staticPages };
}

export default async function SitemapPage() {
  const { categories, authors, staticPages } = await getSitemapData();

  return (
    <div className="top10-page">
      <SetoffBox />
      <Top10Header />

      <main className="sitemap">
        <h1 className="sitemap__title">10Rating Sitemap</h1>

        <h2 className="sitemap__home-link">
          <Link href="/">
            Top 10 Lists of the Best Products and Services | 10Rating
          </Link>
        </h2>

        <ul className="sitemap__list">
          {/* Static Pages Section */}
          {staticPages.length > 0 && (
            <SitemapAccordion title="Pages" defaultOpen={false}>
              <ul className="sitemap__sublist">
                {staticPages.map((page) => (
                  <li key={page.slug} className="sitemap__item">
                    <Link href={`/${page.slug}`} className="sitemap__link">
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </SitemapAccordion>
          )}

          {/* Authors Section */}
          {authors.length > 0 && (
            <SitemapAccordion title="Authors" defaultOpen={false}>
              <ul className="sitemap__sublist">
                {authors.map((author) => (
                  <li key={author.slug} className="sitemap__item">
                    <Link href={`/authors/${author.slug}`} className="sitemap__link">
                      {author.name} | 10Rating
                    </Link>
                  </li>
                ))}
              </ul>
            </SitemapAccordion>
          )}

          {/* Categories */}
          {categories.map((category) => (
            <SitemapAccordion
              key={category.slug}
              title={category.name}
              href={`/${category.slug}`}
              defaultOpen={false}
            >
              <ul className="sitemap__sublist">
                {/* Articles */}
                {category.articles.map((article) => (
                  <li key={article.slug} className="sitemap__item">
                    <Link href={`/${category.slug}/${article.slug}`} className="sitemap__link">
                      {article.title}
                    </Link>
                  </li>
                ))}

                {/* Reviews Section */}
                {category.products.length > 0 && (
                  <SitemapAccordion
                    title="Reviews"
                    href={`/${category.slug}/reviews`}
                    nested
                    defaultOpen={false}
                  >
                    <ul className="sitemap__sublist">
                      {category.products.map((product) => (
                        <li key={product.slug} className="sitemap__item">
                          <Link
                            href={`/${category.slug}/reviews/${product.slug}`}
                            className="sitemap__link"
                          >
                            {product.name} Review
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </SitemapAccordion>
                )}
              </ul>
            </SitemapAccordion>
          ))}
        </ul>
      </main>

      <Top10Footer />
    </div>
  );
}
