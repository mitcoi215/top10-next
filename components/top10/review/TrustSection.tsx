'use client';

interface TrustSectionProps {
  title?: string;
  content?: string;
}

export default function TrustSection({
  title = 'How do I know I can trust this review?',
  content = '10rating authors, contributors, and editors are serious about research. We combine our own experience with the services we recommend, with reviews that come from verified users–just like you! Together, with reviews from industry experts, we find the Top 10 best products and services to make sure you can choose with confidence and ease.',
}: TrustSectionProps) {
  return (
    <div className="trust-section" data-testid="trust-section">
      <h2 className="trust-title">{title}</h2>
      <p className="trust-content">{content}</p>
      <style jsx>{`
        .trust-section {
          margin: 32px 0;
          padding: 24px;
          background-color: #f8f9fa;
          border-radius: 8px;
        }

        .trust-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 12px 0;
          line-height: 1.3;
        }

        .trust-content {
          font-size: 15px;
          line-height: 1.7;
          color: #4b5563;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
