import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ArihantCars | Best Premium Used Cars in Nagpur',
  description: 'Buy & Sell premium quality used cars at ArihantCars Nagpur. Certified luxury and budget cars with transparent history and best prices.',
  keywords: ['used cars nagpur', 'second hand cars nagpur', 'certified cars nagpur', 'luxury cars nagpur', 'arihant cars'],
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'ArihantCars | Best Premium Used Cars in Nagpur',
    description: 'Buy & Sell premium quality used cars at ArihantCars Nagpur.',
    url: 'https://arihantcars.com',
    siteName: 'ArihantCars',
    images: [
      {
        url: 'https://arihantcars.com/og-image.jpg', // Placeholder image
        width: 1200,
        height: 630,
        alt: 'ArihantCars Nagpur',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArihantCars | Best Premium Used Cars in Nagpur',
    description: 'Buy & Sell premium quality used cars at ArihantCars Nagpur.',
    images: ['https://arihantcars.com/og-image.jpg'],
  },
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow bg-gray-50 text-gray-900">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

