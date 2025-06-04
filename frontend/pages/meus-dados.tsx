'use client';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getToken } from '../utils/auth';

export default function MeusDados() {
  const [dados, setDados] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    tipoUsuario: ''
  });

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDados(data))
      .catch(err => {
        console.error('Erro ao buscar dados do usuário:', err);
        alert('Erro ao buscar seus dados.');
      });
  }, []);

  return (
    <Layout>
      <main className="min-h-screen bg-orange-100 pt-28 pb-20 px-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-orange-600">Meus Dados</h1>

        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
          <p><strong>Nome:</strong> {dados.name}</p>
          <p><strong>Endereço:</strong> {dados.address}</p>
          <p><strong>Telefone:</strong> {dados.phone}</p>
          <p><strong>Email:</strong> {dados.email}</p>
          <p><strong>Tipo de Usuário:</strong> {dados.tipoUsuario === 'cliente' ? 'Cliente' : 'Prestador de Serviço'}</p>
        </div>
      </main>
    </Layout>
  );
}
