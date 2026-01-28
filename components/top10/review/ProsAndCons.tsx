'use client';

interface ProsAndConsProps {
  pros: string[];
  cons: string[];
}

function CheckIcon({ type }: { type: 'pros' | 'cons' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14" fill="none" fontSize="14" className={`${type} ni-5fgrqh`}>
      <path d="M5.6 10.6L2.1 7.1L3.15 6.05L5.6 8.5L10.85 3.25L11.9 4.3L5.6 10.6Z" fill={type === 'pros' ? '#00875A' : '#DE350B'} />
    </svg>
  );
}

export default function ProsAndCons({ pros, cons }: ProsAndConsProps) {
  return (
    <div className="ni-tqedob" data-testid="pros-and-cons">
      <h2 className="ni-awbsz1">Pros & Cons</h2>
      <div className="ni-18ta6hg" data-testid="pros-and-cons-container" data-role="pros-and-cons-container">
        {/* Pros */}
        <div className="pros ni-17ydn3f">
          <h4 className="ni-1ax82zr">Pros</h4>
          <div className="pros ni-s6uv9c">
            {pros.map((pro, index) => (
              <div key={index} className="ni-ozfrmz" data-role="bullet">
                <CheckIcon type="pros" />
                <div className="ni-198nio1">{pro}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cons */}
        <div className="cons ni-17ydn3f">
          <h4 className="ni-1ax82zr">Cons</h4>
          <div className="cons ni-s6uv9c">
            {cons.map((con, index) => (
              <div key={index} className="ni-ozfrmz" data-role="bullet">
                <CheckIcon type="cons" />
                <div className="ni-198nio1">{con}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
