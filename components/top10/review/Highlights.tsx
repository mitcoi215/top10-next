'use client';

interface HighlightItem {
  title: string;
  value: string;
}

interface HighlightsProps {
  items: HighlightItem[];
}

function HighlightIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" data-testid="highlight-icon" className="ni-13h00an e1mlpi7i3">
      <path d="M8.625 16.25a8.125 8.125 0 100-16.25 8.125 8.125 0 000 16.25z" fill="currentColor"></path>
      <path d="M5.05 8.545l.866-1.126L8.17 9.325l3.64-4.073 1.04.953-4.594 5.027L5.05 8.545z" fill="#F5F5F5"></path>
    </svg>
  );
}

export default function Highlights({ items }: HighlightsProps) {
  return (
    <div className="ni-1rd1i5p e1mlpi7i2">
      <div className="ni-13x0qxg e1mlpi7i1">
        {items.map((item, index) => (
          <div key={index} className="ni-1lu6wp0 e1mlpi7i7">
            <HighlightIcon />
            <div className="ni-lynbxr e1mlpi7i6">
              <div className="ni-199hzlf e1mlpi7i5">
                <div>{item.title}</div>
              </div>
              <div className="ni-18vy9zd e1mlpi7i4">
                <div>{item.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
