import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ABSOJADATA | Your Connectivity Partner',
  description: 'Modern Nigerian VTU and airtime vending platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
