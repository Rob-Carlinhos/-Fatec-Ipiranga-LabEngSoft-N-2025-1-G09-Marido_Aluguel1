import { useState, useEffect } from 'react';
import { getToken } from '../utils/auth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CadastrarServicoPopup({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    tipo: '',
    observacao: '',
    local: '',
    valor: '',
    urgente: false,
  });

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setFormData(prev => ({
          ...prev,
          nome: data.name || '',
          telefone: data.phone || '',
        }));
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return alert("Token inválido. Faça login novamente.");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        valor: parseFloat(formData.valor.replace(',', '.'))
      }),
    });

    if (response.ok) {
      alert('Serviço personalizado cadastrado com sucesso!');
      onClose();
      onSuccess?.();
    } else {
      const err = await response.json();
      alert('Erro: ' + err.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-lg w-full shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-orange-600">Criar Serviço Personalizado</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="nome" value={formData.nome} readOnly className="input-field bg-gray-100" />
          <input name="telefone" value={formData.telefone} readOnly className="input-field bg-gray-100" />

          <select name="tipo" value={formData.tipo} onChange={handleChange} className="input-field" required>
            <option value="">Selecione o tipo</option>
            <option value="Eletricista">Eletricista</option>
            <option value="Encanador">Encanador</option>
            <option value="Marceneiro">Marceneiro</option>
            <option value="Pedreiro">Pedreiro</option>
            <option value="Motorista">Motorista</option>
            <option value="Limpeza">Limpeza</option>
            <option value="Jardinagem">Jardinagem</option>
            <option value="Outro">Outro</option>
          </select>

          <textarea
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
            placeholder="Descreva o serviço com detalhes..."
            className="input-field"
            required
          />

          <input
            name="local"
            value={formData.local}
            onChange={handleChange}
            placeholder="Endereço ou região do serviço"
            className="input-field"
            required
          />

          <input
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            placeholder="Valor sugerido (ex: 150.00)"
            className="input-field"
            required
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="urgente"
              checked={formData.urgente}
              onChange={handleChange}
            />
            <span>Marcar como urgente</span>
          </label>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-orange-500 text-white">
              Salvar
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 0.375rem;
        }
        .input-field:focus {
          border-color: #f97316;
          outline: none;
        }
      `}</style>
    </div>
  );
}
