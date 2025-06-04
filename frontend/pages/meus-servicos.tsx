'use client';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getToken } from '../utils/auth';
import { useRouter } from 'next/router';

interface Servico {
  id: number;
  nome: string;
  telefone: string;
  tipo: string;
  observacao: string;
  local: string;
  valor: string;
  urgente: boolean;
  userId: number;
}

export default function MeusServicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [tipoUsuario, setTipoUsuario] = useState<'cliente' | 'prestador' | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const carregarServicos = async () => {
      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = await userRes.json();

        setTipoUsuario(user.tipoUsuario);

        const servicosRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const todosServicos = await servicosRes.json();

        const meusServicos = todosServicos.filter((s: Servico) => s.userId === user.id);
        setServicos(meusServicos);
      } catch (err) {
        console.error('Erro ao carregar serviços:', err);
      }
    };

    carregarServicos();
  }, []);

  return (
    <Layout>
      <main className="min-h-screen bg-orange-100 pt-28 pb-20 px-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-orange-600">Meus Serviços Cadastrados</h1>

        {servicos.length === 0 ? (
          <p className="text-center text-gray-600">Você ainda não cadastrou nenhum serviço.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {servicos.map((servico) => {
              const estiloCard = servico.urgente
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-white';

              return (
                <div
                  key={servico.id}
                  className={`p-4 rounded-xl shadow-md border-2 ${estiloCard}`}
                >
                  <h2 className="text-xl font-semibold text-orange-600 capitalize">{servico.tipo}</h2>
                  <p className="text-sm text-gray-700 mt-2">{servico.observacao}</p>
                  <p className="text-xs text-gray-500 mt-2">{servico.local}</p>
                  <p className="text-xs text-gray-600 font-semibold mt-1">
                    R$ {parseFloat(servico.valor).toFixed(2)}
                  </p>
                  {servico.urgente && (
                    <span className="inline-block text-xs text-white bg-red-500 px-2 py-1 rounded mt-2">
                      Urgente
                    </span>
                  )}

                  {tipoUsuario === 'cliente' && (
                    <button
                      onClick={() => router.push(`/agendamento?servicoId=${servico.id}`)}
                      className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition"
                    >
                      Agendar
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </Layout>
  );
}
