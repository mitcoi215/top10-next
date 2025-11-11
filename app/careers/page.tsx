import Link from 'next/link';

const jobOpenings = [
  {
    id: 1,
    title: 'Senior Content Writer',
    department: 'Content',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for an experienced content writer to create engaging, accurate, and SEO-optimized reviews and comparisons.',
    requirements: [
      '5+ years of experience in content writing',
      'Strong research and analytical skills',
      'Experience with SEO best practices',
      'Excellent written and verbal communication',
    ],
  },
  {
    id: 2,
    title: 'Product Researcher',
    department: 'Research',
    location: 'New York, NY / Remote',
    type: 'Full-time',
    description: 'Join our research team to evaluate products and services across various categories and provide data-driven insights.',
    requirements: [
      '3+ years of experience in product research or analysis',
      'Strong analytical and critical thinking skills',
      'Attention to detail and accuracy',
      'Experience with data analysis tools',
    ],
  },
  {
    id: 3,
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Help us build and maintain a modern, performant web application using React, Next.js, and TypeScript.',
    requirements: [
      '4+ years of experience with React and Next.js',
      'Strong TypeScript skills',
      'Experience with responsive design and accessibility',
      'Passion for clean code and best practices',
    ],
  },
  {
    id: 4,
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Lead our marketing efforts to grow our audience and establish Top10.com as the go-to comparison platform.',
    requirements: [
      '5+ years of experience in digital marketing',
      'Experience with SEO, content marketing, and social media',
      'Strong analytical skills and data-driven mindset',
      'Excellent leadership and communication skills',
    ],
  },
];

const benefits = [
  {
    icon: '💰',
    title: 'Competitive Salary',
    description: 'We offer competitive compensation packages with regular reviews.',
  },
  {
    icon: '🏥',
    title: 'Health Insurance',
    description: 'Comprehensive health, dental, and vision insurance for you and your family.',
  },
  {
    icon: '🏖️',
    title: 'Flexible PTO',
    description: 'Unlimited paid time off to recharge and maintain work-life balance.',
  },
  {
    icon: '🏠',
    title: 'Remote Work',
    description: 'Work from anywhere with flexible hours and remote-first culture.',
  },
  {
    icon: '📚',
    title: 'Learning Budget',
    description: 'Annual budget for courses, conferences, and professional development.',
  },
  {
    icon: '💻',
    title: 'Equipment',
    description: 'Top-of-the-line laptop and equipment to help you do your best work.',
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 py-20 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-red-100 max-w-2xl">
            Help us empower millions of users to make informed decisions. We're always looking for talented,
            passionate people to join our growing team.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Work at Top10.com?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're building the most trusted comparison platform in the world. Join us in our mission to help
              people make better decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Growth</h3>
              <p className="text-gray-600">
                Join a rapidly growing company with opportunities for career advancement and skill development.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Great Team</h3>
              <p className="text-gray-600">
                Work with talented, passionate people who care about quality and making an impact.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                Use cutting-edge technologies and methodologies to solve real-world problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
            <p className="text-lg text-gray-600">
              We believe in taking care of our team members so they can do their best work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-lg text-gray-600">
              Explore our current job openings and find your next opportunity.
            </p>
          </div>

          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                        {job.department}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {job.location}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 md:mt-0 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition whitespace-nowrap">
                    Apply Now
                  </button>
                </div>

                <p className="text-gray-700 mb-4">{job.description}</p>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {job.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Don't See a Perfect Fit?</h2>
          <p className="text-lg text-gray-600 mb-8">
            We're always interested in hearing from talented people. Send us your resume and tell us what you're
            passionate about.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Get in Touch
            </Link>
            <Link
              href="/"
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
