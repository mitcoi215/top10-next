'use client';

import '@/styles/top10.css';
import '@/styles/partner-with-us.css';
import { useState } from 'react';
import SetoffBox from '@/components/top10/category/SetoffBox';
import Top10Header from '@/components/top10/layout/Top10Header';
import Top10Footer from '@/components/top10/layout/Top10Footer';

const partnerLogos = [
  { name: 'lendingtree', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_lendingtree.png' },
  { name: 'mcafee', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_mcafee.png' },
  { name: 'match', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_match.png' },
  { name: 'wix', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_wix.png' },
  { name: 'godaddy', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_godaddy.png' },
  { name: 'quickenloans', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_quickenloans.png' },
  { name: 'adp', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_adp.png' },
  { name: 'chw', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_chw.png' },
  { name: 'gusto', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_gusto.png' },
  { name: 'leaders merchant services', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_leaders_merchant_services.png' },
  { name: 'select home warranty', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_select_home_warranty.png' },
  { name: 'medical guardian', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_medical_guardian.png' },
  { name: 'mobilehelp', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_mobilehelp.png' },
  { name: 'monday', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_monday.png' },
  { name: 'norton by symantec', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_norton_by_symantec.png' },
  { name: 'pa', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_pa.png' },
  { name: 'shopkeep', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_shopkeep.png' },
  { name: 'shopify', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_shopify.png' },
  { name: 'spark', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_spark.png' },
  { name: 'vivint', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_vivint.png' },
  { name: 'vonage', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_vonage.png' },
  { name: 'ringcentral', src: 'https://images.top10.com/f_auto,q_auto/v1/production/ninja/images/partner-logos-new/partner_logo_ringcentral.png' },
];

const dropdownItems = [
  {
    title: 'Who we are',
    content: [
      "We're a global leader in intent marketing, operating comparison websites that attract high-intent users.",
      'We deliver high-quality traffic on a massive scale to hundreds of leading brands worldwide.',
    ],
  },
  {
    title: 'What we do',
    content: [
      'Our websites boost brand exposure by making sure your products & services are always there when users compare.',
      'We are performance-driven, delivering a strong ROI for hundreds of leading global brands across a wide range of industries.',
    ],
  },
  {
    title: 'How we do it',
    content: [
      "As experts in paid search, we dominate search advertising positions and are listed as one of Google's top 50 advertisers worldwide.",
      'We bid for high-intent, non-branded keywords, capturing high-value users on a massive scale, giving them the confidence to make a purchase.',
    ],
  },
  {
    title: 'What you get',
    content: [
      "With 10Rating, you'll reach the right users at the right time.",
      "Our expertly researched lists drive new visitors to your website. You'll also enjoy quality traffic and a steady ROI at scale.",
    ],
  },
];

export default function PartnerWithUsPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    privacyConsent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  const scrollToForm = () => {
    document.querySelector('.partner-with-us-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="top10-page">
      <SetoffBox />
      <Top10Header />

      {/* Header */}
      <div className="partner-with-us__header">
        <div className="header-title-container">
          <h1>Connect with millions of high-intent consumers</h1>
        </div>
      </div>

      {/* Body */}
      <div className="partner-with-us__body">
        <p className="intro-paragraph">
          10Rating is an online comparison marketplace where people come to explore their options
          before making life&apos;s decisions. With our cutting-edge technology, we connect leading brands
          with tens of millions of high intent consumers every year.
        </p>

        {/* Form Section */}
        <div className="partner-with-us-form-section">
          <div className="partner-with-us-container">
            <div className="wrapper-container">
              {!submitted ? (
                <div className="container">
                  <div className="content">
                    <div className="partner-with-us-form">
                      <div className="title">
                        <span>Become a </span>
                        <span className="title--highlighted">partner</span>
                      </div>
                      <form className="partner-with-us-form__form" onSubmit={handleSubmit}>
                        <div className="partner-with-us-form__row">
                          <input
                            type="text"
                            placeholder="Full Name *"
                            required
                            minLength={3}
                            maxLength={80}
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          />
                        </div>
                        <div className="partner-with-us-form__row">
                          <input
                            type="email"
                            placeholder="Email *"
                            required
                            maxLength={80}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div className="partner-with-us-form__row company">
                          <input
                            type="text"
                            placeholder="Company Name *"
                            required
                            maxLength={40}
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          />
                        </div>
                        <div className="partner-with-us-form__row checkbox">
                          <input
                            type="checkbox"
                            id="privacy-consent"
                            required
                            checked={formData.privacyConsent}
                            onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                          />
                          <label htmlFor="privacy-consent">
                            <a className="partner-with-us-privacy-url" href="/privacy-policy">
                              Privacy Policy
                            </a>
                            <span className="partner-with-us-privacy-consent"> consent</span>
                          </label>
                        </div>
                        <div className="partner-with-us-form__button-row">
                          <input type="submit" className="partner-with-us-form__button" value="Submit" />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="partner-with-us-form__submit-message">
                  <div className="partner-with-us-form__submit-message__content">
                    <div className="partner-with-us-form__submit-message__content__message">
                      <div className="partner-with-us-form__submit-message__content__message__main">
                        <div className="partner-with-us-form__submit-message__content__message__main--highlighted">
                          Thank you
                        </div>
                        <div>for reaching out</div>
                      </div>
                      <div className="partner-with-us-form__submit-message__content__message__secondary">
                        We will contact you soon
                      </div>
                    </div>
                  </div>
                  <button
                    className="partner-with-us-form__submit-message__close-button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ fullName: '', email: '', company: '', privacyConsent: false });
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Logos */}
        <div className="logos-title">top-tier brands</div>
        <div className="customers-logos">
          <div className="customers-logos__container">
            {partnerLogos.map((logo, index) => (
              <div key={index} className="customers-logos__logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="customers-logos__image"
                  src={logo.src}
                  alt={`${logo.name} logo`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dropdown/Accordion Section */}
        <div className="dropdown__container">
          <ul className="dropdown">
            {dropdownItems.map((item, index) => (
              <li
                key={index}
                className={`dropdown__item ${openDropdown === index ? 'dropdown__item--open' : ''}`}
                onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
              >
                <h3 className="dropdown__item__title">{item.title}</h3>
                <div className="dropdown__item__accordion">
                  <div
                    className={`dropdown__item__text ${openDropdown !== index ? 'dropdown__item__text--hidden' : ''}`}
                  >
                    {item.content.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <button className="dropdown__item__button" onClick={scrollToForm}>
                    Let&apos;s talk
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Top10Footer />
    </div>
  );
}
