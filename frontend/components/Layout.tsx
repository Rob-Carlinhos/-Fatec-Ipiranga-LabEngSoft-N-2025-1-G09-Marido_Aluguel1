'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingLogoutButton from '../components/FloatingLogoutButton';

interface LayoutProps {
  readonly children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <div className="pt-24 pb-40 min-h-screen bg-orange-100">
        <main className="max-w-7xl mx-auto px-4">
          {children}
          <FloatingLogoutButton />
        </main>
      </div>
      <Footer />
    </>
  );
}
