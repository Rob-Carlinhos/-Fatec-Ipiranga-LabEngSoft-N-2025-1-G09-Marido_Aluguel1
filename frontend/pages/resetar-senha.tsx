import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ResetarSenha() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const urlToken = router.query.token as string;
    if (urlToken) {
      setToken(urlToken);
    }
  }, [router.query.token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(
        'Senha redefinida com sucesso! Você será redirecionado para a tela de login.'
      );
      router.push('/');
    } else {
      // Aqui usamos ?? em vez de ||
      alert(data.error ?? 'Erro ao redefinir a senha.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-100">
      <div className="bg-white bg-opacity-80 p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Redefinir Senha</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="new-password" className="block mb-2">
            Nova Senha:
          </label>
          <input
            id="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded transition"
          >
            Redefinir Senha
          </button>
        </form>
      </div>
    </div>
  );
}
