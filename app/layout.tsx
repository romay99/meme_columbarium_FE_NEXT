// app/layout.jsx
import './globals.css';
import { ThemeProvider } from './dark-mode/ThemeContext';

export const metadata = {
  title: 'RipMeme',
  description: '유행지난 밈 저장소',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
