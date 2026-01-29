'use client';

import React from 'react';
import { ContentBlock, ComparisonTableBlock, ExpertsBlock, TextBlock } from './types';

interface Author {
  id: string;
  name: string;
  avatar?: string | null;
  title?: string | null;
  slug: string;
}

interface BottomContentRendererProps {
  content: string; // JSON string of blocks
  authors?: Author[];
}

export default function BottomContentRenderer({ content, authors = [] }: BottomContentRendererProps) {
  let blocks: ContentBlock[] = [];

  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      blocks = parsed;
    }
  } catch {
    // If not valid JSON, it might be legacy HTML - render as-is
    return (
      <>
        <div className="bottom-content-legacy" dangerouslySetInnerHTML={{ __html: content }} />
        <style jsx>{`
          .bottom-content-legacy {
            font-size: 16px;
            line-height: 1.7;
            color: #374151;
          }

          .bottom-content-legacy :global(a) {
            font-size: inherit;
            line-height: inherit;
            font-weight: 600;
            color: #1789d5;
            cursor: pointer;
            text-decoration: none;
            font-family: inherit;
            transition: color 0.3s linear;
          }

          .bottom-content-legacy :global(a:hover) {
            color: #0f6bb3;
            text-decoration: underline;
          }

          .bottom-content-legacy :global(ul),
          .bottom-content-legacy :global(ol) {
            margin: 16px 0;
            padding-left: 0;
            list-style: none;
          }

          .bottom-content-legacy :global(li) {
            margin: 8px 0;
            padding-left: 20px;
            position: relative;
            line-height: 1.6;
          }

          .bottom-content-legacy :global(ul li::before) {
            content: '';
            position: absolute;
            left: 0;
            top: 10px;
            width: 6px;
            height: 6px;
            background-color: #1789d5;
          }

          .bottom-content-legacy :global(ol) {
            counter-reset: list-counter;
          }

          .bottom-content-legacy :global(ol li) {
            counter-increment: list-counter;
          }

          .bottom-content-legacy :global(ol li::before) {
            content: counter(list-counter) '.';
            position: absolute;
            left: 0;
            top: 0;
            color: #1789d5;
            font-weight: 600;
          }

          .bottom-content-legacy :global(li a) {
            display: inline;
            margin: 0;
          }

          .bottom-content-legacy :global(p) {
            margin: 16px 0;
          }
        `}</style>
      </>
    );
  }

  if (blocks.length === 0) return null;

  return (
    <div className="bottom-content-blocks">
      {blocks.map((block) => {
        switch (block.type) {
          case 'text':
            return <TextBlockRenderer key={block.id} block={block} />;
          case 'comparison-table':
            return <ComparisonTableRenderer key={block.id} block={block} />;
          case 'experts':
            return <ExpertsRenderer key={block.id} block={block} authors={authors} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

function TextBlockRenderer({ block }: { block: TextBlock }) {
  return (
    <div className="content-block text-block">
      {block.data.title && <h2>{block.data.title}</h2>}
      <div className="text-content" dangerouslySetInnerHTML={{ __html: block.data.content }} />
      <style jsx>{`
        .text-block {
          margin: 32px 0;
        }

        .text-block h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 16px 0;
        }

        .text-content {
          font-size: 16px;
          line-height: 1.7;
          color: #374151;
        }

        .text-content :global(a) {
          font-size: inherit;
          line-height: inherit;
          font-weight: 600;
          color: #1789d5;
          cursor: pointer;
          text-decoration: none;
          font-family: inherit;
          transition: color 0.3s linear;
        }

        .text-content :global(a:hover) {
          color: #0f6bb3;
          text-decoration: underline;
        }

        .text-content :global(ul),
        .text-content :global(ol) {
          margin: 16px 0;
          padding-left: 0;
          list-style: none;
        }

        .text-content :global(li) {
          margin: 8px 0;
          padding-left: 20px;
          position: relative;
          line-height: 1.6;
        }

        .text-content :global(ul li::before) {
          content: '';
          position: absolute;
          left: 0;
          top: 10px;
          width: 6px;
          height: 6px;
          background-color: #1789d5;
        }

        .text-content :global(ol) {
          counter-reset: list-counter;
        }

        .text-content :global(ol li) {
          counter-increment: list-counter;
        }

        .text-content :global(ol li::before) {
          content: counter(list-counter) '.';
          position: absolute;
          left: 0;
          top: 0;
          color: #1789d5;
          font-weight: 600;
        }

        .text-content :global(li a) {
          display: inline;
          margin: 0;
        }

        .text-content :global(p) {
          margin: 16px 0;
        }

        .text-content :global(p:first-child) {
          margin-top: 0;
        }

        .text-content :global(p:last-child) {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}

function ComparisonTableRenderer({ block }: { block: ComparisonTableBlock }) {
  const { title, description, columns, rows } = block.data;
  const tableWrapperRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const COLUMN_WIDTH = 160;

  const checkScrollPosition = React.useCallback(() => {
    const wrapper = tableWrapperRef.current;
    if (!wrapper) return;
    setCanScrollLeft(wrapper.scrollLeft > 0);
    setCanScrollRight(wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth - 5);
  }, []);

  React.useEffect(() => {
    checkScrollPosition();
    const wrapper = tableWrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
    }
    return () => {
      if (wrapper) wrapper.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [checkScrollPosition]);

  const scrollTable = (direction: 'left' | 'right') => {
    const wrapper = tableWrapperRef.current;
    if (!wrapper) return;

    const scrollAmount = direction === 'left' ? -COLUMN_WIDTH : COLUMN_WIDTH;
    const startPosition = wrapper.scrollLeft;
    const duration = 300;
    let startTime: number | null = null;

    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      wrapper.scrollLeft = startPosition + (scrollAmount * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <div className="content-block comparison-table-block">
      {title && <h2 className="table-title">{title}</h2>}
      {description && <p className="table-description">{description}</p>}

      <div className="table-container">
        <button
          className={`nav-btn nav-btn-left ${!canScrollLeft ? 'disabled' : ''}`}
          onClick={() => scrollTable('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button
          className={`nav-btn nav-btn-right ${!canScrollRight ? 'disabled' : ''}`}
          onClick={() => scrollTable('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div className="table-wrapper" ref={tableWrapperRef}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="provider-col">Provider</th>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'even' : 'odd'}>
                  <td className="provider-col">
                    <span className="provider-name">{row.provider}</span>
                  </td>
                  {columns.map((col) => (
                    <td key={col.key}>{row.values[col.key] || '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .comparison-table-block {
          margin: 40px 0;
        }

        .table-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 12px 0;
        }

        .table-description {
          color: #6b7280;
          margin: 0 0 24px 0;
          font-size: 15px;
          line-height: 1.6;
        }

        .table-container {
          position: relative;
        }

        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #374151;
          transition: all 0.2s;
        }

        .nav-btn:hover:not(.disabled) {
          background: #FE4A64;
          border-color: #FE4A64;
          color: white;
          box-shadow: 0 4px 12px rgba(254, 74, 100, 0.3);
        }

        .nav-btn.disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .nav-btn-left {
          left: -20px;
        }

        .nav-btn-right {
          right: -20px;
        }

        .table-wrapper {
          overflow-x: auto;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .table-wrapper::-webkit-scrollbar {
          display: none;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .comparison-table thead {
          background: linear-gradient(to bottom, #f8f9fa, #f1f3f5);
        }

        .comparison-table th {
          padding: 16px 20px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
          white-space: nowrap;
          min-width: ${COLUMN_WIDTH}px;
        }

        .comparison-table th.provider-col {
          position: sticky;
          left: 0;
          background: linear-gradient(to bottom, #f8f9fa, #f1f3f5);
          z-index: 2;
          min-width: 150px;
          box-shadow: 4px 0 8px rgba(0, 0, 0, 0.08);
        }

        .comparison-table td {
          padding: 14px 20px;
          color: #4b5563;
          border-bottom: 1px solid #f0f0f0;
          vertical-align: middle;
          min-width: ${COLUMN_WIDTH}px;
        }

        .comparison-table td.provider-col {
          position: sticky;
          left: 0;
          z-index: 1;
          box-shadow: 4px 0 8px rgba(0, 0, 0, 0.08);
        }

        .comparison-table tr.even {
          background: #ffffff;
        }

        .comparison-table tr.odd {
          background: #fafbfc;
        }

        .comparison-table tr.even td.provider-col {
          background: #ffffff;
        }

        .comparison-table tr.odd td.provider-col {
          background: #fafbfc;
        }

        .comparison-table tbody tr:hover {
          background: #f0f7ff;
        }

        .comparison-table tbody tr:hover td.provider-col {
          background: #f0f7ff;
        }

        .comparison-table tbody tr:last-child td {
          border-bottom: none;
        }

        .provider-name {
          font-weight: 600;
          color: #1f2937;
        }

        @media (max-width: 768px) {
          .nav-btn {
            width: 36px;
            height: 36px;
          }

          .nav-btn-left {
            left: -18px;
          }

          .nav-btn-right {
            right: -18px;
          }

          .comparison-table {
            font-size: 13px;
          }

          .comparison-table th,
          .comparison-table td {
            padding: 12px 14px;
            min-width: 140px;
          }

          .comparison-table th.provider-col,
          .comparison-table td.provider-col {
            min-width: 110px;
          }
        }
      `}</style>
    </div>
  );
}

function ExpertsRenderer({ block, authors }: { block: ExpertsBlock; authors: Author[] }) {
  const { titlePrefix, highlightWord, titleSuffix, description, authorIds, backgroundColor } = block.data;
  // Backward compatibility: check for old 'title' field
  const legacyTitle = (block.data as { title?: string }).title;

  const selectedAuthors = authorIds
    .map((id) => authors.find((a) => a.id === id))
    .filter(Boolean) as Author[];

  if (selectedAuthors.length === 0) return null;

  // Build title with highlight (or use legacy title if new fields are empty)
  const fullTitle = highlightWord ? (
    <>
      {titlePrefix || 'Our'}{' '}
      <span style={{ color: '#FF4A64' }}>{highlightWord}</span>{' '}
      {titleSuffix || 'Experts'}
    </>
  ) : (
    legacyTitle || 'Our Experts'
  );

  return (
    <div
      className="content-block experts-block"
      style={{ backgroundColor: backgroundColor || '#f5f5f5' }}
    >
      <h2>{fullTitle}</h2>
      {description && <p className="experts-description">{description}</p>}

      <div className="experts-grid">
        {selectedAuthors.map((author) => (
          <a
            key={author.id}
            href={`/authors/${author.slug}`}
            className="expert-card"
          >
            <div
              className="expert-avatar"
              style={{
                backgroundImage: author.avatar ? `url('${author.avatar}')` : undefined,
              }}
            >
              {!author.avatar && (
                <span className="avatar-placeholder">{author.name.charAt(0)}</span>
              )}
            </div>
            <p className="expert-name">{author.name}</p>
            <p className="expert-title">{author.title || 'Expert'}</p>
          </a>
        ))}
      </div>

      <style jsx>{`
        .experts-block {
          padding: 40px 20px;
          margin: 32px 0;
          border-radius: 8px;
        }

        .experts-block h2 {
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          margin: 0 0 12px 0;
        }

        .experts-block h2 :global(span) {
          color: #FF4A64;
        }

        .experts-description {
          text-align: center;
          color: #6b7280;
          max-width: 770px;
          margin: 0 auto 30px;
          line-height: 1.6;
        }

        .experts-grid {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 24px;
        }

        .expert-card {
          text-decoration: none;
          color: inherit;
          width: 170px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .expert-card:hover {
          opacity: 0.9;
        }

        .expert-avatar {
          width: 140px;
          height: 140px;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e5e7eb;
        }

        .avatar-placeholder {
          font-size: 48px;
          font-weight: 600;
          color: #9ca3af;
        }

        .expert-name {
          margin: 10px 0 0 0;
          font-size: 15px;
          font-weight: 600;
        }

        .expert-title {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
