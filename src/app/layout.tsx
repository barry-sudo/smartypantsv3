import type { Metadata } from 'next';
import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: 'Smarty Pants v3',
  description: '2nd grade learning games',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-comic">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
