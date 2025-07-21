import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { ToastNotifications } from '@/components/ui/ToastNotifications';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Personalized Content Dashboard',
  description: 'A dynamic dashboard for personalized content consumption',
  keywords: ['dashboard', 'content', 'personalized', 'news', 'movies', 'social'],
  authors: [{ name: 'SDE Intern' }],
  // viewport removed from here
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <ToastNotifications />
        </Providers>
      </body>
    </html>
  );
} 