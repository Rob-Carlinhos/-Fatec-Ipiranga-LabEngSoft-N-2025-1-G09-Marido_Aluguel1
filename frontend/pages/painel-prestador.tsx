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

export default function PainelPrestador() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/agendamentos/prestador`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar agendamentos');
        return res.json();
      })
      .then(data => setAgendamentos(data))
      .catch(err => console.error('Erro ao buscar agendamentos:', err))
      .finally(() => setLoading(false));
  }, []);

  let conteudoAgendamentos;

  if (loading) {
    conteudoAgendamentos = <p className="text-gray-500">Carregando agendamentos...</p>;
  } else if (agendamentos.length === 0) {
    conteudoAgendamentos = <p className="text-gray-500">Nenhum agendamento encontrado.</p>;
  } else {
    conteudoAgendamentos = (
      <ul className="space-y-3">
        {agendamentos.map((agendamento) => (
          <li
            key={agendamento.id}
            className="border-l-4 border-orange-500 bg-orange-100 p-4 rounded-md shadow"
          >
            <p><strong>Serviço:</strong> {agendamento.servico}</p>
            <p><strong>Data:</strong> {agendamento.dataAgendada}</p>
            <p><strong>Hora:</strong> {agendamento.horaAgendada}</p>
            <p><strong>Status:</strong> {agendamento.status}</p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-orange-50 pt-28 pb-12 px-4">
        <h1 className="text-3xl font-bold text-orange-600 text-center mb-8">
          Bem-vindo, Prestador de Serviços
        </h1>

        <section className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Agendamentos Futuros</h2>
          {conteudoAgendamentos}
        </section>

        <div className="mt-10 text-center">
          <a
            href="/servicos-disponiveis"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full shadow-md transition"
          >
            Ver Serviços Disponíveis
          </a>
        </div>
      </div>
    </Layout>
  );
}
