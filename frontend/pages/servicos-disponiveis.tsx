'use client';
import { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import Layout from '../components/Layout';

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

interface User {
  id: number;
  tipoUsuario: 'cliente' | 'prestador';
}

export default function ServicosDisponiveis() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    // Busca o usuário
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser(data));

    // Busca os serviços disponíveis
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar serviços');
        return res.json();
      })
      .then(data => setServicos(data))
      .catch(err => console.error('Erro ao carregar serviços:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleAceitar = async (servico: Servico) => {
    const token = getToken();
    if (!token || !user) return;

    const confirm = window.confirm(`Aceitar o serviço de ${servico.tipo}?`);
    if (!confirm) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/agendamentos`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          clienteId: servico.userId,
          prestadorId: user.id,
          servico: servico.tipo,
          dataAgendada: new Date().toISOString().split('T')[0], // exemplo
          horaAgendada: '09:00' // exemplo
        })
      }
    );

    if (response.ok) {
      alert('Serviço aceito com sucesso!');
      setServicos(prev => prev.filter(s => s.id !== servico.id));
    } else {
      const err = await response.json();
      alert('Erro ao aceitar serviço: ' + err.error);
    }
  };

  return (
    <Layout>
      <main className="min-h-screen bg-orange-100 pt-28 pb-20 px-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-orange-600">Serviços Disponíveis</h1>

        {loading ? (
          <p className="text-center text-gray-500">Carregando serviços...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {servicos.map(servico => (
              <div key={servico.id} className={`p-4 rounded-xl shadow-md border-2 
                ${servico.urgente ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}`}>
                <h2 className="text-xl font-semibold text-orange-600 capitalize">{servico.tipo}</h2>
                <p className="text-sm text-gray-700 mt-2">{servico.observacao}</p>
                <p className="text-xs text-gray-500 mt-1">{servico.local}</p>
                <p className="text-xs text-gray-600 font-semibold mt-1">
                  R$ {parseFloat(servico.valor).toFixed(2)}
                </p>

                {user?.tipoUsuario === 'prestador' && (
                  <button
                    onClick={() => handleAceitar(servico)}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                  >
                    Aceitar serviço
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}
