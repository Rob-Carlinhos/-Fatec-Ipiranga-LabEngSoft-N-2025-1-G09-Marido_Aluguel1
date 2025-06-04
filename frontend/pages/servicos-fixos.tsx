'use client';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { getToken } from '../utils/auth';

interface ServicoFixo {
  id: number;
  tipo: string;
  descricao: string;
}

export default function ServicosFixosPage() {
  const [servicos, setServicos] = useState<ServicoFixo[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicos-disponiveis`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setServicos)
      .catch(err => console.error('Erro ao carregar serviços fixos:', err));
  }, []);

  return (
    <Layout>
      <main className="min-h-screen pt-28 pb-16 bg-orange-50 px-4">
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
          Serviços Fixos Disponíveis
        </h1>

        {servicos.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum serviço fixo disponível no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {servicos.map(servico => (
              <div
                key={servico.id}
                className="bg-white rounded-xl shadow-md p-6 border border-orange-200"
              >
                <h2 className="text-xl font-bold text-orange-500">{servico.tipo}</h2>
                <p className="text-gray-700 mt-2 text-sm">{servico.descricao}</p>
                <button
                  onClick={() => router.push(`/agendamento?servicoFixoId=${servico.id}`)}
                  className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition"
                >
                  Agendar
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}
