import './globals.css';
import { ThemeProvider } from './dark-mode/ThemeContext';
import { ReactNode } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

export const metadata = {
  title: '밈 납골당',
  description: '유행지난 밈 저장소',
  icons: '/favicon.ico',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <GoogleAnalytics gaId="G-SHMKSCFDDJ" />

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4844671075935249"
          crossOrigin="anonymous"
        />

        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
