import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { supabase } from '../lib/supabase';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { MONTHS } from '../types';

export const RelatoriosPage: React.FC = () => {
  const [data, setData] = useState<any>({
    receitas: [],
    despesas: [],
    resultados: [],
    caixa: [],
    previsao: [],
    investimentos: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = ['#e44d52', '#f9c738', '#25a3c5', '#9e9da2'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all necessary data
        const [
          receitasData,
          despesasData,
          resultadosData,
          caixaData,
          previsaoData,
          investimentosData
        ] = await Promise.all([
          supabase.from('receitas').select('*').order('mes'),
          supabase.from('despesas').select('*').order('mes'),
          supabase.from('resultados').select('*').order('mes'),
          supabase.from('caixa').select('*').order('mes'),
          supabase.from('previsao').select('*'),
          supabase.from('investimentos_metas').select('*')
        ]);

        setData({
          receitas: receitasData.data || [],
          despesas: despesasData.data || [],
          resultados: resultadosData.data || [],
          caixa: caixaData.data || [],
          previsao: previsaoData.data || [],
          investimentos: investimentosData.data || []
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-4 text-error-600">
          Erro ao carregar dados: {error}
        </div>
      </Layout>
    );
  }

  // Prepare data for charts
  const receitasDespesasData = MONTHS.map(month => {
    const receita = data.receitas.find((r: any) => r.mes === month);
    const despesa = data.despesas.find((d: any) => d.mes === month);
    return {
      name: month.charAt(0).toUpperCase() + month.slice(1),
      receitas: receita?.total || 0,
      despesas: despesa?.total || 0,
      saldo: (receita?.total || 0) - (despesa?.total || 0)
    };
  });

  const receitasPorFonte = [
    { name: 'Apadrinhamento', value: data.receitas.reduce((sum: number, item: any) => sum + item.apadrinhamento, 0) },
    { name: 'TVNE', value: data.receitas.reduce((sum: number, item: any) => sum + item.tvne, 0) },
    { name: 'Doações', value: data.receitas.reduce((sum: number, item: any) => sum + item.doacao_eu, 0) },
    { name: 'Eventos', value: data.receitas.reduce((sum: number, item: any) => sum + item.eventos, 0) }
  ];

  const despesasPorCategoria = [
    { name: 'Operacionais', value: data.despesas.reduce((sum: number, item: any) => 
      sum + item.tarifas_bancarias + item.tarifas_plataformas + item.impostos_rf, 0) },
    { name: 'Pessoal', value: data.despesas.reduce((sum: number, item: any) => 
      sum + item.salarios + item.medicina_trabalho, 0) },
    { name: 'Marketing', value: data.despesas.reduce((sum: number, item: any) => 
      sum + item.marketing + item.site, 0) },
    { name: 'Outros', value: data.despesas.reduce((sum: number, item: any) => 
      sum + item.eventos + item.manutencoes + item.cartorio, 0) }
  ];

  const evolucaoCaixa = data.caixa.map((item: any) => ({
    name: item.mes.charAt(0).toUpperCase() + item.mes.slice(1),
    saldo_inicial: item.saldo_inicial,
    saldo_final: item.saldo_final
  }));

  const resultadosOperacionais = data.resultados.map((item: any) => ({
    name: item.mes.charAt(0).toUpperCase() + item.mes.slice(1),
    resultado_operacional: item.resultado_op,
    resultado_final: item.resultado_final
  }));

  const previsaoReceitas = data.previsao
    .filter((item: any) => item.tipo === 'receita')
    .map((item: any) => ({
      name: item.categoria,
      previsto: item.prevista,
      realizado: item.realizada,
      diferenca: item.realizada - item.prevista
    }));

  const previsaoDespesas = data.previsao
    .filter((item: any) => item.tipo === 'despesa')
    .map((item: any) => ({
      name: item.categoria,
      previsto: item.prevista,
      realizado: item.realizada,
      diferenca: item.realizada - item.prevista
    }));

  const investimentosData = data.investimentos
    .filter((item: any) => item.tipo === 'acao')
    .map((item: any) => ({
      name: item.categoria,
      meta: item.meta,
      realizado: item.arrecadacao_total,
      percentual: item.meta > 0 ? (item.arrecadacao_total / item.meta) * 100 : 0
    }));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Relatórios Financeiros</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Receitas vs Despesas (Bar Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Receitas vs Despesas</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={receitasDespesasData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Legend />
                  <Bar dataKey="receitas" fill="#25a3c5" name="Receitas" />
                  <Bar dataKey="despesas" fill="#e44d52" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Distribuição de Receitas (Pie Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Distribuição de Receitas</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={receitasPorFonte}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {receitasPorFonte.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Distribuição de Despesas (Pie Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Distribuição de Despesas</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={despesasPorCategoria}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {despesasPorCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Evolução do Caixa (Line Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Evolução do Caixa</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucaoCaixa}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Legend />
                  <Line type="monotone" dataKey="saldo_inicial" stroke="#f9c738" name="Saldo Inicial" />
                  <Line type="monotone" dataKey="saldo_final" stroke="#25a3c5" name="Saldo Final" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5. Resultados Operacionais (Area Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Resultados Operacionais</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={resultadosOperacionais}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Legend />
                  <Area type="monotone" dataKey="resultado_operacional" stroke="#25a3c5" fill="#25a3c5" name="Resultado Operacional" />
                  <Area type="monotone" dataKey="resultado_final" stroke="#e44d52" fill="#e44d52" name="Resultado Final" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 6. Previsão vs Realizado - Receitas (Bar Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Previsão vs Realizado - Receitas</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={previsaoReceitas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Legend />
                  <Bar dataKey="previsto" fill="#f9c738" name="Previsto" />
                  <Bar dataKey="realizado" fill="#25a3c5" name="Realizado" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 7. Previsão vs Realizado - Despesas (Bar Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Previsão vs Realizado - Despesas</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={previsaoDespesas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Legend />
                  <Bar dataKey="previsto" fill="#f9c738" name="Previsto" />
                  <Bar dataKey="realizado" fill="#e44d52" name="Realizado" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 8. Investimentos - Meta vs Realizado (Bar Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Investimentos - Meta vs Realizado</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={investimentosData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Legend />
                  <Bar dataKey="meta" fill="#f9c738" name="Meta" />
                  <Bar dataKey="realizado" fill="#25a3c5" name="Realizado" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};