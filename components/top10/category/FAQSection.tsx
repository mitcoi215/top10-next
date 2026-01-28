'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
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

export default function FAQSection({ items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="charticle__faq under-wysiwyg">
      <div data-type="application/hydration-marker">
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
      </div>
    </div>
  );
}
