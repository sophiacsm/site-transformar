import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { FileDown, Loader, Database } from 'lucide-react';
import * as XLSX from 'xlsx';

export const ExportarPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const exportToExcel = async () => {
    setIsLoading(true);
    try {
      // Fetch all data from different tables
      const { data: receitas, error: receitasError } = await supabase
        .from('receitas')
        .select('*')
        .order('mes');
      
      if (receitasError) throw new Error(receitasError.message);
      
      const { data: despesas, error: despesasError } = await supabase
        .from('despesas')
        .select('*')
        .order('mes');
      
      if (despesasError) throw new Error(despesasError.message);
      
      const { data: resultados, error: resultadosError } = await supabase
        .from('resultados')
        .select('*')
        .order('mes');
      
      if (resultadosError) throw new Error(resultadosError.message);
      
      const { data: caixa, error: caixaError } = await supabase
        .from('caixa')
        .select('*')
        .order('mes');
      
      if (caixaError) throw new Error(caixaError.message);
      
      const { data: previsao, error: previsaoError } = await supabase
        .from('previsao')
        .select('*');
      
      if (previsaoError) throw new Error(previsaoError.message);
      
      const { data: investimentos, error: investimentosError } = await supabase
        .from('investimentos_metas')
        .select('*');
      
      if (investimentosError) throw new Error(investimentosError.message);

      // Split previsao data by tipo
      const previsaoDespesas = previsao?.filter(item => item.tipo === 'despesa') || [];
      const previsaoReceitas = previsao?.filter(item => item.tipo === 'receita') || [];
      
      // Split investimentos data by tipo
      const acoes = investimentos?.filter(item => item.tipo === 'acao') || [];
      const previsaoReceitasMetas = investimentos?.filter(item => item.tipo === 'previsao_receita') || [];
      const previsaoDespesasMetas = investimentos?.filter(item => item.tipo === 'previsao_despesa') || [];

      // Create workbook with multiple sheets
      const workbook = XLSX.utils.book_new();
      
      // Add sheets for each data type
      if (receitas && receitas.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(receitas);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Receitas');
      }
      
      if (despesas && despesas.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(despesas);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Despesas');
      }
      
      if (resultados && resultados.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(resultados);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados');
      }
      
      if (caixa && caixa.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(caixa);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Caixa');
      }
      
      if (previsaoDespesas.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(previsaoDespesas);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Previsão - Despesas');
      }
      
      if (previsaoReceitas.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(previsaoReceitas);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Previsão - Receitas');
      }
      
      if (acoes.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(acoes);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Ações');
      }
      
      if (previsaoReceitasMetas.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(previsaoReceitasMetas);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Previsão Receitas Metas');
      }
      
      if (previsaoDespesasMetas.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(previsaoDespesasMetas);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Previsão Despesas Metas');
      }

      // Generate filename with date
      const date = new Date();
      const filename = `dados-financeiros-${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.xlsx`;
      
      // Write and download the file
      XLSX.writeFile(workbook, filename);
      
      toast.success('Dados exportados com sucesso!');
    } catch (error: any) {
      console.error('Error exporting data:', error);
      toast.error(`Erro ao exportar dados: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exportar Dados</h1>
        <p className="text-gray-500 mt-1">Exporte todos os dados para um arquivo Excel</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
          <Database className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Exportar todos os dados</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Clique no botão abaixo para exportar todos os dados cadastrados para um arquivo Excel separado por abas.
          </p>
        </div>
        
        <div>
          <Button
            onClick={exportToExcel}
            variant="primary"
            size="lg"
            isLoading={isLoading}
            leftIcon={isLoading ? <Loader className="animate-spin h-5 w-5" /> : <FileDown className="h-5 w-5" />}
          >
            Exportar para Excel
          </Button>
        </div>
      </div>
    </div>
  );
};