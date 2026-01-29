'use client';

interface SummarySectionProps {
  title: string;
  content: string;
}

export default function SummarySection({ title, content }: SummarySectionProps) {
  return (
    <div className="summary-section" data-testid="summary-section">
      <h2 className="summary-title">{title}</h2>
      <div className="summary-content" dangerouslySetInnerHTML={{ __html: content }} />
      <style jsx>{`
        .summary-section {
          margin: 24px 0;
          padding: 0;
        }

        .summary-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 12px 0;
          line-height: 1.3;
        }

        .summary-content {
          font-size: 16px;
          line-height: 1.7;
          color: #374151;
        }

        .summary-content :global(p) {
          margin: 0 0 16px 0;
        }

        .summary-content :global(p:last-child) {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}
