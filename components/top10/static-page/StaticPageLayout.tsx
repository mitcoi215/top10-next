import { Top10Header, Top10Footer } from '@/components/top10/layout';
import { SetoffBox } from '@/components/top10/category';
import { TableOfContents } from './TableOfContents';
import '@/styles/top10.css';

interface StaticPageLayoutProps {
  title: string;
  description?: string | null;
  content: string;
}

export function StaticPageLayout({ title, description, content }: StaticPageLayoutProps) {
  return (
    <div className="top10-page">
      <SetoffBox />
      <Top10Header />

      {/* Hero Section */}
      <div className="static-page-hero">
        <div className="static-page-hero__inner">
          <h1 className="static-page-hero__title">{title}</h1>
          {description && <p className="static-page-hero__description">{description}</p>}
        </div>
      </div>

      {/* Main Content */}
      <div className="page">
        <TableOfContents contentHtml={content} />

        <section className="page__center">
          <div className="static-page">
            <div className="static-page__separator" />
            <article
              className="static-page__content html-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </section>
      </div>

      <Top10Footer />
    </div>
  );
}
