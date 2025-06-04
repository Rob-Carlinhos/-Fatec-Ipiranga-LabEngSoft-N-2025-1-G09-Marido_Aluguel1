import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleRecover = async (e: any) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3001/api/recover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (response.ok) {
      alert('Um link de recuperação foi enviado para seu e-mail!');
      router.push('/');
    } else {
      alert('E-mail não encontrado!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-100">
      <form onSubmit={handleRecover} className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-lg w-96 space-y-4 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-center text-orange-500">Recuperar Senha</h1>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <button type="submit" className="w-full bg-orange-400 text-white p-2 rounded hover:bg-orange-500 transition duration-200">
          Recuperar
        </button>
      </form>
    </div>
  );
}