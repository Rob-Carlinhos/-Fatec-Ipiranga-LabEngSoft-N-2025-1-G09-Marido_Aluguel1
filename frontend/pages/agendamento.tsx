'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getToken } from '../utils/auth';

interface Servico {
  id: number;
  tipo: string;
  observacao?: string;
  valor?: string;
  local?: string;
  urgente?: boolean;
  nome?: string;
  telefone?: string;
  userId?: number | null;
  descricao?: string;
}

export default function AgendamentoPage() {
  const router = useRouter();
  const { servicoId, servicoFixoId } = router.query;

  const [servico, setServico] = useState<Servico | null>(null);
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [dataAgendada, setDataAgendada] = useState('');
  const [horaAgendada, setHoraAgendada] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    // Obter ID do cliente
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(user => setClienteId(user.id))
      .catch(() => alert('Erro ao obter cliente'));

    // Determinar o endpoint
    let endpoint = '';
    if (servicoId) {
      endpoint = `/servicos/${servicoId}`;
    } else if (servicoFixoId) {
      endpoint = `/servicos-disponiveis/${servicoFixoId}`;
    } else {
      console.warn('Nenhum ID de serviço fornecido');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (servicoFixoId) {
          setServico({
            id: data.id,
            tipo: data.tipo,
            descricao: data.descricao,
            userId: null,
          });
        } else {
          setServico(data);
        }
      })
      .catch(() => {
        alert('Erro ao carregar dados do serviço.');
        router.push('/');
      });
  }, [servicoId, servicoFixoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token || !clienteId || !servico) return;

    setLoading(true);

    const body = {
      clienteId,
      prestadorId: servico.userId ?? null,
      servico: servico.tipo,
      dataAgendada,
      horaAgendada,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agendamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (res.status === 409) {
        alert(result.error ?? 'Horário já está ocupado. Tente outro.');
      } else if (res.ok) {
        alert('Agendamento realizado com sucesso!');
        router.push('/meus-agendamentos');
      } else {
        alert(result.error ?? 'Erro ao agendar.');
      }
    } catch (err) {
      alert('Erro na requisição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-orange-50 pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-6">
          <h2 className="text-2xl font-bold text-orange-600 text-center">Agendar Serviço</h2>

          {servico ? (
            <>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Tipo:</strong> {servico.tipo}</p>
                {servico.observacao && <p><strong>Descrição:</strong> {servico.observacao}</p>}
                {servico.descricao && <p><strong>Descrição:</strong> {servico.descricao}</p>}
                {servico.valor && <p><strong>Valor:</strong> R$ {parseFloat(servico.valor).toFixed(2)}</p>}
                {servico.local && <p><strong>Local:</strong> {servico.local}</p>}
                {servico.urgente !== undefined && (
                  <p><strong>Urgente:</strong> {servico.urgente ? 'Sim' : 'Não'}</p>
                )}
                {servico.nome && <p><strong>Prestador:</strong> {servico.nome}</p>}
                {servico.telefone && <p><strong>Telefone:</strong> {servico.telefone}</p>}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="data" className="block mb-1 text-gray-700">Data</label>
                  <input
                    id="data"
                    type="date"
                    required
                    value={dataAgendada}
                    onChange={(e) => setDataAgendada(e.target.value)}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-orange-300"
                  />
                </div>
                <div>
                  <label htmlFor="hora" className="block mb-1 text-gray-700">Hora</label>
                  <input
                    id="hora"
                    type="time"
                    required
                    value={horaAgendada}
                    onChange={(e) => setHoraAgendada(e.target.value)}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-orange-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition"
                >
                  {loading ? 'Agendando...' : 'Confirmar Agendamento'}
                </button>
              </form>
            </>
          ) : (
            <p className="text-center text-gray-500">Carregando serviço...</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
