import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export const metadata: Metadata = {
  title: 'World Cup 2026 Predictor',
  description: 'Predict the scores and compete in the World Cup 2026 prediction competition',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold">
                🏆 World Cup 2026 Predictor
              </Link>
              <div className="flex gap-4">
                <Link href="/" className="hover:underline">Home</Link>
                <Link href="/predictions" className="hover:underline">My Predictions</Link>
                <Link href="/predictions/view" className="hover:underline">View All</Link>
                <Link href="/standings" className="hover:underline">Standings</Link>
                <Link href="/register" className="hover:underline">Register</Link>
                <Link href="/login" className="hover:underline">Login</Link>
                <LogoutButton />
              </div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white mt-12 py-6">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2026 World Cup Predictor. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
