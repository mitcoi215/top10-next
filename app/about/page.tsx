import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-xl text-gray-600">
            Your trusted source for comparing the top 10 best services and products
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            {/* Mission */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                At 10rating.com, our mission is to save you time and money by empowering you to make informed decisions.
                As a comparison site, we provide all the tools you need to compare options effectively. We are dedicated
                to thorough research, transparency, and user-focused design, ensuring complex choices are straightforward.
                We strive to provide you with all the information you need at your fingertips, helping you make decisions
                with confidence.
              </p>
            </div>

            {/* What We Do */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We carefully research and compare products and services across various categories to help you find the
                best options available. Our team evaluates each product based on key criteria including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Quality and Performance</li>
                <li>Price and Value for Money</li>
                <li>Customer Reviews and Ratings</li>
                <li>Features and Benefits</li>
                <li>Customer Support and Service</li>
              </ul>
            </div>

            {/* Our Methodology */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Methodology</h2>
              <p className="text-gray-700 leading-relaxed">
                Our methodology is rigorous and transparent. We combine in-depth research with meticulous testing to
                ensure our product scores and rankings are both reliable and relevant. Each category is evaluated based
                on criteria tailored to the specific needs and interests of consumers. Our team reviews products and
                services, consults user feedback, and examines industry data to provide clear, unbiased ratings.
              </p>
            </div>

            {/* Contact */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Have questions or suggestions? We'd love to hear from you!
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
