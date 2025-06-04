'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getToken, removeToken } from '../utils/auth';
import { useRouter } from 'next/router';

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState<'cliente' | 'prestador' | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();
  const rotaAtual = router.pathname;

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLogged(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(user => {
          setTipoUsuario(user.tipoUsuario);
          setUserName(user.name);
        })
        .catch(() => {
          setIsLogged(false);
          removeToken();
        });
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsLogged(false);
    router.push('/login');
  };

  const baseBtnClasses = 'px-3 py-1 rounded font-semibold transition text-sm md:text-base';
  const activeBtn = `${baseBtnClasses} bg-[#FFE8C4] hover:bg-[#F89D13] hover:text-white`;

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <Image
            src="/MA_logo_solid.png"
            alt="Logo Marido de Aluguel"
            width={60}
            height={60}
            className="cursor-pointer"
          />
        </Link>

        <nav className="space-x-4 text-gray-700 flex items-center">
          {!isLogged && rotaAtual !== '/login' && (
            <Link href="/login" className={activeBtn}>
              Login
            </Link>
          )}

          {!isLogged && rotaAtual !== '/cadastro' && (
            <Link href="/cadastro" className={activeBtn}>
              Cadastrar
            </Link>
          )}

          {isLogged && tipoUsuario === 'cliente' && (
            <>
              {rotaAtual !== '/meus-servicos' && (
                <Link href="/meus-servicos" className={activeBtn}>
                  Meus Serviços
                </Link>
              )}
              {rotaAtual !== '/meus-agendamentos' && (
                <Link href="/meus-agendamentos" className={activeBtn}>
                  Meus Agendamentos
                </Link>
              )}
              {rotaAtual !== '/contratar-prestador' && (
                <Link href="/contratar-prestador" className={activeBtn}>
                  Cadastrar Novo Serviço
                </Link>
              )}
              {rotaAtual !== '/servicos-fixos' && (
                <Link href="/servicos-fixos" className={activeBtn}>
                  Serviços Fixos
                </Link>
              )}
              {userName && (
                <button
                  onClick={() => router.push('/meus-dados')}
                  className="px-3 py-1 rounded text-orange-600 border border-orange-400 hover:bg-orange-100 transition"
                >
                  {userName.split(' ')[0]}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 rounded font-semibold text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition"
              >
                Sair
              </button>
            </>
          )}

          {isLogged && tipoUsuario === 'prestador' && (
            <>
              {rotaAtual !== '/agendamentos-recebidos' && (
                <Link href="/agendamentos-recebidos" className={activeBtn}>
                  Agendamentos
                </Link>
              )}
              {userName && (
                <button
                  onClick={() => router.push('/meus-dados')}
                  className="px-3 py-1 rounded text-orange-600 border border-orange-400 hover:bg-orange-100 transition"
                >
                  {userName.split(' ')[0]}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 rounded font-semibold text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition"
              >
                Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
