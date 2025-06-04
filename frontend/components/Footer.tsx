'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-gray-100 border-t shadow-inner z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center items-center space-x-8">
        <Link href="/sobre" className="flex items-center space-x-1 hover:text-orange-600 transition">
          <span>Sobre</span>
        </Link>
        <Link href="/servicos" className="flex items-center space-x-1 hover:text-orange-600 transition">
          <span>Serviços</span>
        </Link>
        <Link href="/fale-conosco" className="flex items-center space-x-1 hover:text-orange-600 transition">
          <span>Fale Conosco</span>
        </Link>
      </div>
    </footer>
  );
}
