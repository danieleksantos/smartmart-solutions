import React, { useState, useEffect, type FormEvent } from 'react';
import type { Category } from '../types';

interface FormDataState {
  name: string;
  price: string;
  category_id: string;
}

const ProductForm: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormDataState>({ name: '', price: '', category_id: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/categories/')
      .then(res => res.json())
      .then((data: Category[]) => setCategories(data));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id)
      };

      const response = await fetch('http://127.0.0.1:8000/products/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Produto criado com sucesso!' });
        setFormData({ name: '', price: '', category_id: '' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao criar produto.' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Erro de conexão.' });
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Novo Produto</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
          <input 
            type="text" 
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
          <input 
            type="number" 
            step="0.01"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Categoria</label>
          <select 
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
            value={formData.category_id}
            onChange={e => setFormData({...formData, category_id: e.target.value})}
          >
            <option value="">Selecione...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Salvar Produto
        </button>

        {message && (
          <div className={`p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default ProductForm;