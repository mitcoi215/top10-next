'use client';

import { useState } from 'react';
import '@/styles/category.css';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
}

export default function FAQSection({ items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="charticle__faq under-wysiwyg">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {items.map((item, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
            <button
              className="faq-question"
              onClick={() => toggleItem(index)}
              aria-expanded={openIndex === index}
            >
              <span>{item.question}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`faq-icon ${openIndex === index ? 'rotated' : ''}`}
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {openIndex === index && (
              <div className="faq-answer">
                <p dangerouslySetInnerHTML={{ __html: item.answer }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .faq-list {
          margin-top: 20px;
        }
        .faq-item {
          border-bottom: 1px solid #e0e0e0;
        }
        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          text-align: left;
          color: #383838;
        }
        .faq-question:hover {
          color: #FF4A64;
        }
        .faq-icon {
          transition: transform 0.3s ease;
        }
        .faq-icon.rotated {
          transform: rotate(180deg);
        }
        .faq-answer {
          padding: 0 0 16px 0;
          color: #4C4C4C;
          line-height: 1.6;
        }
      `}</style>
    </section>
  );
}
