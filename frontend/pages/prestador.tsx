import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { getToken } from '../utils/auth';

export default function PrestadorPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: '',
    enderecoResidencial: '',
    telefone: '',
    email: '',
    cpf: '',
    enderecoComercial: '',
    profissao: '',
    empresa: '',
    entrada: '',
    saida: '',
    cnpj: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchUserData = async () => {
      const token = getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const resUser = await fetch('http://localhost:3001/api/user/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (resUser.ok) {
          const data = await resUser.json();
          setFormData(prev => ({
            ...prev,
            nome: data.name ?? '',
            email: data.email ?? '',
            telefone: data.phone ?? '',
            enderecoResidencial: data.address ?? ''
          }));
        }

        const resPrestador = await fetch('http://localhost:3001/api/prestador/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (resPrestador.ok) {
          const prestador = await resPrestador.json();

          setFormData(prev => ({
            ...prev,
            cpf: prestador.cpf ?? '',
            enderecoResidencial: prestador.enderecoResidencial ?? prev.enderecoResidencial,
            enderecoComercial: prestador.enderecoComercial ?? '',
            profissao: prestador.profissao ?? '',
            empresa: prestador.empresa ?? '',
            entrada: prestador.entrada ?? '',
            saida: prestador.saida ?? '',
            cnpj: prestador.cnpj ?? ''
          }));

          const obrigatorios = ['cpf', 'telefone', 'enderecoResidencial', 'profissao'];
          const preenchidos = obrigatorios.every(campo => !!prestador[campo]);

          if (preenchidos) {
            setLoading(true);
            setTimeout(() => {
              router.push('/servicos-disponiveis');
            }, 6000);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = getToken();

    if (!token) {
      alert('Usuário não autenticado. Faça login novamente.');
      router.push('/login');
      return;
    }

    const obrigatorios = ['nome', 'telefone', 'email', 'cpf', 'enderecoResidencial', 'profissao'];
    const dadosFaltando = obrigatorios.filter(campo => !formData[campo as keyof typeof formData]);

    if (dadosFaltando.length > 0) {
      alert(`Preencha os campos obrigatórios: ${dadosFaltando.join(', ')}`);
      return;
    }

    const payload = {
      ...formData,
      cnpj: formData.cnpj ?? null
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/prestador`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        if (data?.errors && Array.isArray(data.errors)) {
          const mensagem = data.errors.map((err: any) => `• ${err.msg}`).join('\n');
          alert(`Erros de validação:\n${mensagem}`);
        } else if (data?.error) {
          alert(data.error);
        } else {
          alert('Erro ao salvar os dados.');
        }
        return;
      }

      router.push('/servicos-disponiveis');
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
      alert('Erro ao salvar os dados. Verifique sua conexão.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center text-orange-500 text-lg animate-pulse">
            <svg
              className="animate-spin h-8 w-8 text-orange-400 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Verificando seus dados... Aguarde o redirecionamento automático.
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-orange-50 pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-2xl font-semibold text-orange-500 text-center mb-4">
            Cadastro do Prestador de Serviço
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="nome" value={formData.nome} readOnly className="w-full p-2 border rounded bg-gray-100" placeholder="Nome completo" />
            <input name="email" value={formData.email} readOnly className="w-full p-2 border rounded bg-gray-100" placeholder="E-mail" />
            <input name="telefone" value={formData.telefone} readOnly className="w-full p-2 border rounded bg-gray-100" placeholder="Telefone" />
            <input name="enderecoResidencial" value={formData.enderecoResidencial} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Endereço residencial" />
            <input name="cpf" value={formData.cpf} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="CPF" />
            <input name="enderecoComercial" value={formData.enderecoComercial} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Endereço comercial (opcional)" />
            <input name="profissao" value={formData.profissao} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Profissão" />
            <input name="empresa" value={formData.empresa} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Empresa atual ou anterior" />
            <input name="cnpj" value={formData.cnpj} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="CNPJ (se houver)" />

            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded transition">
                Salvar e ver serviços disponíveis
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
