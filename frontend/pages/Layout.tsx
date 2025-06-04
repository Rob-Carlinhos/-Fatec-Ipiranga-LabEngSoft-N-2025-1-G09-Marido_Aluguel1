'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className="pt-20 pb-16 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
