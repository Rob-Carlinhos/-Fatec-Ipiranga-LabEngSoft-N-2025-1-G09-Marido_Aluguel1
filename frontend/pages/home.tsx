import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { Briefcase } from 'lucide-react';
import FloatingLogoutButton from '../components/FloatingLogoutButton';

export default function HomePage() {
  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-orange-100 pt-20 pb-20">
        <div className="flex justify-center w-full px-6">
          <button
            type="button"
            onClick={() => router.push('/contratar-prestador')}
            className="bg-white shadow-lg rounded-2xl p-10 hover:shadow-xl transition hover:scale-105 flex flex-col items-center text-center focus:outline-none focus:ring-4 focus:ring-orange-300 w-full max-w-md"
          >
            <Briefcase className="w-16 h-16 text-orange-500 mb-6 animate-pulse" />
            <h2 className="text-2xl font-bold text-orange-600">Contratar Prestador</h2>
            <p className="text-base text-gray-600 mt-4">Visualize serviços disponíveis e contrate facilmente.</p>
          </button>
        </div>
      </div>

      {/* Botão flutuante de logout */}
      <FloatingLogoutButton />
    </Layout>
  );
}
