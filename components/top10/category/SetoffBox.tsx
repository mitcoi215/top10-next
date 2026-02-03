'use client';

import { useState } from 'react';

export default function SetoffBox() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="setoff-box" data-role="setoff-box">
      <div className="setoff-wrapper">
        <div className="setoff-content">
          <div className="setoff-text">
            We earn commissions from brands listed on this site, which influences how listings are presented.
          </div>
          <div className="setoff-disclosure">
            <button
              className="disclosure-btn"
              onClick={() => setIsOpen(!isOpen)}
            >
              Advertising Disclosure
            </button>
            {isOpen && (
              <div className="disclosure-popup">
                <p>
                  10rating is a free resource for consumers. We may receive compensation from companies
                  whose products we review and recommend. This compensation, along with our extensive
                  research, determines how and where brands appear on the site, including placement in
                  categories and the order in which they are displayed. We also consider reviews by
                  consumers when making our recommendations. 10rating doesn&apos;t cover all brands on the
                  market. Learn more about our <a href="/how-we-evaluate">methodology</a> or reach out
                  to our team at <a href="mailto:info@10rating">info@10rating</a>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
