// Brand logos data - hardcoded from original template
const brands = [
  { name: 'Better Help', logo: '/top10-images/betterhelp.20240618082918.svg' },
  { name: 'Peddle', logo: '/top10-images/300x100-Dark-NoBg3.20250211121928.svg' },
  { name: 'Sling', logo: '/top10-images/sling.20240618083121.svg' },
  { name: 'GoDaddy', logo: '/top10-images/300x100-Dark-NoBg.20250211121800.svg' },
  { name: 'ADT', logo: '/top10-images/300x100-Dark-NoBg1.20250211121842.svg' },
  { name: 'WIX', logo: '/top10-images/300x100-Dark-NoBg2.20250211121906.svg' },
];

export default function BrandLogos() {
  return (
    <div className="ni-1x0t3k1">
      <div data-testid="brands-strip" className="ni-vocp7d">
        <div data-testid="brands-strip-title" className="ni-1c2opty">
          Explore offers from brands top rated on
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            title="Logo"
            alt="logo"
            src="/top10-images/TP.20240603112537.svg"
            data-testid="brands-strip-logo"
            className="ni-sl7qv"
          />
        </div>
        <div className="ni-dyeu4s">
          {brands.map((brand) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={brand.name}
              src={brand.logo}
              alt={brand.name}
              data-testid="brands-strip-icon"
              className="ni-sbh9k7"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
