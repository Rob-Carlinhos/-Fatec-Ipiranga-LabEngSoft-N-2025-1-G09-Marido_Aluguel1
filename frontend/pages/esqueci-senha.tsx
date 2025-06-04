import { useState } from 'react';
import Layout from '../components/Layout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      const res = await fetch('http://localhost:3001/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Link de redefinição enviado para seu e-mail.');
      } else {
        setError(data.error ?? 'Erro ao enviar e-mail.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro de conexão com o servidor.');
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-orange-100 pt-28 pb-24">
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-lg w-96 space-y-4 backdrop-blur-md"
        >
          <h1 className="text-2xl font-bold text-center text-orange-500">Recuperar Senha</h1>

          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2"
            required
          />

          <button
            type="submit"
            className="w-full bg-orange-400 text-white p-2 rounded hover:bg-orange-500 transition duration-200"
          >
            Enviar link de redefinição
          </button>

          {success && <p className="text-green-600 text-sm text-center">{success}</p>}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        </form>
      </div>
    </Layout>
  );
}
