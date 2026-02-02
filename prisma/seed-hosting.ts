/**
 * Seed script for Hosting category
 * Data scraped from 10rating/hosting template
 *
 * Run with: npx ts-node prisma/seed-hosting.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedHostingCategory() {
  console.log('Seeding Hosting category with scraped data...');

  // 1. Create or find the author (Cameron Coward from the template)
  const author = await prisma.author.upsert({
    where: { slug: 'cameron-coward' },
    update: {
      bio: 'Cameron Coward writes for 10rating and is a former mechanical designer, tech enthusiast, writer and published author. His experience as a tech writer spans 15 years, during which time he has written thousands of articles for a number of leading publications.',
      socialLinks: {
        website: 'https://cameroncoward.com/',
        twitter: 'https://twitter.com/cameron_coward',
        linkedin: 'https://www.linkedin.com/in/cameron-coward-4b0abb1a4/',
      },
    },
    create: {
      slug: 'cameron-coward',
      name: 'Cameron Coward',
      avatar: 'https://images.10rating/c_fill,f_auto,g_faces,q_auto,w_88/v1/production/authors/uploads/photo/CameronCoward.20230101074410.jpg',
      title: 'Tech Writer',
      bio: 'Cameron Coward writes for 10rating and is a former mechanical designer, tech enthusiast, writer and published author. His experience as a tech writer spans 15 years, during which time he has written thousands of articles for a number of leading publications.',
      socialLinks: {
        website: 'https://cameroncoward.com/',
        twitter: 'https://twitter.com/cameron_coward',
        linkedin: 'https://www.linkedin.com/in/cameron-coward-4b0abb1a4/',
      },
    },
  });
  console.log('Author created/found:', author.name);

  // 2. FAQs extracted from the template
  const faqs = [
    {
      question: 'Does web hosting include a website builder?',
      answer: 'Yes, some web hosting services do include a website builder, but not all of them. The hosts listed in this review, however, have WordPress hosting plans. WordPress is a CMS (an application used to create, edit and publish websites) with hundreds of free templates available so that anyone can easily build their own site.',
    },
    {
      question: 'Does it make a difference which web hosting service I use?',
      answer: 'Yes, for most people, the web hosting service does make a difference. If you only need a few static pages (or simple "coming soon" placeholder pages), any web hosting service will work. But if you want a more modern, dynamic website, consider the features provided by the top hosting services outlined in this article.',
    },
    {
      question: 'Can I publish a website on the internet without using a web hosting service?',
      answer: "While it's arguably possible to do so, self-hosting a website requires technical expertise, hardware, and server space. Even with these, a self-hosted site won't deliver the performance or resiliency of one that's hosted by a professional service. For example, if you get a lot of visitors or your internet connection fails, your website will be unavailable.",
    },
    {
      question: "What's the difference between a web host and a web builder?",
      answer: 'A web host is a company that provides the servers your website lives in, so visitors can access it through their internet connection. A web builder is an online internet application that helps you create a website, which you then upload to a hosting server when it\'s ready to "go live" online. Some web hosts include web builders, but you don\'t need to use them. Experienced web developers can build their own websites, while others may choose a CMS like WordPress.',
    },
    {
      question: 'How many types of web hosting services are there?',
      answer: 'There are generally four major types of hosting services: shared, dedicated, VPS, and cloud. Most providers offer shared and dedicated hosting plans for both WordPress and custom sites. Others include additional hosting services, like managed hosting, cloud hosting, VPS, and reseller hosting.',
    },
    {
      question: 'What are the most secure web hosting companies?',
      answer: "Our research determined that GoDaddy, IONOS, A2 Hosting, and Rocket.net offer the most robust security. Look at secure web hosting from two perspectives: the host's own security, and the security tools they provide for you to use. The first is difficult to compare, as hosts generally don't publish information on the security measures they have in place at their data centers. But the second can be explored by looking at what hosts include in their plans.",
    },
  ];

  // 3. Methodology Criteria
  const methodologyCriteria = [
    {
      title: 'Performance & Speed',
      description: 'We test server response times, page load speeds, and uptime guarantees across all hosting providers.',
    },
    {
      title: 'Security Features',
      description: 'We evaluate SSL certificates, malware protection, DDoS mitigation, and backup solutions included with each plan.',
    },
    {
      title: 'Customer Support',
      description: 'We assess 24/7 support availability, response times, knowledge base quality, and support channel options.',
    },
    {
      title: 'Ease of Use',
      description: 'We review control panel interfaces, one-click installers, and overall user experience for beginners and experts.',
    },
    {
      title: 'Value for Money',
      description: 'We compare pricing, renewal rates, included features, and money-back guarantees to determine the best value.',
    },
  ];

  // 4. Criteria Definitions for scoring
  const criteriaDefinitions = [
    { key: 'performance', label: 'Performance', maxScore: 10 },
    { key: 'security', label: 'Security', maxScore: 10 },
    { key: 'support', label: 'Customer Support', maxScore: 10 },
    { key: 'ease_of_use', label: 'Ease of Use', maxScore: 10 },
    { key: 'value', label: 'Value for Money', maxScore: 10 },
  ];

  // 5. Highlight Definitions
  const highlightDefinitions = [
    { key: 'uptime', label: 'Uptime Guarantee' },
    { key: 'free_domain', label: 'Free Domain' },
    { key: 'free_ssl', label: 'Free SSL' },
    { key: 'money_back', label: 'Money-Back Guarantee' },
    { key: 'support_24_7', label: '24/7 Support' },
  ];

  // 6. Explore Cards
  const exploreCards = [
    { title: 'WordPress Hosting', href: '/wordpress-hosting', image: '/top10-images/categories/wordpress-hosting.jpg' },
    { title: 'VPS Hosting', href: '/vps-hosting', image: '/top10-images/categories/vps-hosting.jpg' },
    { title: 'Cloud Hosting', href: '/cloud-hosting', image: '/top10-images/categories/cloud-hosting.jpg' },
    { title: 'Dedicated Hosting', href: '/dedicated-hosting', image: '/top10-images/categories/dedicated-hosting.jpg' },
  ];

  // 7. Update Hosting category
  const category = await prisma.category.upsert({
    where: { slug: 'hosting' },
    update: {
      name: 'Web Hosting',
      icon: '🌐',
      color: 'bg-blue-500',
      description: 'Compare the best web hosting services for your website',
      featured: true,
      order: 1,
      authorId: author.id,

      // SEO Meta
      metaTitle: 'Top 10 Best Web Hosting Services & Companies 2026',
      metaDescription: 'Check out our picks for the best web hosting companies for 2026 with features like zero bandwidth limits, free website builders, and uptime guarantees.',
      ogImage: '/top10-images/categories/hosting-og.jpg',

      // Hero Section
      heroImage: '/top10-images/categories/hosting-hero.jpg',
      heroTitle: 'Top 10 Best Web Hosting Services & Companies 2026',

      // Intro Content
      introContent: `<p>Finding the right web hosting service is crucial for your website's success. Whether you're launching a personal blog, a business website, or an e-commerce store, the hosting provider you choose directly impacts your site's speed, security, and reliability.</p>
<p>We've tested and compared the leading web hosting companies to help you make an informed decision. Our expert team evaluated each provider on performance, security features, customer support, ease of use, and overall value for money.</p>
<p>From budget-friendly shared hosting to powerful dedicated servers, our comprehensive guide covers all the options available in 2026. Read on to discover which hosting service is the best fit for your specific needs.</p>`,

      // Best Of List Title
      bestOfListTitle: 'Our Top 10 Best Web Hosting Services:',

      // Definitions
      criteriaDefinitions: criteriaDefinitions,
      highlightDefinitions: highlightDefinitions,

      // Methodology Section
      methodologyIntro: 'Our team of hosting experts conducts thorough testing of each web hosting service. We create real websites, measure actual performance metrics, and evaluate customer support quality to provide you with accurate, unbiased recommendations.',
      methodologyTitle: 'Our Methodology: How We Reviewed the Best Web Hosting Services',
      criteriaTitle: 'Here are the key criteria we evaluated:',
      methodologyCriteria: methodologyCriteria,

      // Compare Box
      compareBoxTitle: 'Compare With 10rating, Choose the Best for You',
      compareBoxDescription: 'Our team of hosting experts evaluates each service to help you make an informed decision.',
      compareBoxStats: '50+ Hosting Services Evaluated',

      // Explore Section
      exploreTitle: 'Explore More Hosting Options:',
      exploreCards: exploreCards,

      // Closer Look Section
      closerLookTitle: 'A Closer Look at the Top 10 Web Hosting Services',

      // Sidebar
      sidebarPeopleCount: '50,000+',

      // FAQs
      faqs: faqs,

      // Last Updated
      lastUpdated: new Date(),
    },
    create: {
      slug: 'hosting',
      name: 'Web Hosting',
      icon: '🌐',
      color: 'bg-blue-500',
      description: 'Compare the best web hosting services for your website',
      featured: true,
      order: 1,
      authorId: author.id,
      metaTitle: 'Top 10 Best Web Hosting Services & Companies 2026',
      metaDescription: 'Check out our picks for the best web hosting companies for 2026 with features like zero bandwidth limits, free website builders, and uptime guarantees.',
      ogImage: '/top10-images/categories/hosting-og.jpg',
      heroImage: '/top10-images/categories/hosting-hero.jpg',
      heroTitle: 'Top 10 Best Web Hosting Services & Companies 2026',
      introContent: `<p>Finding the right web hosting service is crucial for your website's success.</p>`,
      criteriaDefinitions: criteriaDefinitions,
      highlightDefinitions: highlightDefinitions,
      methodologyCriteria: methodologyCriteria,
      exploreCards: exploreCards,
      faqs: faqs,
    },
  });
  console.log('Hosting category updated:', category.name);

  // 8. Create/Update Products - Data scraped from 10rating template
  // Now includes extended mini-review data: highlights, pros, cons, heroSummary
  const hostingProducts = [
    {
      slug: 'ionos',
      name: 'IONOS',
      rank: 1,
      ribbon: 'Free Domain',
      bestFor: 'Best Overall Value',
      logoUrl: 'https://media.10rating/images/ionos-hosting.svg',
      bottomLine: 'Secure WordPress hosting with faster loading speeds & flexible access',
      basePrice: '$1/mo',
      ctaText: 'Visit Site',
      ctaUrl: 'https://www.ionos.com',
      reviewCount: '38,650',
      reviewHref: '/hosting/reviews/ionos',
      features: [
        { text: 'Personal Consultant', bold: true },
        { text: 'AI-assisted website creation', bold: false },
        { text: 'Wildcard SSL certificates', bold: false },
        { text: 'Scalable performance', bold: false },
      ],
      tagline: 'Professional hosting with personal support',
      overallScore: 9.4,
      scoreLabel: 'Excellent',
      criteriaScores: [
        { category: 'Simple Setup', score: 9.0, description: 'Free domain for one year, email address, 1-click app installation, no cPanel access' },
        { category: 'Technical Features', score: 10.0, description: 'CDN, 99.9% uptime guarantee, unlimited storage, performance insights' },
        { category: 'Security Features', score: 9.5, description: 'Malware & DDoS protection, SSL certificate, daily backups' },
        { category: 'Customer Service', score: 9.0, description: 'Phone support, online help center and support desk' },
        { category: 'Servers', score: 9.5, description: 'Data centers located in Europe and the United States, 60+ global CDN data centers' },
      ],
      // Mini-review extended fields
      highlights: {
        'Price': 'Starting at $1/month',
        'Types of Hosting Plans': 'Web, WordPress, Windows, Dedicated, VPS, Shared, Cloud, eCommerce',
        'Storage': 'Up to 64 GB',
      },
      summaryTitle: 'Is IONOS Worth Signing Up For?',
      heroSummary: 'IONOS provides a variety of affordable web hosting options ranging from shared hosting through to dedicated and managed VPS. The speed-optimized network boasts page load times that they say are faster than most of the top competitors. As well as full-stack security features, IONOS also offers free Domains and SSL. For WordPress fans, there\'s managed WordPress hosting with easy 1-click setup.',
      mainContent: `<h2>IONOS at a Glance</h2>
<p><strong>Bandwidth: </strong>Unlimited</p>
<p><strong>Uptime:</strong> 99.99%</p>
<p><strong>Website builder: </strong>Yes</p>
<p><strong>Money-back guarantee:</strong> 30 days</p>
<p><strong>Customer service:</strong> Available 24/7</p>
<p><strong>Price per month:</strong> From $1 per month (first 12 months)</p>

<h2>Ideal For</h2>
<p>IONOS is particularly well-suited for hosting WordPress websites, offering specialized solutions that enhance both performance and security tailored to the popular content management system. This makes it an excellent choice for bloggers, small to medium businesses, and even larger enterprises that prioritize a robust online presence with WordPress.</p>
<p>Additionally, IONOS caters to a wide range of other web hosting needs, making it versatile enough to support various types of websites and applications. Whether you are starting a new project or scaling an existing one, IONOS provides the tools and resources needed for success.</p>

<h2>Hosting Types</h2>
<h3>Shared Hosting</h3>
<p>IONOS has a wide variety of hosting plans. These start out at the shared hosting tier, in which clients can opt for 1 of 3 different types of hosting.</p>
<p>The Essential plan (shared hosting) allows users to build 1 website with 10GB of total disk space / storage. Ten databases and email accounts are included. By upgrading one notch to Business hosting, users get unlimited websites, storage, and databases. On the top shared plan, users will get access to malware protection, 100 email accounts, and a free domain.</p>

<h3>WordPress Hosting</h3>
<p>IONOS offers a separate line of shared hosting packages that are specifically optimized for WordPress sites. These offer SSD storage, for faster server disk performance, as well as enhanced CPU and MEM resources.</p>
<p>Additionally, IONOS's WordPress hosting includes a content delivery network (CDN) for faster loading of images and other static resources. The CDN uses Cloudflare Railgun technology which delivers performance gains of up to 200%.</p>

<h3>VPS And Dedicated</h3>
<p>Finally, for more advanced users, IONOS offers both VPS and dedicated hosting.</p>
<p>The VPS service is managed and virtualization is delivered via VMWare on dedicated SSD storage. Users get full root access to the server for full administrative control.</p>

<h2>IONOS AI Features</h2>
<p>IONOS has embraced artificial intelligence to significantly enhance the web hosting and website creation experience:</p>
<p><strong>AI Website Builder:</strong> This tool simplifies the process of creating a website by automatically handling design, text, and image generation based on user input.</p>
<p><strong>AI Text and Image Generation:</strong> IONOS offers advanced AI tools to generate textual content and images.</p>
<p><strong>AI SEO Optimization:</strong> The AI SEO Text Generator helps improve website visibility through metadata enhancements.</p>

<h2>Uptime and Performance</h2>
<p>If you need to make sure that your website gets on the internet and then stays that way, then IONOS's 99.99% uptime guarantee will give you some reassurance. There's also DDoS protection in place to minimize attack-related downtime.</p>

<h2>IONOS Security Features</h2>
<p>IONOS prioritizes security with its comprehensive suite of features designed to protect websites and data. Their hosting plans include free SSL certificates, enhancing site security and visitor trust. Additionally, IONOS employs robust firewalls and DDoS protection measures to guard against external threats.</p>

<h2>IONOS Customer Support</h2>
<p>IONOS offers free 24/7 customer support. You can reach out to the IONOS team through phone, a support desk, or via the online help center. IONOS has a team of specially trained experts on hand who are ready to help with all hosting-related questions.</p>

<h2>IONOS Pricing & Special Offers</h2>
<p>IONOS offers a range of web hosting plans designed to cater to different needs and budgets, starting as low as $1 per month for the first year under specific promotional conditions. It's important to note that this offer is only available for the first year, after which this specific plan will cost $12 per month.</p>

<h2>Bottom Line</h2>
<p>IONOS offers a robust web hosting solution that balances affordability, flexibility, and comprehensive security features, making it an excellent choice for both new and experienced users. While it shines with fast load speeds, reliable uptime, and specialized services for WordPress websites, some users might find the service options complex at first. However, the 24/7 customer support and the array of features from free domains to full-stack security measures make IONOS a competitive option for anyone seeking a solid online presence.</p>`,
      pros: [
        'Wide variety of hosting packages',
        'Fast SSD storage',
        '99.9% uptime',
      ],
      cons: [
        'Higher prices after 1st year',
        'Email limit on lower tiers',
      ],
    },
    {
      slug: 'godaddy',
      name: 'GoDaddy',
      rank: 2,
      bestFor: 'Best for Domain Management',
      logoUrl: 'https://media.10rating/images/GoDaddyHosting.svg',
      bottomLine: 'Reliable hosting with free domain & easy website builder tools',
      basePrice: '$5.99/mo',
      ctaText: 'Visit Site',
      ctaUrl: 'https://www.godaddy.com',
      reviewCount: '73,556',
      reviewHref: '/hosting/reviews/godaddy',
      features: [
        { text: 'Free domain name (1st yr. on annual plans)', bold: true },
        { text: 'One-click WordPress install', bold: false },
        { text: '125+ free applications', bold: false },
        { text: 'Unmetered bandwidth', bold: false },
      ],
      tagline: 'All-in-one online solution',
      overallScore: 9.6,
      scoreLabel: 'Excellent',
      criteriaScores: { performance: 9.4, security: 9.5, support: 9.6, ease_of_use: 9.8, value: 9.5 },
      highlights: {
        'Price per month': '$5.99',
        'Money-back guarantee': '30 days',
        'Uptime': '99.97%',
      },
      heroSummary: '<p>GoDaddy has evolved from just a domain registrar to a comprehensive web hosting provider. Their hosting platform seamlessly integrates with domain management, making it an ideal choice if you want to manage everything in one place.</p><p>With over 125 free applications available through one-click install, including WordPress, GoDaddy makes it easy to set up your site quickly. Their unmetered bandwidth means you won\'t face overage charges as your site traffic grows.</p>',
      pros: [
        'Free domain name with annual plans',
        'Unmetered bandwidth on all plans',
        '125+ one-click install applications',
        'Excellent domain management integration',
        '24/7 customer support',
      ],
      cons: [
        'Higher renewal prices',
        'Email hosting costs extra',
        'Some upsells during checkout',
      ],
    },
    {
      slug: 'bluehost',
      name: 'Bluehost',
      rank: 3,
      ribbon: 'WordPress Recommended',
      bestFor: 'Best for WordPress',
      logoUrl: 'https://media.10rating/images/bluehost.svg',
      bottomLine: 'Official WordPress recommended hosting with easy 1-click install',
      basePrice: '$2.95/mo',
      ctaText: 'Visit Site',
      ctaUrl: 'https://www.bluehost.com',
      reviewCount: '11,019',
      reviewHref: '/hosting/reviews/bluehost',
      features: [
        { text: 'Free domain name (1st yr.)', bold: true },
        { text: 'Free SSL certificate', bold: false },
        { text: '1-click WordPress install', bold: false },
        { text: '24/7 support', bold: false },
      ],
      tagline: 'WordPress hosting made simple',
      overallScore: 9.4,
      scoreLabel: 'Excellent',
      criteriaScores: { performance: 9.3, security: 9.4, support: 9.5, ease_of_use: 9.7, value: 9.3 },
      highlights: {
        'Price per month': '$2.95',
        'Money-back guarantee': '30 days',
        'Uptime': '99.99%',
      },
      heroSummary: '<p>Bluehost is officially recommended by WordPress.org, and for good reason. Their hosting platform is optimized specifically for WordPress, offering seamless integration and excellent performance for WordPress sites.</p><p>The 1-click WordPress install gets your site up and running in minutes, while the included free SSL certificate ensures your site is secure from day one. With 24/7 expert support, help is always available when you need it.</p>',
      pros: [
        'Officially recommended by WordPress.org',
        'Free domain and SSL certificate included',
        '1-click WordPress installation',
        'Optimized for WordPress performance',
        'Beginner-friendly interface',
      ],
      cons: [
        'Higher renewal rates after first term',
        'Basic plan limited to one website',
        'Site migration not free on basic plan',
      ],
    },
    {
      slug: 'siteground',
      name: 'SiteGround',
      rank: 4,
      bestFor: 'Best for E-commerce',
      logoUrl: 'https://media.10rating/images/siteground.svg',
      bottomLine: 'Premium hosting with AI site-building tools & top-tier support',
      basePrice: '$2.99/mo',
      ctaText: 'Visit Site',
      ctaUrl: 'https://www.siteground.com',
      reviewCount: '18,764',
      reviewHref: '/hosting/reviews/siteground',
      features: [
        { text: 'AI tools for site-building', bold: true },
        { text: 'Free email', bold: false },
        { text: 'Free SSL', bold: false },
        { text: 'Free CDN', bold: false },
      ],
      tagline: 'Premium hosting made accessible',
      overallScore: 9.3,
      scoreLabel: 'Excellent',
      criteriaScores: { performance: 9.4, security: 9.5, support: 9.6, ease_of_use: 9.0, value: 9.0 },
      highlights: {
        'Price per month': '$2.99',
        'Money-back guarantee': '30 days',
        'Uptime': '99.99%',
      },
      heroSummary: '<p>SiteGround delivers premium hosting quality at accessible prices. Their AI-powered site-building tools make creating professional websites easier than ever, while their custom-built speed technologies ensure excellent performance.</p><p>For e-commerce, SiteGround shines with PCI compliance, daily backups, and staging environments for testing changes. Their support team consistently receives high marks for expertise and responsiveness.</p>',
      pros: [
        'AI-powered website building tools',
        'Free email, SSL, and CDN included',
        'Excellent for e-commerce sites',
        'Top-rated customer support',
        'Daily automatic backups',
      ],
      cons: [
        'Limited storage on basic plans',
        'Higher renewal prices',
        'Only one website on starter plan',
      ],
    },
    {
      slug: 'network-solutions',
      name: 'Network Solutions',
      rank: 5,
      bestFor: 'Best for Domain Services',
      logoUrl: 'https://media.10rating/images/NetworkSolutions.svg',
      bottomLine: 'Trusted domain registrar with reliable web hosting solutions',
      basePrice: '$5.69/mo',
      ctaText: 'Visit Site',
      ctaUrl: 'https://www.networksolutions.com',
      reviewCount: '4,832',
      reviewHref: '/hosting/reviews/network-solutions',
      features: [
        { text: 'Website builder included', bold: true },
        { text: 'Free SSL certificate', bold: false },
        { text: '24/7 customer support', bold: false },
        { text: '30-day money-back guarantee', bold: false },
      ],
      tagline: 'Trusted domain and hosting provider',
      overallScore: 9.1,
      scoreLabel: 'Very Good',
      criteriaScores: { performance: 9.0, security: 9.2, support: 9.0, ease_of_use: 9.1, value: 9.0 },
      highlights: {
        'Price per month': '$5.69',
        'Money-back guarantee': '30 days',
        'Uptime': '99.97%',
      },
      heroSummary: '<p>Network Solutions has been a trusted name in domain registration since the early days of the internet. Their hosting services combine this domain expertise with reliable web hosting.</p><p>The included website builder makes it easy for beginners to create their first site, while the free SSL certificate ensures security from the start.</p>',
      pros: [
        'Trusted brand with long history',
        'Website builder included free',
        'Free SSL certificate',
        '24/7 customer support',
        'Easy domain management',
      ],
      cons: [
        'Higher pricing than competitors',
        'Limited advanced features',
        'Basic plan storage is limited',
      ],
    },
    {
      slug: 'hostinger',
      name: 'Hostinger',
      rank: 6,
      bestFor: 'Best Budget Option',
      logoUrl: 'https://media.10rating/images/hostinger.svg',
      bottomLine: 'Affordable hosting with fast performance & 99.9% uptime guarantee',
      basePrice: '$2.99/mo',
      ctaText: 'Visit Site',
      ctaUrl: 'https://www.hostinger.com',
      reviewCount: '25,432',
      reviewHref: '/hosting/reviews/hostinger',
      features: [
        { text: 'Powers 2M+ websites worldwide', bold: true },
        { text: 'Free domain & SSL certificate', bold: false },
        { text: '99.9% uptime guarantee', bold: false },
        { text: '24/7 customer support', bold: false },
      ],
      tagline: 'Premium hosting at affordable prices',
      overallScore: 9.0,
      scoreLabel: 'Very Good',
      criteriaScores: { performance: 9.2, security: 9.0, support: 9.3, ease_of_use: 9.5, value: 9.6 },
      highlights: {
        'Price per month': '$2.99',
        'Money-back guarantee': '30 days',
        'Uptime': '99.9%',
      },
      heroSummary: '<p>Hostinger proves that affordable hosting doesn\'t mean compromising on quality. Powering over 2 million websites worldwide, they\'ve refined their platform to deliver excellent performance at budget-friendly prices.</p><p>Their hosting plans include free domain and SSL certificates, making the total cost of ownership very competitive.</p>',
      pros: [
        'Very affordable pricing',
        'Free domain and SSL included',
        '99.9% uptime guarantee',
        'User-friendly control panel',
        'Good performance for the price',
      ],
      cons: [
        'Phone support not available',
        'Basic plan has limited features',
        'Renewal prices increase',
      ],
    },
    {
      slug: 'hostgator',
      name: 'HostGator',
      rank: 7,
      bestFor: 'Best for Beginners',
      logoUrl: 'https://media.10rating/images/hostgator.svg',
      bottomLine: 'User-friendly hosting with unmetered bandwidth & 45-day guarantee',
      basePrice: '$2.75/mo',
      ctaText: 'Visit Site',
      ctaUrl: 'https://www.hostgator.com',
      reviewCount: '15,876',
      reviewHref: '/hosting/reviews/hostgator',
      features: [
        { text: 'Unmetered bandwidth & storage', bold: true },
        { text: 'Free website builder included', bold: false },
        { text: 'Free SSL certificate', bold: false },
        { text: '45-day money-back guarantee', bold: false },
      ],
      tagline: 'Hosting for everyone',
      overallScore: 8.9,
      scoreLabel: 'Very Good',
      criteriaScores: { performance: 8.8, security: 8.7, support: 9.2, ease_of_use: 9.4, value: 9.1 },
      highlights: {
        'Price per month': '$2.75',
        'Money-back guarantee': '45 days',
        'Uptime': '99.9%',
      },
      heroSummary: '<p>HostGator is a fantastic choice for beginners thanks to their intuitive control panel and excellent customer support. The 45-day money-back guarantee gives you extra time to evaluate the service.</p><p>Unmetered bandwidth and storage means you won\'t face unexpected charges as your site grows.</p>',
      pros: [
        'Unmetered bandwidth and storage',
        '45-day money-back guarantee',
        'Free website builder',
        'Beginner-friendly interface',
        'Reliable customer support',
      ],
      cons: [
        'Performance can vary',
        'Higher renewal rates',
        'Some features require higher tiers',
      ],
    },
    {
      slug: 'dreamhost',
      name: 'DreamHost',
      rank: 8,
      bestFor: 'Best for Developers',
      logoUrl: 'https://media.10rating/images/dreamhost.svg',
      bottomLine: 'Developer-friendly hosting with 97-day money-back guarantee',
      basePrice: '$2.59/mo',
      ctaText: 'Visit Site',
      ctaUrl: 'https://www.dreamhost.com',
      reviewCount: '8,234',
      reviewHref: '/hosting/reviews/dreamhost',
      features: [
        { text: '97-day money-back guarantee', bold: true },
        { text: 'Free domain privacy protection', bold: false },
        { text: 'Unlimited traffic', bold: false },
        { text: 'SSD storage on all plans', bold: false },
      ],
      tagline: 'Hosting with freedom',
      overallScore: 8.8,
      scoreLabel: 'Very Good',
      criteriaScores: { performance: 8.9, security: 9.0, support: 8.5, ease_of_use: 8.7, value: 9.2 },
      highlights: {
        'Price per month': '$2.59',
        'Money-back guarantee': '97 days',
        'Uptime': '100%',
      },
      heroSummary: '<p>DreamHost stands out with an industry-leading 97-day money-back guarantee – more than triple what most competitors offer. Their developer-friendly features include SSH access, staging environments, and support for multiple programming languages.</p><p>The 100% uptime guarantee (with compensation for any downtime) shows their confidence in their infrastructure.</p>',
      pros: [
        'Industry-leading 97-day money-back guarantee',
        '100% uptime guarantee',
        'Free domain privacy protection',
        'Developer-friendly features',
        'SSD storage on all plans',
      ],
      cons: [
        'No phone support',
        'Custom control panel takes adjustment',
        'Email hosting costs extra',
      ],
    },
    {
      slug: 'a2-hosting',
      name: 'A2 Hosting',
      rank: 9,
      bestFor: 'Best for Speed',
      logoUrl: 'https://media.10rating/images/a2hosting.svg',
      bottomLine: 'High-speed hosting with Turbo Servers for 20X faster performance',
      basePrice: '$2.99/mo',
      ctaText: 'Visit Site',
      ctaUrl: 'https://www.a2hosting.com',
      reviewCount: '6,543',
      reviewHref: '/hosting/reviews/a2-hosting',
      features: [
        { text: 'Turbo Servers for 20X faster speeds', bold: true },
        { text: 'Free site migration', bold: false },
        { text: 'Anytime money-back guarantee', bold: false },
        { text: 'Free SSL & SSD storage', bold: false },
      ],
      tagline: 'Speed you can depend on',
      overallScore: 8.6,
      scoreLabel: 'Good',
      criteriaScores: { performance: 9.4, security: 8.3, support: 8.3, ease_of_use: 8.2, value: 8.5 },
      highlights: {
        'Price per month': '$2.99',
        'Money-back guarantee': 'Anytime',
        'Uptime': '99.9%',
      },
      heroSummary: '<p>A2 Hosting is built for speed enthusiasts. Their Turbo Servers deliver up to 20X faster page loads compared to standard hosting, making them ideal for performance-critical websites.</p><p>The anytime money-back guarantee means you can get a refund whenever you\'re not satisfied – no time limits or restrictions.</p>',
      pros: [
        'Turbo Servers for 20X faster speeds',
        'Anytime money-back guarantee',
        'Free site migration',
        'Free SSL and SSD storage',
        'Multiple data center locations',
      ],
      cons: [
        'Turbo features cost extra',
        'Higher-tier plans needed for best performance',
        'Support response times can vary',
      ],
    },
    {
      slug: 'namecheap',
      name: 'Namecheap',
      rank: 10,
      bestFor: 'Best Transparent Pricing',
      logoUrl: 'https://media.10rating/images/namecheap.svg',
      bottomLine: 'Budget-friendly hosting with transparent pricing & free SSL',
      basePrice: '$1.58/mo',
      ctaText: 'Visit Site',
      ctaUrl: 'https://www.namecheap.com',
      reviewCount: '12,187',
      reviewHref: '/hosting/reviews/namecheap',
      features: [
        { text: 'Transparent, honest pricing', bold: true },
        { text: 'Free website migration', bold: false },
        { text: 'Free SSL with every plan', bold: false },
        { text: 'cPanel included', bold: false },
      ],
      tagline: 'Quality hosting at honest prices',
      overallScore: 8.5,
      scoreLabel: 'Good',
      criteriaScores: { performance: 8.3, security: 8.5, support: 8.2, ease_of_use: 8.8, value: 9.2 },
      highlights: {
        'Price per month': '$1.58',
        'Money-back guarantee': '30 days',
        'Uptime': '99.9%',
      },
      heroSummary: '<p>Namecheap lives up to its name with transparent, budget-friendly pricing. Unlike many competitors, their renewal prices are reasonable, and they don\'t try to upsell unnecessary add-ons during checkout.</p><p>Every plan includes free SSL and cPanel access, making it easy to manage your hosting without hidden costs.</p>',
      pros: [
        'Transparent pricing with reasonable renewals',
        'Free website migration',
        'Free SSL with every plan',
        'cPanel included',
        'No aggressive upselling',
      ],
      cons: [
        'Performance is average',
        'Support can be slow',
        'Basic plans have limited resources',
      ],
    },
  ];

  for (const product of hostingProducts) {
    const { criteriaScores, reviewCount, reviewHref, highlights, summaryTitle, heroSummary, mainContent, pros, cons, ...productData } = product;
    const created = await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      update: {
        ...productData,
        scores: criteriaScores,
        reviewCount: reviewCount,
        reviewHref: reviewHref,
        highlights: highlights,
        summaryTitle: summaryTitle,
        heroSummary: heroSummary,
        mainContent: mainContent,
        pros: pros || [],
        cons: cons || [],
        status: 'published',
        categoryId: category.id,
      },
      create: {
        ...productData,
        scores: criteriaScores,
        reviewCount: reviewCount,
        reviewHref: reviewHref,
        highlights: highlights,
        summaryTitle: summaryTitle,
        heroSummary: heroSummary,
        mainContent: mainContent,
        pros: pros || [],
        cons: cons || [],
        categoryId: category.id,
        status: 'published',
      },
    });
    console.log(`Product ${created.rank}. ${created.name} created/updated`);
  }

  console.log('\nHosting category seeding completed!');
  console.log(`- 1 Author: ${author.name}`);
  console.log(`- 1 Category: ${category.name}`);
  console.log(`- ${hostingProducts.length} Products`);
  console.log(`- ${faqs.length} FAQs`);
  console.log(`- ${methodologyCriteria.length} Methodology Criteria`);
}

seedHostingCategory()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
