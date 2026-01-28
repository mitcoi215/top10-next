'use client';

import { ReactNode } from 'react';

interface ArticleContentProps {
  content: string;
  children?: ReactNode;
}

export default function ArticleContent({ content, children }: ArticleContentProps) {
  return (
    <div className="article-content-wrapper" style={{
      display: 'flex',
      maxWidth: '1174px',
      width: '100%',
      margin: '48px auto',
      gap: '72px',
    }}>
      {/* Main Content */}
      <div className="article-main" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        width: '100%',
        padding: '32px 12px 0',
        maxWidth: '805px',
      }}>
        <div className="article-wysiwyg" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          width: '100%',
        }}>
          <div
            className="wysiwyg-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {children}
        </div>
      </div>

      <style jsx global>{`
        .wysiwyg-content {
          color: var(--color-body-1, #191919);
          line-height: 1.4;
        }

        .wysiwyg-content a:not([data-role="product-cta"]) {
          color: var(--color-info-hover, #147DC2);
          font-weight: 600;
        }

        .wysiwyg-content img {
          object-fit: contain;
          object-position: center;
          margin-bottom: 32px;
          max-width: 100%;
        }

        .wysiwyg-content ul,
        .wysiwyg-content ol {
          margin-bottom: 40px;
          font-size: 16px;
          line-height: 1.4;
          color: var(--color-body-1, #191919);
        }

        .wysiwyg-content ul {
          list-style-type: disc;
          padding-left: 24px;
        }

        .wysiwyg-content ol {
          list-style-type: decimal;
          padding-left: 24px;
        }

        .wysiwyg-content li {
          margin-bottom: 12px;
          margin-left: 0;
        }

        .wysiwyg-content h1 {
          font-size: 32px;
          line-height: 1.2;
          font-weight: 700;
          color: var(--color-body-1, #191919);
          margin-bottom: 40px;
        }

        .wysiwyg-content h2 {
          font-size: 24px;
          line-height: 1.2;
          font-weight: 700;
          color: var(--color-body-1, #191919);
          margin-top: 40px;
          margin-bottom: 20px;
        }

        .wysiwyg-content h3 {
          font-size: 20px;
          line-height: 1.2;
          font-weight: 700;
          color: var(--color-body-1, #191919);
          margin-bottom: 16px;
        }

        .wysiwyg-content p {
          font-size: 16px;
          line-height: 1.4;
          color: var(--color-body-1, #191919);
          margin-bottom: 16px;
        }

        .wysiwyg-content strong,
        .wysiwyg-content b {
          font-weight: 700;
        }

        .wysiwyg-content hr {
          width: 100%;
          height: 1px;
          border: none;
          background-color: var(--color-border-1, #D5D5D5);
          margin: 32px 0;
        }

        @media (max-width: 1199px) {
          .article-content-wrapper {
            flex-direction: column !important;
            gap: 32px !important;
            margin: 0 !important;
          }
          .article-main {
            max-width: 100% !important;
            padding: 32px 12px !important;
          }
        }

        @media (min-width: 1024px) {
          .wysiwyg-content img {
            margin-bottom: 40px;
          }
        }

        @media (min-width: 1200px) {
          .article-main {
            gap: 20px !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
