'use client';

import { ReactNode } from 'react';

interface ReviewContentProps {
  content: string;
  children?: ReactNode;
}

export default function ReviewContent({ content, children }: ReviewContentProps) {
  return (
    <div className="review-content-wrapper" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      width: '100%',
    }}>
      <section className="wysiwyg-section" data-role="wysiwyg">
        <div
          className="wysiwyg-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>

      {children}

      <style jsx global>{`
        .wysiwyg-section {
          color: var(--color-body-1, #191919);
          line-height: 1.6;
        }

        .wysiwyg-content a:not([data-role="product-cta"]) {
          color: var(--color-info-hover, #147DC2);
          font-weight: 600;
          text-decoration: none;
        }

        .wysiwyg-content a:hover {
          text-decoration: underline;
        }

        .wysiwyg-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 24px 0;
        }

        .wysiwyg-content ul,
        .wysiwyg-content ol {
          margin: 16px 0;
          padding-left: 24px;
        }

        .wysiwyg-content li {
          margin-bottom: 8px;
          line-height: 1.6;
        }

        .wysiwyg-content h2 {
          font-size: 24px;
          font-weight: 700;
          color: #191919;
          margin: 32px 0 16px;
          line-height: 1.3;
        }

        .wysiwyg-content h3 {
          font-size: 20px;
          font-weight: 700;
          color: #191919;
          margin: 24px 0 12px;
          line-height: 1.3;
        }

        .wysiwyg-content h4 {
          font-size: 18px;
          font-weight: 600;
          color: #191919;
          margin: 20px 0 10px;
        }

        .wysiwyg-content p {
          font-size: 16px;
          line-height: 1.6;
          color: #191919;
          margin-bottom: 16px;
        }

        .wysiwyg-content strong,
        .wysiwyg-content b {
          font-weight: 700;
        }

        .wysiwyg-content hr {
          border: none;
          border-top: 1px solid #EEEEEE;
          margin: 32px 0;
        }

        .wysiwyg-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
          font-size: 14px;
        }

        .wysiwyg-content table th {
          background-color: #F5F5F5;
          padding: 12px 16px;
          text-align: left;
          font-weight: 700;
          border: 1px solid #EEEEEE;
        }

        .wysiwyg-content table td {
          padding: 12px 16px;
          border: 1px solid #EEEEEE;
        }

        .wysiwyg-content table tr:nth-child(even) td {
          background-color: #FAFAFA;
        }

        .wysiwyg-content blockquote {
          border-left: 4px solid #F37022;
          padding-left: 16px;
          margin: 24px 0;
          font-style: italic;
          color: #4C4C4C;
        }

        .wysiwyg-content .video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          margin: 24px 0;
        }

        .wysiwyg-content .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }

        .wysiwyg-content .image-caption {
          font-size: 14px;
          color: #717171;
          text-align: center;
          margin-top: -16px;
          margin-bottom: 24px;
        }

        @media (max-width: 767px) {
          .wysiwyg-content h2 {
            font-size: 20px;
          }
          .wysiwyg-content h3 {
            font-size: 18px;
          }
          .wysiwyg-content table {
            font-size: 12px;
          }
          .wysiwyg-content table th,
          .wysiwyg-content table td {
            padding: 8px 12px;
          }
        }
      `}</style>
    </div>
  );
}
