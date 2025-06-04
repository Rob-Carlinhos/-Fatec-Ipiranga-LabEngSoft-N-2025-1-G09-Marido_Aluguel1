'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { getToken } from '../utils/auth';

interface Servico {
  id: number;
  tipo: string;
  observacao: string;
  valor: number;
  local: string;
  urgente: boolean;
  nome: string;
  telefone: string;
  userId: number;
}

export default function ServicosPrestador() {
  const router = useRouter();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [meuId, setMeuId] = useState<number | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(user => {
        setMeuId(user.id);

        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then(res => res.json())
      .then(data => {
        const disponiveis = data.filter((s: Servico) => s.userId !== meuId);
        setServicos(disponiveis);
      })
      .catch(err => console.error('Erro ao buscar serviços:', err));
  }, [meuId]);

  const handleAceitarServico = async (servicoId: number) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicos/${servicoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const servico = await res.json();

      router.push(`/agendamento?servicoId=${servico.id}`);
    } catch (error) {
      console.error('Erro ao aceitar serviço:', error);
      alert('Erro ao aceitar o serviço.');
    }
  };

  return (
    <Layout>
      <main className="min-h-screen bg-orange-100 pt-28 pb-20 px-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-orange-600">Serviços Disponíveis</h1>

        {servicos.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum serviço disponível para aceitar.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {servicos.map(servico => (
              <div
                key={servico.id}
                className={`p-4 rounded-xl shadow-md border-2 ${servico.urgente ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}`}
              >
                <h2 className="text-xl font-semibold text-orange-600">{servico.tipo}</h2>
                <p className="text-sm text-gray-700 mt-2">{servico.observacao}</p>
                <p className="text-sm text-gray-600">{servico.local}</p>
                <p className="text-sm text-gray-800 font-semibold mt-1">R$ {parseFloat(servico.valor.toString()).toFixed(2)}</p>

                <button
                  onClick={() => handleAceitarServico(servico.id)}
                  className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
                >
                  Aceitar Serviço
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}
