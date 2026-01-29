'use client';

import { useState } from 'react';

export default function SetoffBox() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
                    Top10.com is a free resource for consumers. We may receive compensation from companies
                    whose products we review and recommend. This compensation, along with our extensive
                    research, determines how and where brands appear on the site, including placement in
                    categories and the order in which they are displayed. We also consider reviews by
                    consumers when making our recommendations. Top10.com doesn&apos;t cover all brands on the
                    market. Learn more about our <a href="/how-we-evaluate">methodology</a> or reach out
                    to our team at <a href="mailto:info@top10.com">info@top10.com</a>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .setoff-box {
          width: 100%;
          z-index: 22;
        }

        .setoff-wrapper {
          display: flex;
          width: 100%;
          justify-content: center;
          background-color: #FFFFFF;
          border-bottom: 1px solid #BDBDBD;
        }

        .setoff-content {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          font-size: 14px;
          line-height: 17px;
          padding: 8px 16px;
        }

        .setoff-text {
          display: inline;
          letter-spacing: -0.5px;
          text-align: left;
          margin-right: 16px;
          color: #333;
        }

        .setoff-disclosure {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .disclosure-btn {
          background: none;
          border: none;
          color: #333;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
          white-space: nowrap;
        }

        .disclosure-btn:hover {
          color: #000;
        }

        .disclosure-popup {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 12px;
          width: 320px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          padding: 16px;
          z-index: 100;
          font-size: 13px;
          line-height: 1.5;
          color: #4b5563;
        }

        .disclosure-popup::before {
          content: '';
          position: absolute;
          top: -6px;
          right: 20px;
          width: 12px;
          height: 12px;
          background: #fff;
          border-left: 1px solid #e5e7eb;
          border-top: 1px solid #e5e7eb;
          transform: rotate(45deg);
        }

        .disclosure-popup p {
          margin: 0;
        }

        .disclosure-popup :global(a) {
          color: #1789d5;
          text-decoration: underline;
        }

        .disclosure-popup :global(a:hover) {
          color: #0f6bb3;
        }

        @media (max-width: 768px) {
          .setoff-content {
            flex-direction: column;
            align-items: flex-start;
            padding: 8px 16px;
            gap: 4px;
          }

          .setoff-text {
            margin-right: 0;
          }

          .setoff-disclosure {
            width: 100%;
            justify-content: flex-end;
          }

          .disclosure-popup {
            right: -16px;
            width: calc(100vw - 32px);
            max-width: 320px;
          }
        }
      `}</style>
    </>
  );
}
