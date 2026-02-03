'use client';

import '@/styles/top10.css';
import '@/styles/contact.css';
import { useState } from 'react';
import SetoffBox from '@/components/top10/category/SetoffBox';
import Top10Header from '@/components/top10/layout/Top10Header';
import Top10Footer from '@/components/top10/layout/Top10Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
    privacyConsent: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="top10-page general">
      <SetoffBox />
      <Top10Header />

      {/* Header */}
      <div className="contact__header">
        <div className="header-title-container">
          <h1>Get in Touch</h1>
        </div>
      </div>

      {/* Body */}
      <div className="contact__body">
        <p className="intro-paragraph">
          Have questions or feedback? We&apos;d love to hear from you.
          Send us a message and our team will respond as soon as possible.
        </p>

        {/* Form Section */}
        <div className="contact-form-section">
          <div className="contact-container">
            <div className="wrapper-container">
              {!submitted ? (
                <div className="container">
                  <div className="content">
                    <div className="contact-form">
                      <div className="title">
                        <span>Contact </span>
                        <span className="title--highlighted">Us</span>
                      </div>
                      <form className="contact-form__form" onSubmit={handleSubmit}>
                        <div className="contact-form__row">
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
                        <div className="contact-form__row">
                          <input
                            type="email"
                            placeholder="Email *"
                            required
                            maxLength={80}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div className="contact-form__row">
                          <input
                            type="text"
                            placeholder="Subject *"
                            required
                            maxLength={100}
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          />
                        </div>
                        <div className="contact-form__row message">
                          <textarea
                            placeholder="Your Message *"
                            required
                            minLength={10}
                            maxLength={2000}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          />
                        </div>
                        <div className="contact-form__row checkbox">
                          <input
                            type="checkbox"
                            id="privacy-consent"
                            required
                            checked={formData.privacyConsent}
                            onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                          />
                          <label htmlFor="privacy-consent">
                            <a className="contact-privacy-url" href="/privacy-policy">
                              Privacy Policy
                            </a>
                            <span className="contact-privacy-consent"> consent</span>
                          </label>
                        </div>
                        <div className="contact-form__button-row">
                          <input type="submit" className="contact-form__button" value="Send Message" />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="contact-form__submit-message">
                  <div className="contact-form__submit-message__content">
                    <div className="contact-form__submit-message__content__message">
                      <div className="contact-form__submit-message__content__message__main">
                        <div className="contact-form__submit-message__content__message__main--highlighted">
                          Thank you
                        </div>
                        <div>for reaching out</div>
                      </div>
                      <div className="contact-form__submit-message__content__message__secondary">
                        We will get back to you soon
                      </div>
                    </div>
                  </div>
                  <button
                    className="contact-form__submit-message__close-button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ fullName: '', email: '', subject: '', message: '', privacyConsent: false });
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="contact-info-section">
          <div className="contact-info-card">
            <div className="contact-info-card__icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="contact-info-card__title">Email</div>
            <div className="contact-info-card__text">
              <a href="mailto:info@10rating.com">info@10rating.com</a>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-card__icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="contact-info-card__title">Address</div>
            <div className="contact-info-card__text">
              123 Business Street<br />
              New York, NY 10001<br />
              United States
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-card__icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="contact-info-card__title">Business Hours</div>
            <div className="contact-info-card__text">
              Monday - Friday: 9AM - 6PM<br />
              Saturday - Sunday: Closed
            </div>
          </div>
        </div>
      </div>

      <Top10Footer />
    </div>
  );
}
