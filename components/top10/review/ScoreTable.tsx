'use client';

interface ScoreItem {
  category: string;
  description?: string;
  score: number;
}

interface ScoreTableProps {
  title?: string;
  overallScore: number;
  items: ScoreItem[];
}

function ScoreIcon() {
  return (
    <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0L18.5 11.5H30L20.5 18.5L24 30L15 23L6 30L9.5 18.5L0 11.5H11.5L15 0Z" fill="#147DC2"/>
    </svg>
  );
}

export default function ScoreTable({
  title = 'Score Table',
  overallScore,
  items,
}: ScoreTableProps) {
  return (
    <div className="ni-1foqjiq" data-testid="score-table">
      <div className="ni-1r4h69p">
        <h2 className="ni-16meet0">{title}</h2>
        <div className="ni-13l241l">
          <div className="value">
            <span className="ni-lc7fha">{overallScore.toFixed(1)}</span>
            <ScoreIcon />
          </div>
        </div>
      </div>
      <div className="ni-o9wop8">
        {items.map((item, index) => (
          <div key={index} className="ni-9zcywm" data-testid="score-table-row">
            <div className="ni-1yocs42">
              <h3 className="ni-1a3n47u">{item.category}</h3>
              {item.description && (
                <div className="ni-10105h6">{item.description}</div>
              )}
            </div>
            <div className="ni-7uc99q">{item.score.toFixed(1)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
