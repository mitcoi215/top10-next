// prisma/seed-static-pages.ts
// Seed script to populate StaticPage collection with default pages

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const staticPages = [
  {
    slug: 'about-us',
    title: 'About Us',
    description: 'Learn more about 10rating and our mission to help consumers make informed decisions.',
    content: `<h2>Who We Are</h2>
<p>10rating is a free online resource that strives to offer helpful content and comparison features to our visitors. We help millions of consumers make better decisions by providing expert reviews, detailed comparisons, and comprehensive guides.</p>

<h2>Our Mission</h2>
<p>Our mission is to simplify the decision-making process for consumers worldwide. We believe that everyone deserves access to reliable, unbiased information when choosing products and services.</p>

<h2>How We Work</h2>
<p>Our team of experts thoroughly researches and tests products and services across many categories. We evaluate each option based on features, pricing, ease of use, customer support, and overall value.</p>

<h2>Our Values</h2>
<ul>
  <li><strong>Transparency</strong> - We clearly disclose our review methodology and any partnerships.</li>
  <li><strong>Accuracy</strong> - We fact-check all our content and regularly update our reviews.</li>
  <li><strong>User-First</strong> - Every recommendation is made with the consumer's best interest in mind.</li>
</ul>`,
    metaTitle: 'About Us | 10rating',
    metaDescription: '10rating is a free online resource that helps consumers make informed decisions with expert reviews and comparisons.',
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    description: 'This policy explains how we collect, use, and protect your personal data.',
    content: `<h2>Privacy Policy - Summary</h2>
<p>At 10rating, we are committed to protecting user privacy. This policy explains what information we collect, how we use it, who we share it with, and what options you have.</p>

<h2>Information We Collect</h2>
<p>During your visit to our websites, we may collect information about your visit, your interaction with content, and some technical information about your device and system.</p>

<h2>How We Use Your Information</h2>
<p>We use the information collected on our websites to provide the services you request, improve our services, and measure analytics and statistics.</p>

<h2>Data Sharing</h2>
<p>We will not share your information unless required by law, or as needed to provide our services, or with your consent.</p>

<h2>Cookies</h2>
<p>We use cookies and similar technologies to enhance your experience. You can manage your cookie preferences through your browser settings.</p>

<h2>Contact Us</h2>
<p>If you have questions about this Privacy Policy, please contact us through our website.</p>`,
    metaTitle: 'Privacy Policy | 10rating',
    metaDescription: 'This policy explains how 10rating collects, uses, and protects your personal data.',
  },
  {
    slug: 'terms-of-use',
    title: 'Terms of Use',
    description: 'Please read these terms carefully before using our website.',
    content: `<h2>Terms of Use</h2>
<p>Welcome to 10rating. By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement.</p>

<h2>Use of the Site</h2>
<p>You may use our website for lawful purposes only. You agree not to use the site in any way that could damage, disable, or impair the site.</p>

<h2>Intellectual Property</h2>
<p>All content on this website, including text, graphics, logos, and images, is the property of 10rating and is protected by copyright laws.</p>

<h2>Disclaimer</h2>
<p>The information provided on this website is for general informational purposes only. We make no warranties about the completeness, reliability, or accuracy of this information.</p>

<h2>Limitation of Liability</h2>
<p>10rating shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website.</p>

<h2>Changes to Terms</h2>
<p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website.</p>`,
    metaTitle: 'Terms of Use | 10rating',
    metaDescription: 'Read the terms and conditions for using the 10rating website.',
  },
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    description: 'Learn about how we use cookies and similar technologies.',
    content: `<h2>What Are Cookies</h2>
<p>Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to site owners.</p>

<h2>How We Use Cookies</h2>
<p>We use cookies to understand how you interact with our website, remember your preferences, and improve your experience.</p>

<h2>Types of Cookies We Use</h2>
<ul>
  <li><strong>Essential Cookies</strong> - Required for the website to function properly.</li>
  <li><strong>Analytics Cookies</strong> - Help us understand how visitors interact with our website.</li>
  <li><strong>Marketing Cookies</strong> - Used to deliver relevant advertisements.</li>
</ul>

<h2>Managing Cookies</h2>
<p>You can control and manage cookies through your browser settings. Please note that removing or blocking cookies may impact your user experience.</p>

<h2>Updates to This Policy</h2>
<p>We may update this Cookie Policy from time to time. Any changes will be posted on this page.</p>`,
    metaTitle: 'Cookie Policy | 10rating',
    metaDescription: 'Learn about how 10rating uses cookies and similar technologies on our website.',
  },
];

async function main() {
  console.log('Starting static pages seed...');

  for (const pageData of staticPages) {
    const page = await prisma.staticPage.upsert({
      where: { slug: pageData.slug },
      update: {
        title: pageData.title,
        description: pageData.description,
        content: pageData.content,
        metaTitle: pageData.metaTitle,
        metaDescription: pageData.metaDescription,
      },
      create: pageData,
    });

    console.log(`  Upserted: ${page.title} (/${page.slug})`);
  }

  console.log('Static pages seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
