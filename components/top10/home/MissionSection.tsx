export default function MissionSection() {
  return (
    <div style={{ maxWidth: '1130px', margin: 'auto', padding: '20px', boxSizing: 'border-box' }}>
      {/* Our Mission */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        boxSizing: 'border-box',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          flex: '1 1 100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FF4A64',
          borderRadius: '10px 10px 0 0'
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/top10-images/ourmissionTransparentOnMagenta.20240702082951.png"
            alt="Our Story"
            style={{ width: '80%', height: 'auto', margin: 0, borderRadius: '10px 10px 0 0' }}
          />
        </div>

        <div style={{
          flex: '1 1 100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Our Mission</div>
          <div style={{ fontSize: '16px', color: '#555', marginBottom: '10px' }}>
            At Top10.com, our mission is to save you time and money by empowering you to make informed decisions. As a comparison site, we provide all the tools you need to compare options effectively. We are dedicated to thorough research, transparency, and user-focused design, ensuring complex choices are straightforward. We strive to provide you with all the information you need at your fingertips, helping you make decisions with confidence.
          </div>
          <a href="/about-us" style={{ fontSize: '16px', color: '#FF4A64', textDecoration: 'none' }}>Learn More</a>
        </div>
      </div>

      {/* Our Method */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        boxSizing: 'border-box',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          flex: '1 1 100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FF4A64',
          borderRadius: '10px 10px 0 0'
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/top10-images/HowWeScore-TransparentOnMagenta.20240702081503.png"
            alt="Our Mission"
            style={{ width: '80%', height: 'auto', margin: 0, borderRadius: '10px 10px 0 0' }}
          />
        </div>

        <div style={{
          flex: '1 1 100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Our Method</div>
          <div style={{ fontSize: '16px', color: '#555', marginBottom: '10px' }}>
            At Top10.com, our methodology is rigorous and transparent. We combine in-depth research with meticulous testing to ensure our product scores and rankings are both reliable and relevant. Each category is evaluated based on criteria tailored to the specific needs and interests of consumers.<br />
            Our team of handpicked experts reviews products and services, consults user feedback, and examines industry data to provide clear, unbiased ratings. This thorough approach ensures that when you choose from our top 10 lists, you are making a well-informed decision backed by comprehensive analysis.
          </div>
          <a href="https://www.top10.com/how-we-score" style={{ fontSize: '16px', color: '#FF4A64', textDecoration: 'none' }}>Learn More</a>
        </div>
      </div>
    </div>
  );
}
