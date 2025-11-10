// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Top10 Best Services & Products Comparison',
  description:
    'Compare and shop the Top10 best services & products for you. Hosting, VPN, Health & Wellness, and more categories with expert reviews.',
  openGraph: {
    title: 'Top10 Best Services & Products Comparison',
    description:
      'Compare and shop the Top10 best services & products for you. Hosting, VPN, Health & Wellness, and more categories with expert reviews.',
    url: 'https://www.top10.com',
    type: 'website',
    images: ['/top10/1.jpg'], // ảnh Open Graph ví dụ
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top10 Best Services & Products Comparison',
    description:
      'Compare and shop the Top10 best services & products for you. Hosting, VPN, Health & Wellness, and more categories with expert reviews.',
    images: ['/top10/1.jpg'],
  },
  metadataBase: new URL('https://www.top10.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
