'use client';

import { useState } from 'react';
import HomeClient from '@/components/HomeClient';
import { CATEGORY_CONTENTS } from '@/lib/constants';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('lifestyle');

  return (
    <>
      {/* Header Top10 */}
      <section className="w-full bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Compare and shop the <span className="text-red-600">Top10</span> best services & products for you
          </h1>
        </div>
      </section>

      {/* Home Client: Category Pills + Category Content + Top10List */}
      <HomeClient initialCategory={activeCategory} />

      {/* Banner nhỏ */}
      <section className="w-full bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">We make it easy to find what you need</h2>
        </div>
      </section>

      {/* Our Experts / Our Mission / Our Method */}
      <section className="w-full bg-white py-12">
        <div className="container mx-auto px-4 space-y-12 text-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Our Experts</h3>
            <p className="text-gray-600 mt-2">
              At Top10.com, our mission is to save you time and money by empowering you to make informed decisions. As a comparison site, we provide all the tools you need to compare options effectively. We are dedicated to thorough research, transparency, and user-focused design, ensuring complex choices are straightforward. We strive to provide you with all the information you need at your fingertips, helping you make decisions with confidence.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            <p className="text-gray-600 mt-2">
              At Top10.com, our methodology is rigorous and transparent. We combine in-depth research with meticulous testing to ensure our product scores and rankings are both reliable and relevant. Each category is evaluated based on criteria tailored to the specific needs and interests of consumers.
              Our team of handpicked experts reviews products and services, consults user feedback, and examines industry data to provide clear, unbiased ratings. This thorough approach ensures that when you choose from our top 10 lists, you are making a well-informed decision backed by comprehensive analysis.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Our Method</h3>
            <p className="text-gray-600 mt-2">
              At Top10.com, our team is a dynamic blend of industry experts, passionate writers, and technical specialists. United by a common goal to empower consumers, we handpick our experts based on their extensive experience with the services we review. Each member brings a unique perspective and expertise, ensuring that the insights we offer are well-rounded and thoroughly researched.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
