'use client';

import { ReactNode, useMemo } from 'react';

interface ReviewContentProps {
  content: string;
  children?: ReactNode;
}

// Convert markdown to HTML
function markdownToHtml(markdown: string): string {
  // Check if content is predominantly HTML (has multiple HTML block tags)
  const htmlBlockTags = markdown.match(/<(p|div|h[1-6]|ul|ol|table|blockquote|section|article)[^>]*>/gi);
  if (htmlBlockTags && htmlBlockTags.length > 3) {
    // Content is mostly HTML, but still process markdown tables
    return processMarkdownTables(markdown);
  }

  // Split into lines for processing
  const lines = markdown.split('\n');
  const processedLines: string[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      processedLines.push('');
      i++;
      continue;
    }

    // Check for table (line starts with |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];

      // Collect all table lines (allow empty lines between rows)
      while (i < lines.length) {
        const currentLine = lines[i].trim();
        if (currentLine.startsWith('|')) {
          tableLines.push(currentLine);
          i++;
        } else if (currentLine === '' && i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
          // Skip empty line if next line is still a table row
          i++;
        } else {
          break;
        }
      }

      if (tableLines.length >= 2) {
        processedLines.push(parseTable(tableLines));
      }
      continue;
    }

    // Headers
    if (trimmed.startsWith('#### ')) {
      processedLines.push(`<h4>${processInline(trimmed.slice(5))}</h4>`);
    } else if (trimmed.startsWith('### ')) {
      processedLines.push(`<h3>${processInline(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith('## ')) {
      processedLines.push(`<h2>${processInline(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith('# ')) {
      processedLines.push(`<h1>${processInline(trimmed.slice(2))}</h1>`);
    }
    // Unordered list
    else if (trimmed.startsWith('- ')) {
      processedLines.push(`<li>${processInline(trimmed.slice(2))}</li>`);
    }
    // Ordered list
    else if (/^\d+\. /.test(trimmed)) {
      processedLines.push(`<li>${processInline(trimmed.replace(/^\d+\. /, ''))}</li>`);
    }
    // Blockquote
    else if (trimmed.startsWith('> ')) {
      processedLines.push(`<blockquote>${processInline(trimmed.slice(2))}</blockquote>`);
    }
    // Horizontal rule
    else if (trimmed === '---') {
      processedLines.push('<hr>');
    }
    // Regular paragraph
    else {
      processedLines.push(`<p>${processInline(trimmed)}</p>`);
    }

    i++;
  }

  let html = processedLines.join('\n');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, '<ul>$&</ul>');

  return html;
}

// Process markdown tables in content that may already have HTML
function processMarkdownTables(content: string): string {
  // Find and replace markdown tables with HTML tables
  // Allow empty lines between table rows
  const tableRegex = /(\|[^\n]+\|\s*\n\s*\|[-:\s|]+\|\s*\n(?:\s*\|[^\n]+\|\s*\n?)*)/g;

  return content.replace(tableRegex, (match) => {
    const lines = match.trim().split('\n').filter(line => line.trim() && line.trim().startsWith('|'));
    if (lines.length >= 2) {
      return parseTable(lines);
    }
    return match;
  });
}

// Parse markdown table to HTML
function parseTable(tableLines: string[]): string {
  const parseRow = (row: string): string[] => {
    return row
      .split('|')
      .slice(1, -1) // Remove first and last empty elements
      .map(cell => cell.trim());
  };

  // Check if second line is separator (|---|---|)
  const isSeparator = (line: string): boolean => {
    return /^\|[\s:-]+\|/.test(line) && line.includes('-');
  };

  let html = '<table>';
  let hasHeader = tableLines.length > 1 && isSeparator(tableLines[1]);

  if (hasHeader) {
    // First row is header
    const headerCells = parseRow(tableLines[0]);
    html += '<thead><tr>';
    headerCells.forEach(cell => {
      html += `<th>${processInline(cell)}</th>`;
    });
    html += '</tr></thead>';

    // Body starts from row 2 (skip separator)
    html += '<tbody>';
    for (let i = 2; i < tableLines.length; i++) {
      const cells = parseRow(tableLines[i]);
      html += '<tr>';
      cells.forEach(cell => {
        html += `<td>${processInline(cell)}</td>`;
      });
      html += '</tr>';
    }
    html += '</tbody>';
  } else {
    // No header, all rows are body
    html += '<tbody>';
    tableLines.forEach(line => {
      const cells = parseRow(line);
      html += '<tr>';
      cells.forEach(cell => {
        html += `<td>${processInline(cell)}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody>';
  }

  html += '</table>';
  return html;
}

// Process inline markdown (bold, italic, links, etc.)
function processInline(text: string): string {
  return text
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<s>$1</s>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

export default function ReviewContent({ content, children }: ReviewContentProps) {
  const htmlContent = useMemo(() => markdownToHtml(content), [content]);

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
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </section>

      {children}

      <style jsx global>{`
        .wysiwyg-section {
          color: var(--color-body-1, #191919);
          line-height: 1.6;
        }
      .wysiwyg-section ul>li::marker {
          color: var(--color-info);
          font-size: 16px;
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
