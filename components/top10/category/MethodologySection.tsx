interface EvaluationCriteria {
  title: string;
  description: string;
}

interface ExploreCard {
  title: string;
  href: string;
  image: string;
}

interface MethodologySectionProps {
  compareTitle: string;
  compareDescription: string;
  stats: string;
  methodologyTitle: string;
  methodologyIntro: string;
  criteriaTitle: string;
  criteria: EvaluationCriteria[];
  exploreTitle: string;
  exploreCards: ExploreCard[];
}

export default function MethodologySection({
  compareTitle,
  compareDescription,
  stats,
  methodologyTitle,
  methodologyIntro,
  criteriaTitle,
  criteria,
  exploreTitle,
  exploreCards,
}: MethodologySectionProps) {
  return (
    <section data-role="wysiwyg">
      <div className="charticle__wysiwyg">
        {/* Compare With 10rating Box */}
        <div style={{
          margin: '40px 0 0',
          backgroundColor: '#edecf3',
          borderRadius: '4px',
          padding: '20px',
          marginBottom: '40px'
        }}>
          <h2 style={{
            color: '#29256b',
            fontSize: '22px',
            lineHeight: '28px',
            margin: 0,
            marginBottom: '40px'
          }}>
            {compareTitle}
          </h2>
          <p style={{
            color: '#29256b',
            lineHeight: '25px',
            marginBottom: 0
          }}>
            {compareDescription}
            <br /><br />
            <strong>{stats}</strong>
          </p>
        </div>

        {/* Methodology Content */}
        <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
          <h2>{methodologyTitle}</h2>
          <p>
            {methodologyIntro}
          </p>
          <h4><strong>{criteriaTitle}</strong></h4>
          {criteria.map((item, index) => (
            <p key={index}>
              <strong>{item.title}: </strong>
              {item.description}
            </p>
          ))}
          <h2>{exploreTitle}</h2>
        </div>

        {/* Explore Cards */}
        <div style={{
          display: 'flex',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          gap: '10px',
          maxWidth: '100%',
          margin: 'auto'
        }}>
          {exploreCards.map((card, index) => (
            <div
              key={index}
              style={{
                flex: '0 0 200px',
                height: '170px',
                border: '1px solid #000',
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <a
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: 'black',
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  position: 'relative'
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.title}
                  style={{
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                    borderRadius: '8px 8px 0px 0px'
                  }}
                />
                <div style={{
                  textAlign: 'center',
                  position: 'absolute',
                  top: '68%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  padding: '4px 8px',
                  borderRadius: '3px',
                  minWidth: '180px'
                }}>
                  {card.title}
                </div>
                <div style={{
                  width: '200px',
                  textAlign: 'center',
                  position: 'absolute',
                  top: '140px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#ff4a64',
                  color: 'white',
                  padding: '0 0',
                  borderRadius: '0 0 4px 4px',
                  height: '30px',
                  lineHeight: '30px'
                }}>
                  Explore
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
