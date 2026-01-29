'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

interface AuthorInfo {
  name: string;
  slug: string;
  avatar: string;
  bio?: string;
  blogUrl?: string;
  twitterUrl?: string;
  linkedInUrl?: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  author?: AuthorInfo;
  lastUpdated?: string;
}

// FAQ Icon
function FAQIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" data-testid="faq-icon" className="css-1de8cif">
      <path fill="#ff4964" d="M4.83 19.137c.78.37 2.682.837 5.492.837s4.712-.466 5.492-.837c-.78-.37-2.683-.837-5.492-.837-2.81 0-4.712.467-5.492.837m9.97 13.185a1 1 0 00-.995-1.002 1 1 0 00-.995 1.002.999.999 0 00.995 1.002 1 1 0 00.996-1.002m-6.491 0a1 1 0 00-.995-1.002 1 1 0 00-.995 1.002.999.999 0 00.995 1.002 1 1 0 00.996-1.002" />
      <path fill="#ff4964" d="M13.246 27.66H7.87c-3.016 0-5.469 2.467-5.469 5.5 0 .23.018.452.045.673h2.017a3.505 3.505 0 01-.067-.672c0-1.927 1.558-3.495 3.474-3.495h5.377c1.915 0 3.473 1.568 3.473 3.495 0 .23-.024.453-.066.672h2.017c.026-.22.044-.444.044-.672 0-3.034-2.453-5.501-5.468-5.501m12.171-7.064a1.077 1.077 0 100-2.152 1.07 1.07 0 00-1.066 1.069c0 .607.487 1.083 1.066 1.083zm.872-2.988v-.078c0-.957.249-1.192 1.244-1.847.628-.406 1.296-.983 1.296-2.24 0-1.572-1.296-2.633-3.339-2.633-1.676 0-2.906.865-3.561 2.305l1.571.904c.472-.943 1.113-1.401 1.938-1.401.812 0 1.388.406 1.388.995 0 .668-.668.917-1.349 1.454-.812.655-.982 1.297-.995 2.227v.314z" />
      <path fill="#ff4964" d="M31.812 0a2.02 2.02 0 012.02 2.02v29.792a2.02 2.02 0 01-2.02 2.02h-11.42c.02-.243.038-.484.038-.73a9.927 9.927 0 00-4.763-8.487 9.772 9.772 0 00-5.107-1.444 9.773 9.773 0 00-5.109 1.444 9.927 9.927 0 00-4.763 8.487c0 .076.01.151.012.227-.425-.37-.7-.91-.7-1.517V2.02A2.02 2.02 0 012.02 0h29.792M15.39 21.4c1.809-.489 2.727-1.251 2.727-2.265 0-2.702-6.486-2.838-7.787-2.838-1.898 0-3.694.202-5.059.572-1.81.49-2.726 1.251-2.726 2.266 0 2.7 6.486 2.838 7.785 2.838 1.899 0 3.696-.204 5.06-.573m17.006-5.577v-.076l-.001-.088-.004-.096-.003-.065a4.255 4.255 0 00-.007-.117c0-.014 0-.027-.002-.04l-.01-.14-.002-.014a6.757 6.757 0 00-6.729-6.13 6.756 6.756 0 00-6.757 6.752c0 1.52.503 2.922 1.351 4.05l-.006.03-.162.734-.053.239-.32 1.447 1.416-.445.472-.148.51-.16a6.755 6.755 0 0010.293-5.35c.002-.015.004-.03.004-.046l.003-.061.004-.107.001-.064c.002-.034.002-.07.002-.105" />
    </svg>
  );
}

export default function FAQSection({ items, author, lastUpdated }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="charticle__faq under-wysiwyg">
      <div id="_faq" data-testid="faq" className="css-15qoik9">
        <div className="css-1n21q42">
          <div className="css-6bs3ud">
            <FAQIcon />
          </div>
          <div data-testid="faq-title" className="css-vcrdl3">Frequently Asked Questions</div>
        </div>
        <div data-testid="faq-list" className="css-gsmj7v">
          {items.map((item, index) => (
            <div
              key={index}
              data-testid={`faq-item-${index + 1}`}
              className={`faq-item-${index + 1} css-ekpuav`}
            >
              <div className="css-ekpuav">
                <div
                  className={`faq-header ${openIndex === index ? 'css-t7dj1t' : 'css-xwxnws'}`}
                  onClick={() => toggleFAQ(index)}
                >
                  <span data-testid="faq-question" className="css-foc1h8">
                    {item.question}
                  </span>
                  <span
                    className={`faq-plus-icon ${openIndex === index ? 'css-19x7kzb' : 'css-1r8kmuz'}`}
                  >
                    +
                  </span>
                  <span className={openIndex === index ? 'css-1ovh3ti' : 'css-1dnb2v0'}>-</span>
                </div>
              </div>
              <div
                style={{ height: openIndex === index ? 'auto' : 0 }}
                className="css-1d293q6"
              >
                <p
                  className="css-hmjnm7"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Author Section */}
      {author && (
        <div className="by-author__extended">
          <div className="by-author__author-credentials">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              width="35"
              height="35"
              className="by-author__image"
              src={author.avatar}
              alt={author.name}
              title={author.name}
            />
            <div className="by-author__author-metadata">
              <div className="by-author__author-name">
                <span className="by-author__by">By</span>
                <Link
                  href={`/authors/${author.slug}`}
                  data-role="charticle-author-bottom"
                  className="by-author__author"
                >
                  {author.name}
                </Link>
              </div>
              {lastUpdated && (
                <div data-testid="last-updated" className="by-author__pubdate css-1eneqdx">
                  <svg width="1em" height="1em" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="check-mark css-4qp2h0">
                    <path d="M8.625 16.25a8.125 8.125 0 100-16.25 8.125 8.125 0 000 16.25z" fill="currentColor"></path>
                    <path d="M5.05 8.545l.866-1.126L8.17 9.325l3.64-4.073 1.04.953-4.594 5.027L5.05 8.545z" fill="#F5F5F5"></path>
                  </svg>
                  <span className="css-1nuluvx">Last Updated:</span>
                  <span className="css-66vicj"> {lastUpdated}</span>
                </div>
              )}
            </div>
          </div>
          {author.bio && (
            <div className="by-author__bio">{author.bio}</div>
          )}
          {(author.blogUrl || author.twitterUrl || author.linkedInUrl) && (
            <div className="by-author__social">
              <ul className="social-share">
                {author.blogUrl && (
                  <li
                    className="btn-blogUrl social-share__button"
                    data-value={author.blogUrl}
                    data-name="social-share-buttons"
                    data-role-id="open"
                  >
                    <a href={author.blogUrl} target="_blank" rel="noopener noreferrer">
                      <svg className="social-share__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
                      </svg>
                    </a>
                  </li>
                )}
                {author.twitterUrl && (
                  <li
                    className="btn-twitter social-share__button"
                    data-value={author.twitterUrl}
                    data-name="social-share-buttons"
                    data-role-id="open"
                  >
                    <a href={author.twitterUrl} target="_blank" rel="noopener noreferrer">
                      <svg className="social-share__icon" viewBox="0 0 25 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.889 19.723c6.72 0 12.717-5.02 13.74-11.72.109-.71-.101-2.065.227-2.642.213-.374.92-.743 1.24-1.068a9.86 9.86 0 001.116-1.363 9.847 9.847 0 01-2.806.756 4.836 4.836 0 002.15-2.66c-.14.428-1.904.865-2.305.977-.958.27-1.071-.185-1.87-.64-1.583-.902-3.577-.839-5.122.116-1.695 1.048-2.5 3.133-2.128 5.077-3.692.309-7.825-2.276-10.082-5.002.003.004-.585 1.498-.616 1.703a4.795 4.795 0 00.393 2.749c.225.482 1.053 1.948 1.685 1.968-.8-.024-2.273-.24-2.273-.6v.06c0 1.123.482 2.226 1.208 3.075.61.711 1.763 1.796 2.788 1.65-.226.059-2.065.388-2.169.072.654 1.994 2.43 2.669 4.237 3.316-1.394 1.048-2.606 1.754-4.366 1.985-.606.079-2.002.367-2.536.03a14.005 14.005 0 007.489 2.161z" fill="currentColor"/>
                      </svg>
                    </a>
                  </li>
                )}
                {author.linkedInUrl && (
                  <li
                    className="btn-linkedIn social-share__button"
                    data-value={author.linkedInUrl}
                    data-name="social-share-buttons"
                    data-role-id="open"
                  >
                    <a href={author.linkedInUrl} target="_blank" rel="noopener noreferrer">
                      <svg className="social-share__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
                        <path d="M1.807.012a1.83 1.83 0 011.807 1.807c0 1.033-.877 1.833-1.807 1.807C.852 3.652.001 2.852.001 1.819-.025.813.8.012 1.807.012m1.007 14.713H.75a.518.518 0 01-.516-.516V5.175c0-.284.206-.516.49-.516h2.091c.284 0 .516.232.516.516v9.06c0 .258-.232.49-.516.49m12.131-6.917c0-1.91-1.42-3.408-3.33-3.408h-.542c-1.033 0-2.04.49-2.581 1.291l-.259.258V4.917c0-.104-.154-.258-.258-.258h-2.58c-.104 0-.259.103-.259.232v9.628c0 .103.155.206.258.206h2.84c.103 0 .258-.103.258-.206V8.943c0-.955.722-1.755 1.677-1.78.49 0 .93.18 1.265.515.31.31.439.749.439 1.24v5.549c0 .103.155.258.258.258h2.581c.103 0 .258-.155.258-.258v-6.66h-.025z" fill="currentColor"/>
                      </svg>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
