'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
}

export function TableOfContents({ contentHtml }: { contentHtml: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract h2 headings from rendered content
    const container = document.querySelector('.static-page__content');
    if (!container) return;

    const headings = container.querySelectorAll('h2');
    const tocItems: TocItem[] = [];

    headings.forEach((h2, i) => {
      const id = h2.id || h2.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `section-${i}`;
      if (!h2.id) h2.id = id;
      tocItems.push({ id, text: h2.textContent || '' });
    });

    setItems(tocItems);

    // Scroll spy
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    headings.forEach((h2) => observer.observe(h2));
    return () => observer.disconnect();
  }, [contentHtml]);

  if (items.length === 0) return null;

  return (
    <aside className="page__left-sidebar">
      <div className="toc">
        <span className="toc__title">Jump to:</span>
        <ul className="toc__items">
          {items.map((item) => (
            <li key={item.id} className={`toc__item ${activeId === item.id ? 'toc__item--active' : ''}`}>
              <a href={`#${item.id}`} onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
