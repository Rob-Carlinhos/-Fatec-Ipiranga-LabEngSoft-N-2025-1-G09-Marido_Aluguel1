'use client';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getToken } from '../utils/auth';

interface Agendamento {
  id: number;
  servico: string;
  dataAgendada: string;
  horaAgendada: string;
  status: string;
  clienteId: number;
}

export default function AgendamentosRecebidos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/agendamentos/prestador`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar agendamentos');
        return res.json();
      })
      .then((data) => setAgendamentos(data))
      .catch((err) => {
        console.error('Erro ao buscar agendamentos:', err);
        alert('Erro ao buscar seus agendamentos.');
      })
      .finally(() => setLoading(false));
  }, []);

  let conteudo;

  if (loading) {
    conteudo = <p className="text-center text-gray-600">Carregando agendamentos...</p>;
  } else if (agendamentos.length === 0) {
    conteudo = <p className="text-center text-gray-600">Você ainda não aceitou nenhum serviço.</p>;
  } else {
    conteudo = (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {agendamentos.map((ag) => (
          <div
            key={ag.id}
            className="p-4 rounded-xl bg-white shadow-md border-l-4 border-orange-500"
          >
            <h2 className="text-xl font-semibold text-orange-600 capitalize mb-2">
              {ag.servico}
            </h2>
            <p className="text-sm text-gray-700">
              <strong>Data:</strong> {ag.dataAgendada}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Hora:</strong> {ag.horaAgendada}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Status:</strong> {ag.status}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Layout>
      <main className="min-h-screen bg-orange-100 pt-28 pb-20 px-6">
        <h1 className="text-3xl font-bold text-orange-600 text-center mb-8">
          Serviços Aceitos
        </h1>
        {conteudo}
      </main>
    </Layout>
  );
}
