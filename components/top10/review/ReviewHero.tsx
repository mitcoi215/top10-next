'use client';

import Link from 'next/link';

interface ReviewHeroProps {
  productName: string;
  title: string;
  subtitle: string;
  rating: number;
  reviewCount?: string;
  authorName: string;
  authorImage: string;
  authorSlug: string;
  authorBio?: string;
  updatedDate: string;
  readTime: string;
  productLogo: string;
  ctaHref: string;
  ctaText?: string;
}

function StarIcon({ filled }: { filled: boolean }) {
  const bgColor = filled ? '#00B67A' : '#DCDCE5';
  if (filled) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="1em" height="1em" data-testid="full-star" className="ni-10im9f e2sg7l81">
        <g fill="none" fillRule="evenodd">
          <path fill={bgColor} d="M0 0h18.717v19.251H0z"></path>
          <path d="M16.609 7.965l-4.47 3.269 1.707 5.286-4.47-3.268-4.474 3.268 1.712-5.286L2.139 7.96l5.525.005 1.713-5.291 1.706 5.291h5.526zm-4.086 4.466l-.384-1.197-2.762 2.018 3.146-.821z" fill="#FFF" fillRule="nonzero"></path>
        </g>
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="1em" height="1em" data-testid="empty-star" className="ni-1ondxqp e2sg7l80">
      <g fill="none" fillRule="evenodd">
        <path fill={bgColor} d="M0 0h18.717v19.251H0z"></path>
        <path d="M16.609 7.965l-4.47 3.269 1.707 5.286-4.47-3.268-4.474 3.268 1.712-5.286L2.139 7.96l5.525.005 1.713-5.291 1.706 5.291h5.526zm-4.086 4.466l-.384-1.197-2.762 2.018 3.146-.821z" fill="#FFF" fillRule="nonzero"></path>
      </g>
    </svg>
  );
}

function TrustpilotLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 100 25" className="ni-olgc7d eywaehk2">
      <g clipPath="url(#trust-pilot-logo_svg__a)">
        <path fill="currentColor" d="M24.704 8.182h9.517v1.776H30.48v9.982h-2.058V9.958h-3.726V8.182h.009zm9.11 3.244h1.76v1.643h.033c.058-.232.166-.456.324-.672.158-.216.348-.423.572-.597a3.03 3.03 0 01.747-.44c.274-.108.556-.166.838-.166.216 0 .374.008.457.017.083.008.166.025.257.033v1.809a5.992 5.992 0 00-.407-.058 3.445 3.445 0 00-.406-.025c-.316 0-.614.066-.896.19a2.065 2.065 0 00-.73.557 2.822 2.822 0 00-.498.912c-.125.366-.183.78-.183 1.253v4.05h-1.876v-8.506h.009zm13.61 8.514H45.58v-1.186h-.033a2.557 2.557 0 01-1.029 1.028c-.456.258-.92.39-1.394.39-1.12 0-1.933-.273-2.431-.83-.498-.555-.747-1.393-.747-2.514v-5.402h1.875v5.22c0 .747.142 1.278.432 1.585.282.307.689.464 1.203.464.398 0 .722-.058.988-.182a1.68 1.68 0 00.639-.49 1.88 1.88 0 00.356-.73 3.6 3.6 0 00.108-.921v-4.937h1.876v8.505zm3.194-2.73c.058.548.266.93.623 1.154.365.215.796.331 1.303.331.174 0 .373-.016.597-.041.224-.025.44-.083.63-.158.2-.074.357-.19.49-.34.125-.15.183-.34.174-.58a.802.802 0 00-.265-.59 1.869 1.869 0 00-.63-.373 6.325 6.325 0 00-.88-.241c-.332-.066-.664-.141-1.004-.216a9.559 9.559 0 01-1.013-.282 3.094 3.094 0 01-.871-.448 1.97 1.97 0 01-.614-.714c-.158-.29-.233-.647-.233-1.078 0-.465.117-.847.34-1.162.225-.315.515-.564.855-.755.349-.191.73-.324 1.154-.407a7.03 7.03 0 011.211-.116c.44 0 .863.05 1.262.141.398.091.763.24 1.087.456.323.208.589.482.805.814.215.332.348.738.406 1.211h-1.958c-.091-.448-.29-.755-.614-.904a2.515 2.515 0 00-1.112-.233c-.133 0-.29.009-.473.034a2.588 2.588 0 00-.514.124c-.158.058-.291.15-.407.266a.642.642 0 00-.166.456.71.71 0 00.24.556c.158.141.366.257.623.357.257.091.548.174.88.24.331.067.672.142 1.02.216.34.075.672.174 1.004.282.332.108.623.257.88.448s.465.424.622.706c.158.282.24.639.24 1.054 0 .506-.115.929-.348 1.286a2.76 2.76 0 01-.896.854c-.365.216-.78.382-1.228.482-.448.1-.896.15-1.336.15a5.67 5.67 0 01-1.494-.183 3.638 3.638 0 01-1.186-.548 2.716 2.716 0 01-.789-.921c-.19-.365-.29-.805-.307-1.311h1.892v-.017zm6.19-5.784h1.42V8.871h1.875v2.555h1.693v1.403h-1.693v4.547c0 .2.008.365.025.515a.948.948 0 00.116.365c.058.1.15.174.274.224.124.05.282.074.498.074.133 0 .265 0 .398-.008s.266-.025.398-.058v1.452c-.207.025-.414.042-.605.067a4.85 4.85 0 01-.606.033c-.498 0-.896-.05-1.195-.141-.299-.092-.54-.233-.705-.415a1.44 1.44 0 01-.349-.68c-.058-.274-.1-.59-.108-.938v-5.02h-1.419v-1.42h-.016zm6.316 0h1.775v1.154h.033c.266-.498.631-.847 1.104-1.062.473-.216.98-.324 1.535-.324.672 0 1.253.116 1.751.357.498.232.913.556 1.245.97.332.416.572.897.738 1.445.166.547.25 1.136.25 1.759 0 .572-.075 1.128-.225 1.66a4.444 4.444 0 01-.672 1.427 3.3 3.3 0 01-1.145.987c-.465.25-1.004.373-1.635.373-.274 0-.547-.024-.821-.074a3.61 3.61 0 01-.789-.24 2.845 2.845 0 01-.697-.424 2.628 2.628 0 01-.539-.598h-.033v4.25h-1.875v-11.66zm6.555 4.266c0-.382-.05-.755-.15-1.12a2.983 2.983 0 00-.448-.963 2.283 2.283 0 00-.738-.672 2.07 2.07 0 00-1.02-.258c-.79 0-1.386.274-1.785.822-.398.548-.597 1.278-.597 2.19 0 .432.05.83.157 1.196.108.365.258.68.473.945.208.266.457.473.747.623.29.158.63.232 1.013.232.431 0 .788-.091 1.087-.265a2.32 2.32 0 00.73-.68c.19-.283.332-.598.415-.955.074-.357.116-.722.116-1.095zm3.31-7.51h1.876v1.776H72.99V8.182zm0 3.244h1.876v8.514H72.99v-8.514zm3.552-3.244h1.876V19.94H76.54V8.182zm7.626 11.99c-.68 0-1.286-.116-1.817-.34a4.012 4.012 0 01-1.353-.93 4.048 4.048 0 01-.838-1.418 5.476 5.476 0 01-.29-1.809c0-.647.1-1.245.29-1.792a4.058 4.058 0 01.838-1.42 3.82 3.82 0 011.353-.929c.531-.224 1.137-.34 1.817-.34.68 0 1.286.116 1.817.34.532.224.98.54 1.353.93.365.398.647.871.838 1.419.191.547.29 1.145.29 1.792 0 .655-.099 1.261-.29 1.809a4.048 4.048 0 01-.838 1.419 3.82 3.82 0 01-1.353.93c-.53.223-1.136.34-1.817.34zm0-1.485c.415 0 .78-.091 1.087-.265.307-.175.556-.407.755-.69.2-.281.34-.605.44-.962a4.42 4.42 0 00.141-1.095c0-.365-.05-.722-.14-1.087a2.838 2.838 0 00-.44-.963 2.175 2.175 0 00-1.842-.946c-.416 0-.78.092-1.088.266a2.384 2.384 0 00-.755.68c-.2.283-.34.598-.44.963a4.44 4.44 0 00-.14 1.087c0 .373.049.738.14 1.095.092.357.24.68.44.963.2.282.448.514.755.689.307.182.672.265 1.087.265zm4.846-7.26h1.42V8.87h1.875v2.555H94v1.403h-1.692v4.547c0 .2.008.365.024.515a.946.946 0 00.117.365.53.53 0 00.273.224c.125.05.283.074.498.074.133 0 .266 0 .399-.008.132-.008.265-.025.398-.058v1.452c-.207.025-.415.042-.606.067a4.85 4.85 0 01-.606.033c-.497 0-.896-.05-1.194-.141-.3-.092-.54-.233-.706-.415a1.44 1.44 0 01-.348-.68c-.058-.274-.1-.59-.108-.938v-5.02h-1.42v-1.42h-.016z"></path>
        <path fill="#00B67A" d="M22.512 8.182h-8.596L11.26 0 8.597 8.182 0 8.174l6.962 5.061-2.664 8.174 6.962-5.054 6.954 5.054-2.655-8.174 6.954-5.053z"></path>
        <path fill="#fff" d="M16.156 15.086l-.598-1.85-4.298 3.12 4.896-1.27z"></path>
      </g>
      <defs>
        <clipPath id="trust-pilot-logo_svg__a">
          <path fill="#fff" d="M0 0h94v23.085H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.405 6.613l-4.022 3.89a.718.718 0 000 1.039.779.779 0 001.074 0l5.32-5.144a.718.718 0 000-1.039L6.458.215A.771.771 0 005.92 0a.771.771 0 00-.537.215.718.718 0 000 1.04l4.022 3.889H.76c-.42 0-.76.329-.76.734 0 .406.34.735.76.735h8.645z" fill="currentColor"></path>
    </svg>
  );
}

export default function ReviewHero({
  productName,
  title,
  subtitle,
  rating,
  reviewCount = '3,598 Reviews',
  authorName,
  authorImage,
  authorSlug,
  authorBio,
  updatedDate,
  readTime,
  productLogo,
  ctaHref,
  ctaText = 'Visit Site',
}: ReviewHeroProps) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <div className="ni-1d7dwkj" data-testid="hero-container">
      <div className="ni-1gazvtv" data-testid="image-container">
        <div className="ni-1ev8jnt">
          <div className="ni-10v1dww">
            {/* Left Column - Content */}
            <div className="ni-12rwozc">
              <div className="ni-1sj3pin" data-testid="titles-container">
                {/* Rating Stars */}
                <div className="ni-1hvuvd0">
                  <div className="row ni-er6zaq">
                    <div className="ni-e61ef4">
                      <div className="tp-stars-icon">
                        {[...Array(fullStars)].map((_, i) => (
                          <StarIcon key={`full-${i}`} filled={true} />
                        ))}
                        {[...Array(emptyStars)].map((_, i) => (
                          <StarIcon key={`empty-${i}`} filled={false} />
                        ))}
                      </div>
                    </div>
                    <span className="ni-13d8pde">{reviewCount}</span>
                    <div className="ni-11i5uvo">
                      <TrustpilotLogo />
                    </div>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div className="ni-1imnl6s">
                  <h1 className="ni-1i24u1f">{title}</h1>
                </div>
                <h3 className="ni-15i95i1">{subtitle}</h3>

                {/* Author Info */}
                <div className="ni-28nsux" data-testid="authors-list">
                  <div className="ni-119xjf7">
                    <div className="author-item ni-1jefdyf" data-testid="author-item">
                      <div className="ni-llnl2v">
                        <div
                          className="ni-15spy0z"
                          data-testid="background-image"
                          style={{ backgroundImage: `url(${authorImage})`, backgroundSize: 'cover', width: '32px', height: '32px', borderRadius: '50%' }}
                        />
                      </div>
                      <div className="ni-15qoik9">
                        <div className="ni-o6vulu">
                          <div className="ni-1c5jt1t"></div>
                          <Link href={`/authors/${authorSlug}`} className="ni-1cilpw2">
                            {authorName}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="ni-11ydt2g" data-testid="data-and-time-read">
                    <p className="ni-177dfrc" data-testid="last-updated">{updatedDate}</p>
                    <p className="ni-177dfrc"> • </p>
                    <p className="ni-177dfrc" data-testid="min-read">{readTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Product Card */}
            <div className="ni-1vyebtr">
              <div className="ni-14shd" data-testid="logo-and-ctas">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={productLogo}
                  alt={productName}
                  className="ni-1uzmobf"
                />
                <div className="ni-wm7fk9">
                  <div className="ni-fndg26">
                    <a
                      href={ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nilink ni-1irj517"
                      data-product-name={productName}
                      data-role="product-cta"
                    >
                      <button className="ni-1f5lmo">
                        <span>{ctaText}</span>
                        <div className="endIcon ni-k15e0p">
                          <ArrowIcon />
                        </div>
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
