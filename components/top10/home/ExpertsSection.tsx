const experts = [
  {
    name: 'Suzannah Weiss, Dating Coach',
    image: '/top10-images/Frame1968.20240603103350.png',
    href: 'https://www.top10.com/authors/suzannah-weiss',
  },
  {
    name: 'Katherine Cullen, Licensed Clinical Social Worker',
    image: '/top10-images/Frame1967.20240603103412.png',
    href: 'https://www.top10.com/authors/katherine-cullen',
  },
  {
    name: 'Antonia Greco, Personal Development Coach',
    image: '/top10-images/Group1100.20240624102950.png',
    href: 'https://www.top10.com/authors/antonia-greco',
  },
  {
    name: 'Lauren Gillan, Certified Holistic Nutritionist',
    image: '/top10-images/Frame1970.20240603103453.png',
    href: 'https://www.top10.com/authors/lauren-gillan',
  },
  {
    name: 'Cassidy Horton, Personal Finance Expert',
    image: '/top10-images/Frame1983.20240625083440.png',
    href: 'https://www.top10.com/authors/cassidy-horton',
  },
];

export default function ExpertsSection() {
  return (
    <div style={{
      backgroundColor: '#F8F6FC',
      padding: '20px',
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: '1090px',
      margin: 'auto',
      height: 'auto',
      overflow: 'visible',
      marginTop: '4%',
      marginBottom: '5%'
    }}>
      <h3 className="ni-9j1xd0" style={{ margin: '0 0 20px', textAlign: 'center' }}>Our Experts</h3>

      <div style={{
        margin: '0 auto 30px',
        maxWidth: '900px',
        color: '#333',
        textAlign: 'center',
        overflow: 'visible',
        fontSize: '18px'
      }}>
        At Top10.com, our team is a dynamic blend of industry experts, passionate writers, and technical specialists. United by a common goal to empower consumers, we handpick our experts based on their extensive experience with the services we review. Each member brings a unique perspective and expertise, ensuring that the insights we offer are well-rounded and thoroughly researched.
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
        {experts.map((expert, idx) => (
          <a
            key={idx}
            href={expert.href}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              width: '100%',
              maxWidth: '170px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingLeft: '5px',
              position: 'relative'
            }}
          >
            <div style={{
              backgroundImage: `url('${expert.image}')`,
              width: '100%',
              height: 0,
              paddingTop: '100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              borderRadius: '0.25rem',
              display: 'block',
              overflow: 'hidden'
            }}></div>
            <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{expert.name}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
