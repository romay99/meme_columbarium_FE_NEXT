// app/layout.jsx
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "./dark-mode/ThemeContext";

export const metadata = {
  title: "RipMeme",
  description: "유행지난 밈 저장소",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* Google AdSense 스크립트 */}
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4844671075935249" crossOrigin="anonymous" strategy="afterInteractive" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
