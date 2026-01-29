interface StatsSectionProps {
  listsCount?: string | null;
  hoursCount?: string | null;
  decisionsCount?: string | null;
}

export default function StatsSection({
  listsCount = '500+',
  hoursCount = '5,000+',
  decisionsCount = '16M+',
}: StatsSectionProps) {
  return (
    <section data-role="wysiwyg" className="homepage-content">
      <div>
        <h2 className="ey2p78p1 ni-6g6o7a exy949e0" style={{ textAlign: 'center' }}>
          We make it easy to find what <span style={{ color: '#FF4A64' }}>you</span> need
        </h2>

        <div style={{
          maxWidth: '1090px',
          height: '130px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '20px',
          boxSizing: 'border-box',
          margin: 'auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{listsCount}</div>
            <div style={{ fontSize: '16px', color: '#555' }}>Comparison Lists</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{hoursCount}</div>
            <div style={{ fontSize: '16px', color: '#555' }}>Hours of Research</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{decisionsCount}</div>
            <div style={{ fontSize: '16px', color: '#555' }}>Decisions made with Top10.com</div>
          </div>
        </div>
      </div>
    </section>
  );
}
