'use client';

import { useState } from 'react';

export default function SetoffBox() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="setoff-box" data-role="setoff-box">
      <div className="css-1lgr5sy elnea280">
        <div className="css-19i7pex" data-testid="set-off-box-wrapper">
          <div className="css-1pc6w80">
            <div data-testid="set-off-box-text" className="css-7e8ctb">
              We earn commissions from brands listed on this site, which influences how listings are presented.
            </div>
            <div className="css-16cmgru">
              <div data-testid="advertising-disclosure" className="css-1dgld9d">
                <button
                  data-testid="opening-label"
                  data-hook="open-advertising-disclosure"
                  className="css-1ax3l46"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  Advertising Disclosure
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
