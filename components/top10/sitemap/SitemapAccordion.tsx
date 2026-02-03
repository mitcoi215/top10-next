'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';

interface SitemapAccordionProps {
  title: string;
  href?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  nested?: boolean;
}

export default function SitemapAccordion({
  title,
  href,
  children,
  defaultOpen = false,
  nested = false,
}: SitemapAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <li className={`sitemap__accordion ${nested ? 'sitemap__accordion--nested' : ''}`}>
      <div className="sitemap__accordion-header" onClick={toggleOpen}>
        {href ? (
          <Link
            href={href}
            className="sitemap__accordion-title sitemap__accordion-title--link"
            onClick={(e) => e.stopPropagation()}
          >
            {title}
          </Link>
        ) : (
          <h2 className="sitemap__accordion-title">{title}</h2>
        )}
        <svg
          className={`sitemap__accordion-icon ${isOpen ? 'sitemap__accordion-icon--open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.577 8.368l-9.562 9.225a1.438 1.438 0 01-.466.301 1.48 1.48 0 01-1.566-.301L1.42 8.368C1.15 8.108 1 7.755 1 7.388c0-.368.151-.72.42-.98.27-.26.636-.407 1.017-.407.38 0 .746.146 1.016.406L12 14.654l8.547-8.248c.27-.26.635-.406 1.016-.406s.747.146 1.016.406c.27.26.421.613.421.98 0 .368-.151.72-.42.98l-.003.002z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div
        className="sitemap__accordion-content"
        style={{ maxHeight: isOpen ? '10000px' : '0' }}
      >
        {children}
      </div>
    </li>
  );
}
