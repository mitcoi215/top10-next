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
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path fill="#fff" fillRule="evenodd" d="M15.131 14.923l2.04 3.94-2.473-.209-1.442 2.294-3.559-5.733" clipRule="evenodd"></path>
      <path fill="#171717" fillRule="evenodd" d="M14.81 14.302a.699.699 0 01.942.3l2.04 3.94a.699.699 0 01-.68 1.017l-2.049-.173-1.216 1.934a.699.699 0 01-1.185-.004l-3.558-5.733a.699.699 0 111.187-.737l.202.326-.796.043 3.559 5.733 1.442-2.294 2.473.209-2.04-3.94-.698.037a.699.699 0 01.377-.658z" clipRule="evenodd"></path>
      <path fill="#fff" fillRule="evenodd" d="M11.774 15.998l-1.403 4.95-1.649-2.085-2.678.834 1.648-5.004" clipRule="evenodd"></path>
      <path fill="#171717" fillRule="evenodd" d="M11.965 15.325a.699.699 0 01.481.863l-1.403 4.95a.698.698 0 01-1.22.243l-1.351-1.708-2.22.691a.699.699 0 01-.872-.886l1.649-5.004a.699.699 0 011.329.432l-.666-.213-1.648 5.004 2.678-.834 1.649 2.085 1.403-4.95-.665-.213a.699.699 0 01.856-.46z" clipRule="evenodd"></path>
      <path fill="#fff" d="M19 9.25c0 3.912-3.134 7.083-7 7.083S5 13.162 5 9.25c0-3.912 3.134-7.083 7-7.083s7 3.171 7 7.083z"></path>
      <path fill="#171717" fillRule="evenodd" d="M12 15.56c3.43 0 6.227-2.817 6.227-6.31 0-3.493-2.797-6.31-6.227-6.31S5.774 5.757 5.774 9.25c0 3.493 2.796 6.31 6.226 6.31zm0 .773c3.866 0 7-3.171 7-7.083 0-3.912-3.134-7.083-7-7.083S5 5.338 5 9.25c0 3.912 3.134 7.083 7 7.083z" clipRule="evenodd"></path>
      <path fill="#1564BF" fillRule="evenodd" d="M14.775 7.373c.273.252.29.677.038.95l-3.41 3.698a.673.673 0 01-.973.017l-1.462-1.48a.673.673 0 11.957-.945l.966.977 2.933-3.179a.673.673 0 01.95-.038z" clipRule="evenodd"></path>
    </svg>
  );
}

export default function ScoreTable({
  title = 'Score Table',
  overallScore,
  items,
}: ScoreTableProps) {
  return (
    <>
      <div className="ni-1foqjiq score-table-wrapper" data-testid="score-table">
        <div className="ni-1r4h69p">
          <h2 className="ni-16meet0 score-title">{title}</h2>
          <div className="ni-13l241l">
            <div className="value">
              <span className="ni-lc7fha overall-score">{overallScore.toFixed(1)}</span>
              <ScoreIcon />
            </div>
            <span className="editorial-score-label">Editorial Score</span>
          </div>
        </div>
        <div className="ni-o9wop8">
          {items.map((item, index) => (
            <div key={index} className="ni-9zcywm" data-testid="score-table-row">
              <div className="ni-1yocs42">
                <h3 className="ni-1a3n47u category-name">{item.category}</h3>
                {item.description && (
                  <div className="ni-10105h6 category-desc">{item.description}</div>
                )}
              </div>
              <div className="ni-7uc99q item-score">{item.score.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .score-title {
          font-size: 20px !important;
        }

        .overall-score {
          font-size: 32px !important;
        }

        .category-name {
          font-size: 15px !important;
        }

        .category-desc {
          font-size: 13px !important;
        }

        .item-score {
          font-size: 18px !important;
        }

        .editorial-score-label {
          font-size: 12px;
          color: #6b7280;
          display: block;
          margin-top: 4px;
        }
      `}</style>
    </>
  );
}
