// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Top 10 Lists of the Best Products and Services | Top10.com',
  description:
    'Top10.com is a comparison platform that brings you useful top 10 lists covering a wide variety of products and services that can help you save time and money',
  openGraph: {
    title: 'Top 10 Lists of the Best Products and Services | Top10.com',
    description:
      'Top10.com is a comparison platform that brings you useful top 10 lists covering a wide variety of products and services that can help you save time and money',
    url: 'https://www.top10.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top 10 Lists of the Best Products and Services | Top10.com',
    description:
      'Top10.com is a comparison platform that brings you useful top 10 lists covering a wide variety of products and services that can help you save time and money',
  },
  metadataBase: new URL('https://www.top10.com'),
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
