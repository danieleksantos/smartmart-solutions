import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  LayoutDashboard, Upload, Package, DollarSign, TrendingUp, AlertCircle 
} from 'lucide-react';
import { fetchProducts, fetchSales, uploadProductsCsv } from './services/api';
import type { Product, Sale } from './services/api';
function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const productsData = await fetchProducts();
      const salesData = await fetchSales();
      setProducts(productsData);
      setSales(salesData);
    } catch (err) {
      console.error("Erro ao buscar dados", err);
      setError("Não foi possível conectar ao servidor backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      const result = await uploadProductsCsv(file);
      alert(`Sucesso! ${result.products_added} produtos adicionados.`);
      loadData();
    } catch (err) {
      console.error(err);
      setError("Erro ao processar o arquivo CSV. Verifique o console.");
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const totalRevenue = sales.reduce((acc, curr) => acc + curr.total_price, 0);
  const totalSalesItems = sales.reduce((acc, curr) => acc + curr.quantity, 0);

  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <LayoutDashboard size={28} />
            <h1 className="text-xl font-bold tracking-tight">SmartMart Analytics</h1>
          </div>
          <div className="text-sm text-gray-500">
            Painel Administrativo
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-center text-red-700">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            title="Total de Produtos" 
            value={products.length.toString()} 
            icon={<Package className="text-blue-500" />} 
          />
          <Card 
            title="Vendas Totais (Qtd)" 
            value={totalSalesItems.toString()} 
            icon={<TrendingUp className="text-green-500" />} 
          />
          <Card 
            title="Receita Total" 
            value={`R$ ${totalRevenue.toFixed(2)}`} 
            icon={<DollarSign className="text-yellow-500" />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Desempenho de Vendas</h2>
              <div className="h-64">
                {sales.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sales}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Legend />
                      <Bar name="Qtd Vendida" dataKey="quantity" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    Sem dados de vendas para exibir no gráfico.
                  </div>
                )}
              </div>
            </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Evolução da Receita</h2>
              <div className="h-64">
                {sales.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sales}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" name="Faturamento (R$)" dataKey="total_price" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    Adicione vendas para ver a evolução.
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="space-y-8">
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Importar Produtos</h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">CSV</span>
              </div>
              
              <label className={`
                flex flex-col items-center justify-center w-full h-32 
                border-2 border-dashed rounded-lg cursor-pointer 
                transition-colors duration-200
                ${uploading ? 'bg-gray-100 border-gray-300' : 'border-blue-300 hover:bg-blue-50'}
              `}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2 text-blue-500" />
                      <p className="text-sm text-gray-500">Clique para selecionar <span className="font-semibold">products.csv</span></p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".csv" 
                  onChange={handleFileUpload} 
                  disabled={uploading}
                />
              </label>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Certifique-se que o CSV use vírgula ou ponto-e-vírgula.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Produtos Recentes</h2>
              <div className="overflow-y-auto max-h-[400px]">
                {loading ? (
                  <p className="text-center text-gray-500">Carregando...</p>
                ) : products.length === 0 ? (
                  <p className="text-center text-gray-400 py-4">Nenhum produto cadastrado.</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {products.map((product) => (
                      <li key={product.id} className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded">
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-xs text-gray-500">ID: {product.id}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-600">
                          R$ {product.price.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function Card({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">
        {icon}
      </div>
    </div>
  );
}

export default App;