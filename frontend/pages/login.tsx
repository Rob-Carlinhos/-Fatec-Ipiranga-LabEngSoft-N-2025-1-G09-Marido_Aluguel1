import { useState } from 'react';
import { useRouter } from 'next/router';
import { saveToken } from '../utils/auth';
import { MailQuestion, UserPlus } from 'lucide-react';
import Layout from '../components/Layout';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.errors)) {
          const message = data.errors.map((err: any) => `• ${err.msg}`).join('\n');
          alert(`Erros de validação:\n${message}`);
        } else if (data.error) {
          alert(data.error);
        } else {
          alert('Erro ao fazer login.');
        }
        return;
      }

      // Armazena o token
      saveToken(data.token);

      // Armazena o tipo do usuário no localStorage (ou sessionStorage se preferir)
      localStorage.setItem('tipoUsuario', data.user.tipoUsuario);

      // Redireciona para a tela apropriada
      if (data.user.tipoUsuario === 'prestador') {
        router.push('/painel-prestador'); // você pode criar essa rota
      } else {
        router.push('/home'); // cliente vai pra tela padrão
      }
    } catch (error) {
      console.error('Erro na requisição de login:', error);
      alert('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-orange-100 pt-16">
        <div className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-md w-full max-w-md mt-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
            />

            <label htmlFor="password" className="block mb-2">Senha</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2 right-2 text-sm text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded transition"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-700 space-y-3">
            <a
              href="/esqueci-senha"
              className="flex justify-center items-center gap-2 text-orange-500 hover:text-orange-600 transition-all hover:scale-105"
            >
              <MailQuestion className="w-4 h-4 animate-pulse" />
              Esqueci minha senha
            </a>
            <a
              href="/cadastro"
              className="flex justify-center items-center gap-2 text-orange-500 hover:text-orange-600 transition-all hover:scale-105"
            >
              <UserPlus className="w-4 h-4 animate-bounce" />
              Criar novo cadastro
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
