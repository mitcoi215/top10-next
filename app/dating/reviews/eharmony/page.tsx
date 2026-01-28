'use client';

import '@/styles/category.css';
import '@/styles/review.css';
import SetoffBox from '@/components/top10/category/SetoffBox';
import Navbar from '@/components/top10/category/Navbar';
import Footer from '@/components/top10/category/Footer';
import FAQSection from '@/components/top10/category/FAQSection';
import {
  ReviewHero,
  Highlights,
  ProsAndCons,
  ScoreTable,
  ReviewContent,
  ShortChart,
  MustReads,
} from '@/components/top10/review';

export default function EharmonyReviewPage() {
  const reviewContent = `
    <h2>What is eharmony?</h2>
    <p>eharmony is a popular online dating site that's been around since 2000. It uses a unique compatibility matching system that's based on a comprehensive relationship questionnaire. The site is designed for people who are looking for long-term, committed relationships rather than casual dating.</p>

    <p>What sets eharmony apart from other dating sites is its scientific approach to matchmaking. The site was founded by Dr. Neil Clark Warren, a clinical psychologist who spent 35 years studying the qualities that make marriages successful. His research formed the basis for eharmony's compatibility matching system.</p>

    <div class="video-container">
      <img src="/top10-images/hqdefault.jpg" alt="eharmony video thumbnail" style="width:100%;border-radius:8px;" />
    </div>

    <h2>How Does eharmony Work?</h2>
    <p>When you sign up for eharmony, you'll be asked to complete a detailed compatibility quiz. This quiz takes about 20-30 minutes to complete and covers topics like your personality traits, values, lifestyle preferences, and relationship goals.</p>

    <p>Based on your answers, eharmony's algorithm generates a compatibility score for you and other members. You'll then receive matches based on this score, rather than having to search through profiles yourself.</p>

    <img src="/top10-images/image5.20230206151746.jpg" alt="eharmony profile interface" />

    <h3>Key Features</h3>
    <ul>
      <li><strong>Compatibility Quiz:</strong> A comprehensive questionnaire that helps the algorithm find your best matches</li>
      <li><strong>Guided Communication:</strong> A step-by-step process for getting to know your matches</li>
      <li><strong>Video Date:</strong> Built-in video chat feature for virtual dates</li>
      <li><strong>Profile Verification:</strong> Multiple verification options to ensure authentic profiles</li>
      <li><strong>What If?:</strong> Discover matches outside your usual preferences</li>
    </ul>

    <h2>eharmony Pricing</h2>
    <p>eharmony offers several subscription plans. While you can create a profile and take the compatibility quiz for free, you'll need a paid subscription to communicate with matches and view photos.</p>

    <table>
      <thead>
        <tr>
          <th>Plan</th>
          <th>Duration</th>
          <th>Monthly Cost</th>
          <th>Total Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Premium Light</td>
          <td>6 months</td>
          <td>$65.90</td>
          <td>$395.40</td>
        </tr>
        <tr>
          <td>Premium Plus</td>
          <td>12 months</td>
          <td>$45.90</td>
          <td>$550.80</td>
        </tr>
        <tr>
          <td>Premium Extra</td>
          <td>24 months</td>
          <td>$35.90</td>
          <td>$861.60</td>
        </tr>
      </tbody>
    </table>

    <p>While eharmony is on the pricier side compared to other dating sites, many users feel the cost is worth it for the quality of matches they receive.</p>

    <img src="/top10-images/image1.20230206151817.jpg" alt="eharmony matching system" />

    <h2>Who is eharmony Best For?</h2>
    <p>eharmony is best suited for:</p>
    <ul>
      <li>Singles looking for serious, long-term relationships</li>
      <li>People who prefer a more structured approach to online dating</li>
      <li>Those who value compatibility over physical attraction</li>
      <li>Users aged 30-50 who are ready to settle down</li>
      <li>People who don't have time to browse through endless profiles</li>
    </ul>

    <h2>User Experience</h2>
    <p>eharmony's website and mobile app are clean and easy to navigate. The interface is modern and intuitive, making it simple to view matches, send messages, and update your profile.</p>

    <p>The mobile app is available for both iOS and Android devices and includes all the features of the desktop site. You can receive push notifications for new matches and messages, making it easy to stay connected on the go.</p>

    <img src="/top10-images/image2.20230206151908.jpg" alt="eharmony mobile app" />

    <h2>Safety and Privacy</h2>
    <p>eharmony takes user safety seriously. The site uses secure encryption to protect your personal information and offers various verification options to help ensure you're talking to real people.</p>

    <p>You can also control who sees your profile and photos, and the site has a dedicated team that monitors for suspicious activity. If you encounter any issues, eharmony's customer support team is available to help.</p>

    <h2>Bottom Line</h2>
    <p>eharmony is a solid choice for singles who are serious about finding a long-term partner. While it's more expensive than some other dating sites, the quality of matches and the site's focus on compatibility make it a worthwhile investment for many users.</p>

    <p>If you're looking for casual dating or don't have the patience for a lengthy questionnaire, eharmony might not be the right fit. But if you're ready to find your life partner and want a more structured approach to online dating, eharmony is definitely worth considering.</p>
  `;

  return (
    <div className="review-page ni-1le0256">
      {/* 1. SetoffBox */}
      <SetoffBox />

      {/* 2. Navbar */}
      <Navbar categorySlug="dating" />

      {/* 3. Review Hero */}
      <ReviewHero
        productName="eharmony"
        title="eharmony Dating Site Review (2026)"
        subtitle="Trusted Dating App for Finding True Love"
        rating={3}
        reviewCount="3,598 Reviews"
        authorName="Catherine Miller"
        authorImage="/top10-images/Catherine Miller.20210727134506.jpg"
        authorSlug="catherine-miller"
        updatedDate="June 27, 2025"
        readTime="5 min"
        productLogo="/top10-images/2023_Logo_Eharmony.20231224094829.svg"
        ctaHref="https://www.eharmony.com"
        ctaText="Visit Site"
      />

      {/* Main Content Area */}
      <div className="review-main-content">
        {/* Left Column - Main Content */}
        <div className="review-main-left">
          {/* 4. Highlights */}
          <Highlights
            items={[
              { title: 'Best For', value: 'Serious Relationships' },
              { title: 'Starting Price', value: '$35.90/month' },
              { title: 'Active Users', value: '16M+' },
            ]}
          />

          {/* 6. Pros and Cons */}
          <ProsAndCons
            pros={[
              'In-depth compatibility matching system',
              'High-quality, serious-minded user base',
              'Video date feature for virtual meetings',
            ]}
            cons={[
              'Expensive compared to other dating sites',
              'Lengthy sign-up process (20-30 minutes)',
            ]}
          />

          {/* 7. Score Table */}
          <ScoreTable
            title="Our Ratings"
            overallScore={8.5}
            items={[
              { category: 'Ease of Use', score: 9.0 },
              { category: 'Quality of Matches', score: 9.2 },
              { category: 'Features', score: 8.0 },
              { category: 'Value for Money', score: 7.5 },
              { category: 'Customer Support', score: 8.8 },
            ]}
          />

          {/* 8. Review Content */}
          <ReviewContent content={reviewContent} />

          {/* 9. FAQ Section */}
          <FAQSection
            items={[
              {
                question: 'Is it worth paying for eharmony?',
                answer: 'eharmony is worth the investment if you\'re looking for a serious, long-term relationship. The site\'s compatibility matching system and quality user base make it a solid choice for those ready to settle down.',
              },
              {
                question: 'How much does eharmony cost?',
                answer: 'eharmony offers subscription plans ranging from $35.90 to $65.90 per month, depending on the length of your subscription. Longer subscriptions offer better value per month.',
              },
              {
                question: 'Can you use eharmony for free?',
                answer: 'You can create a profile and complete the compatibility quiz for free. However, you\'ll need a paid subscription to view photos and communicate with matches.',
              },
              {
                question: 'Is eharmony only for marriage?',
                answer: 'While eharmony is designed for people seeking serious relationships, not everyone on the site is specifically looking for marriage. However, the majority of users are interested in long-term, committed partnerships.',
              },
              {
                question: 'How long does the eharmony quiz take?',
                answer: 'The eharmony compatibility quiz takes approximately 20-30 minutes to complete. It\'s comprehensive but essential for the matching algorithm to work effectively.',
              },
            ]}
          />
        </div>

        {/* Right Column - Sidebar */}
        <aside className="review-sidebar">
          {/* Short Chart - Editorial Reviews */}
          <ShortChart
            title="Editorial Reviews"
            products={[
              {
                position: 1,
                name: 'Match',
                logo: '/top10-images/Match.com_icon.202103141254011.20220908065559.png',
                tagline: 'Pair off with Match',
                reviewHref: '/dating/reviews/match',
                ctaHref: 'https://www.match.com',
              },
              {
                position: 2,
                name: 'Zoosk',
                logo: '/top10-images/Zoosk_icon.20210325051144.20220805071607.png',
                tagline: 'Find your perfect match',
                reviewHref: '/dating/reviews/zoosk',
                ctaHref: 'https://www.zoosk.com',
              },
              {
                position: 3,
                name: 'OurTime',
                logo: '/top10-images/ourtime.20181008112848.png',
                tagline: 'Dating for 50+',
                reviewHref: '/dating/reviews/ourtime',
                ctaHref: 'https://www.ourtime.com',
              },
              {
                position: 4,
                name: 'DateMyAge',
                logo: '/top10-images/DateMyAge_icon.20201218133034.png',
                tagline: 'Meet mature singles',
                reviewHref: '/dating/reviews/datemyage',
                ctaHref: 'https://www.datemyage.com',
              },
              {
                position: 5,
                name: 'eharmony',
                logo: '/top10-images/2023_Favicon_Eharmony.20231224094837.svg',
                tagline: 'Serious relationships',
                reviewHref: '/dating/reviews/eharmony',
                ctaHref: 'https://www.eharmony.com',
              },
            ]}
          />
        </aside>
      </div>

      {/* Must Reads Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px 48px',
      }}>
        <MustReads
          title="Must Reads"
          articles={[
            {
              title: 'Best Dating Sites for Seniors',
              image: '/top10-images/image5.20230206151746.jpg',
              href: '/dating/best-senior-dating-sites',
            },
            {
              title: 'How to Write the Perfect Dating Profile',
              image: '/top10-images/image1.20230206151817.jpg',
              href: '/dating/perfect-dating-profile',
            },
            {
              title: 'Online Dating Safety Tips',
              image: '/top10-images/image2.20230206151908.jpg',
              href: '/dating/online-dating-safety',
            },
          ]}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
