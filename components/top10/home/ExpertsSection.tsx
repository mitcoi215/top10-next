const defaultExperts = [
  {
    name: 'Suzannah Weiss',
    title: 'Dating Coach',
    avatar: '/top10-images/Frame1968.20240603103350.png',
    slug: 'suzannah-weiss',
  },
  {
    name: 'Katherine Cullen',
    title: 'Licensed Clinical Social Worker',
    avatar: '/top10-images/Frame1967.20240603103412.png',
    slug: 'katherine-cullen',
  },
  {
    name: 'Antonia Greco',
    title: 'Personal Development Coach',
    avatar: '/top10-images/Group1100.20240624102950.png',
    slug: 'antonia-greco',
  },
  {
    name: 'Lauren Gillan',
    title: 'Certified Holistic Nutritionist',
    avatar: '/top10-images/Frame1970.20240603103453.png',
    slug: 'lauren-gillan',
  },
  {
    name: 'Cassidy Horton',
    title: 'Personal Finance Expert',
    avatar: '/top10-images/Frame1983.20240625083440.png',
    slug: 'cassidy-horton',
  },
];

interface Expert {
  id?: string;
  name: string;
  title?: string | null;
  avatar?: string | null;
  slug: string;
}

interface ExpertsSectionProps {
  experts?: Expert[] | null;
}

export default function ExpertsSection({ experts }: ExpertsSectionProps) {
  const displayExperts = experts && experts.length > 0 ? experts : defaultExperts;

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
        {displayExperts.map((expert, idx) => (
          <a
            key={expert.slug || idx}
            href={`/authors/${expert.slug}`}
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
              backgroundImage: `url('${expert.avatar || '/top10-images/default-avatar.png'}')`,
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
            <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
              {expert.name}{expert.title ? `, ${expert.title}` : ''}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
