import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { LogOut, User, Pencil } from 'lucide-react';

export default function FloatingLogoutButton() {
  const [showButton, setShowButton] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [nome, setNome] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      setShowButton(!!token);

      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            setNome(data.name ?? 'Usuário');
          })
          .catch(() => setNome('Usuário'));
      }
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Tem certeza que deseja sair da sua conta?');
    if (confirmLogout) {
      localStorage.removeItem('auth_token');
      router.push('/login');
    }
  };

  const handleEditProfile = () => {
    router.push('/editar-dados');
  };

  if (!showButton) return null;

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <div className="relative">
        <button
          title="Abrir menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white shadow-2xl rounded-full hover:scale-105 transition-transform duration-300 ring-2 ring-orange-400/30 hover:ring-orange-500"
        >
          <User size={20} className="text-orange-500" />
          <span className="text-sm font-medium text-gray-800">{nome}</span>
        </button>

        {menuOpen && (
          <div className="absolute bottom-20 right-0 bg-white border rounded-xl shadow-lg px-4 py-2 space-y-2 transition-all animate-fade-in">
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-orange-500 transition"
            >
              <Pencil size={18} />
              Editar dados
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-500 hover:underline"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
