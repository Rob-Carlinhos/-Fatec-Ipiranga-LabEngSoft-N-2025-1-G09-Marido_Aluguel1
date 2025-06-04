'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function CadastroPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    tipoUsuario: 'cliente',
    cpf: ''
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validations, setValidations] = useState({
    name: false,
    phone: false,
    email: false,
    password: false,
    cpf: false
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  const validateInput = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return /^[A-Za-zÀ-ÿ\s]+$/.test(value);
      case 'phone':
        return /^\d{11}$/.test(value);
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'password':
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&]{6,}$/.test(value);
      case 'cpf':
        return /^\d{11}$/.test(value);
      default:
        return true;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name in validations) {
      setValidations(prev => ({ ...prev, [name]: validateInput(name, value) }));
    }

    if (name === 'password') {
      setPasswordCriteria({
        length: value.length >= 6,
        upper: /[A-Z]/.test(value),
        lower: /[a-z]/.test(value),
        number: /\d/.test(value),
        special: /[^A-Za-z0-9]/.test(value)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = Object.values(validations).every(Boolean);

    if (formData.password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (!isValid) {
      alert('Preencha todos os campos corretamente!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.errors)) {
          const messages = data.errors.map((err: any) => `• ${err.msg}`).join('\n');
          alert(`Erros de validação:\n${messages}`);
        } else if (data.error) {
          alert(data.error);
        } else {
          alert('Erro ao cadastrar. Verifique os dados.');
        }
        return;
      }

      alert('Cadastro realizado com sucesso!');
      router.push('/');
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-orange-100 pt-28 pb-24">
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-lg w-96 space-y-4 backdrop-blur-md"
        >
          <h1 className="text-3xl font-bold text-center text-orange-500">Cadastro</h1>

          <div>
            <label htmlFor="name">Nome completo</label>
            <input id="name" name="name" value={formData.name} onChange={handleChange} required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2" />
            <p className={formData.name && !validations.name ? 'text-red-600 text-sm' : 'text-green-600 text-sm'}>
              {formData.name && (validations.name ? 'Nome válido.' : 'Apenas letras são permitidas.')}
            </p>
          </div>

          <div>
            <label htmlFor="cpf">CPF</label>
            <input id="cpf" name="cpf" maxLength={11} value={formData.cpf} onChange={handleChange} required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2" />
            <p className={formData.cpf && !validations.cpf ? 'text-red-600 text-sm' : 'text-green-600 text-sm'}>
              {formData.cpf && (validations.cpf ? 'CPF válido.' : 'Digite exatamente 11 números.')}
            </p>
          </div>

          <div>
            <label htmlFor="address">Endereço</label>
            <input id="address" name="address" value={formData.address} onChange={handleChange} required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2" />
          </div>

          <div>
            <label htmlFor="phone">Telefone</label>
            <input id="phone" name="phone" maxLength={11} value={formData.phone} onChange={handleChange} required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2" />
            <p className={formData.phone && !validations.phone ? 'text-red-600 text-sm' : 'text-green-600 text-sm'}>
              {formData.phone && (validations.phone ? 'Telefone válido.' : 'Digite 11 números.')}
            </p>
          </div>

          <div>
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2" />
            <p className={formData.email && !validations.email ? 'text-red-600 text-sm' : 'text-green-600 text-sm'}>
              {formData.email && (validations.email ? 'E-mail válido.' : 'Formato inválido.')}
            </p>
          </div>

          <div className="relative">
            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type={showPassword ? 'text' : 'password'}
              value={formData.password} onChange={handleChange} required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9" title="Mostrar senha">
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <ul className="text-sm space-y-1">
            <li className={passwordCriteria.length ? 'text-green-600' : 'text-red-600'}>• Pelo menos 6 caracteres</li>
            <li className={passwordCriteria.upper ? 'text-green-600' : 'text-red-600'}>• Pelo menos 1 letra maiúscula</li>
            <li className={passwordCriteria.lower ? 'text-green-600' : 'text-red-600'}>• Pelo menos 1 letra minúscula</li>
            <li className={passwordCriteria.number ? 'text-green-600' : 'text-red-600'}>• Pelo menos 1 número</li>
            <li className={passwordCriteria.special ? 'text-green-600' : 'text-red-600'}>• Pelo menos 1 caractere especial</li>
          </ul>

          <div className="relative">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 pr-10" />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9" title="Mostrar senha">
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <p className={`text-sm ${confirmPassword === formData.password ? 'text-green-600' : 'text-red-600'}`}>
            {confirmPassword && (confirmPassword === formData.password ? 'Senhas coincidem.' : 'As senhas não coincidem.')}
          </p>

          <div>
            <label htmlFor="tipoUsuario">Tipo de usuário</label>
            <select id="tipoUsuario" name="tipoUsuario" value={formData.tipoUsuario} onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-orange-300">
              <option value="cliente">Cliente</option>
              <option value="prestador">Prestador</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-orange-400 text-white p-2 rounded hover:bg-orange-500 transition duration-200">
            Cadastrar
          </button>
        </form>
      </div>
    </Layout>
  );
}
