'use client';

interface ProsAndConsProps {
  pros: string[];
  cons: string[];
}

function ThumbIcon({ type }: { type: 'pros' | 'cons' }) {
  const isThumbsDown = type === 'cons';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      fill="none"
      fontSize="14"
      className={`${type} ni-5fgrqh ercjedm8`}
      style={isThumbsDown ? { transform: 'rotate(180deg)' } : undefined}
    >
      <path
        d="M3.778 5.767v7.671c0 .247-.225.447-.502.447H.502c-.277 0-.502-.2-.502-.447V5.767c0-.247.225-.447.502-.447h2.774c.277 0 .502.2.502.447zM14 6.4c0-.599-.485-1.083-1.083-1.083h-.763l-2.849-.023s-.684.059-.9-.271c-.13-.2-.13-.45-.001-.743.538-1.221.728-2.477.213-3.505A1.592 1.592 0 007.87.038a.37.37 0 00-.525.27l-.001.006c-.05.288-.082.64-.116 1.013-.05.546-.201 1.146-.344 1.568-.236.693-.359.717-1.073 1.436-.167.168-.34.342-.524.534-.074.077-.15.147-.231.222-.125.115-.285.34-.43.562a2.308 2.308 0 00-.374 1.259v5.269c0 .52.348.977.85 1.114.43.117.984.225 1.57.225h6.133a.95.95 0 00.784-.94.96.96 0 00-.71-.927 1.083 1.083 0 00.037-2.112 1.083 1.083 0 00.342-2.11c.43-.144.741-.55.741-1.028z"
        fill="currentColor"
      />
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
                <ThumbIcon type="pros" />
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
                <ThumbIcon type="cons" />
                <div className="ni-198nio1">{con}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
