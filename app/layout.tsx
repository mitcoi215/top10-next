// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Top 10 Lists of the Best Products and Services | 10rating',
    template: '%s | 10rating',
  },
  description:
    '10rating is a comparison platform that brings you useful top 10 lists covering a wide variety of products and services that can help you save time and money',
  metadataBase: new URL('https://10rating.com'),
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
