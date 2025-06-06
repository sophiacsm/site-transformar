import React, { useEffect, useState } from 'react';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';
import { MONTHS } from '../../types';
import { ArrowUp, ArrowDown, DollarSign, Target } from 'lucide-react';

export const DashboardHomePage: React.FC = () => {
  const [receitasData, setReceitasData] = useState<any[]>([]);
  const [despesasData, setDespesasData] = useState<any[]>([]);
  const [resultadosData, setResultadosData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch receitas
        const { data: receitas, error: receitasError } = await supabase
          .from('receitas')
          .select('*')
          .order('mes');

        if (receitasError) throw new Error(receitasError.message);
        
        // Fetch despesas
        const { data: despesas, error: despesasError } = await supabase
          .from('despesas')
          .select('*')
          .order('mes');

        if (despesasError) throw new Error(despesasError.message);
        
        // Fetch resultados
        const { data: resultados, error: resultadosError } = await supabase
          .from('resultados')
          .select('*')
          .order('mes');

        if (resultadosError) throw new Error(resultadosError.message);

        setReceitasData(receitas || []);
        setDespesasData(despesas || []);
        setResultadosData(resultados || []);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform data for chart
  const chartData = MONTHS.map(month => {
    const receita = receitasData.find(r => r.mes === month);
    const despesa = despesasData.find(d => d.mes === month);
    const resultado = resultadosData.find(r => r.mes === month);
    
    return {
      name: month.charAt(0).toUpperCase() + month.slice(1),
      receitas: receita?.total || 0,
      despesas: despesa?.total || 0,
      resultado: resultado?.resultado_final || 0,
    };
  });

  // Calculate summary
  const totalReceitas = receitasData.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalDespesas = despesasData.reduce((sum, item) => sum + (item.total || 0), 0);
  const saldoAtual = resultadosData.reduce((sum, item) => sum + (item.resultado_final || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-50 border border-error-200 rounded-md p-4 text-error-700">
        <p>Erro ao carregar dados: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-success-100 text-success-600">
              <ArrowUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Receitas</p>
              <h3 className="text-xl font-semibold text-gray-900">
                R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-error-100 text-error-600">
              <ArrowDown className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Despesas</p>
              <h3 className="text-xl font-semibold text-gray-900">
                R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Saldo Total</p>
              <h3 className="text-xl font-semibold text-gray-900">
                R$ {saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Receitas vs Despesas</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                <Legend />
                <Bar dataKey="receitas" name="Receitas" fill="#22C55E" />
                <Bar dataKey="despesas" name="Despesas" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Evolução do Resultado</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                <Legend />
                <Line type="monotone" dataKey="resultado" name="Resultado" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};