import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import CadastrarServicoPopup from '../components/CadastrarServicoPopup';

export default function ContratarPrestadorPage() {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-screen bg-orange-50 pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md text-center space-y-6">
          <h2 className="text-2xl font-bold text-orange-500">Criar Serviço Personalizado</h2>
          <p className="text-sm text-gray-600">
            Caso não tenha encontrado o serviço desejado na lista de serviços fixos da plataforma,
            você pode descrever aqui sua necessidade e um prestador poderá aceitar sua solicitação.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={() => setShowPopup(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded transition"
            >
              Criar novo serviço
            </button>

            <button
              onClick={() => router.push('/meus-servicos')}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded transition"
            >
              Ver meus serviços personalizados
            </button>
          </div>
        </div>
      </div>

      <CadastrarServicoPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </Layout>
  );
}
