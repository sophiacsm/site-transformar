import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';
import { InvestimentoMeta } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Save, Loader } from 'lucide-react';

type InvestimentosMetasFormData = {
  acao: InvestimentoMeta[];
  previsao_receita: InvestimentoMeta[];
  previsao_despesa: InvestimentoMeta[];
};

export const InvestimentosPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    control,
    watch,
    setValue,
    formState: { errors } 
  } = useForm<InvestimentosMetasFormData>({
    defaultValues: {
      acao: [
        { tipo: 'acao', categoria: 'Apadrinhamento', previsao: 0, acao_meta: '', meta: 0, arrecadacao_total: 0 },
        { tipo: 'acao', categoria: 'TVNE', previsao: 0, acao_meta: '', meta: 0, arrecadacao_total: 0 },
        { tipo: 'acao', categoria: 'Doação parceiros', previsao: 0, acao_meta: '', meta: 0, arrecadacao_total: 0 },
        { tipo: 'acao', categoria: 'Troco solidário', previsao: 0, acao_meta: '', meta: 0, arrecadacao_total: 0 },
        { tipo: 'acao', categoria: 'Eventos', previsao: 0, acao_meta: '', meta: 0, arrecadacao_total: 0 },
        { tipo: 'acao', categoria: 'Rifas', previsao: 0, acao_meta: '', meta: 0, arrecadacao_total: 0 }
      ],
      previsao_receita: [
        { tipo: 'previsao_receita', categoria: 'Apadrinhamento', meta: 0, realizado: 0, alcance_meta: '', detalhamento_meta: '' },
        { tipo: 'previsao_receita', categoria: 'TVNE', meta: 0, realizado: 0, alcance_meta: '', detalhamento_meta: '' },
        { tipo: 'previsao_receita', categoria: 'Doação parceiros', meta: 0, realizado: 0, alcance_meta: '', detalhamento_meta: '' },
        { tipo: 'previsao_receita', categoria: 'Troco solidário', meta: 0, realizado: 0, alcance_meta: '', detalhamento_meta: '' },
        { tipo: 'previsao_receita', categoria: 'Eventos', meta: 0, realizado: 0, alcance_meta: '', detalhamento_meta: '' },
        { tipo: 'previsao_receita', categoria: 'Rifas', meta: 0, realizado: 0, alcance_meta: '', detalhamento_meta: '' }
      ],
      previsao_despesa: [
        { tipo: 'previsao_despesa', categoria: 'Tarifas', meta: 0, realizado: 0 },
        { tipo: 'previsao_despesa', categoria: 'Custo operacional', meta: 0, realizado: 0 },
        { tipo: 'previsao_despesa', categoria: 'Eventos', meta: 0, realizado: 0 },
        { tipo: 'previsao_despesa', categoria: 'Bolsas de estudo e RD', meta: 0, realizado: 0 },
        { tipo: 'previsao_despesa', categoria: 'Investimentos', meta: 0, realizado: 0 }
      ]
    }
  });

  const { fields: acaoFields } = useFieldArray({
    control,
    name: 'acao'
  });
  
  const { fields: previsaoReceitaFields } = useFieldArray({
    control,
    name: 'previsao_receita'
  });
  
  const { fields: previsaoDespesaFields } = useFieldArray({
    control,
    name: 'previsao_despesa'
  });

  // Calculate totals
  const acao = watch('acao');
  const previsao_receita = watch('previsao_receita');
  
  const totalPrevisao = acao.reduce((sum, item) => sum + (item.previsao || 0), 0);
  const totalMeta = acao.reduce((sum, item) => sum + (item.meta || 0), 0);
  const totalArrecadacao = acao.reduce((sum, item) => sum + (item.arrecadacao_total || 0), 0);
  
  const totalReceitaMeta = previsao_receita.reduce((sum, item) => sum + (item.meta || 0), 0);
  const totalReceitaRealizado = previsao_receita.reduce((sum, item) => sum + (item.realizado || 0), 0);

  useEffect(() => {
    // Load data on component mount
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data
        const { data, error } = await supabase
          .from('investimentos_metas')
          .select('*');

        if (error) throw new Error(error.message);
        
        if (data && data.length > 0) {
          // Group by tipo
          const acaoData = data.filter(item => item.tipo === 'acao');
          const previsaoReceitaData = data.filter(item => item.tipo === 'previsao_receita');
          const previsaoDespesaData = data.filter(item => item.tipo === 'previsao_despesa');
          
          // Update form with fetched data
          if (acaoData.length > 0) {
            setValue('acao', acaoData);
          }
          
          if (previsaoReceitaData.length > 0) {
            setValue('previsao_receita', previsaoReceitaData);
          }
          
          if (previsaoDespesaData.length > 0) {
            setValue('previsao_despesa', previsaoDespesaData);
          }
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error(`Erro ao carregar dados: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setValue]);

  const onSubmit = async (data: InvestimentosMetasFormData) => {
    setIsLoading(true);
    try {
      // Clear existing data
      await supabase.from('investimentos_metas').delete().filter('id', 'gt', 0);
      
      // Prepare all data for insertion
      const allData = [
        ...data.acao,
        ...data.previsao_receita,
        ...data.previsao_despesa
      ];
      
      // Insert all data
      const { error } = await supabase
        .from('investimentos_metas')
        .insert(allData);
        
      if (error) throw new Error(error.message);
      
      toast.success('Investimentos e metas salvos com sucesso!');
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast.error(`Erro ao salvar dados: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cadastrar Investimentos e Metas</h1>
        <p className="text-gray-500 mt-1">Registre os investimentos e metas do projeto</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Ação Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ação</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Previsão
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ação para Meta
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meta
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arrecadação Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {acaoFields.map((field, index) => (
                  <tr key={field.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input type="hidden" {...register(`acao.${index}.tipo`)} value="acao" />
                      <Input
                        id={`acao.${index}.categoria`}
                        type="text"
                        fullWidth
                        disabled={isLoading}
                        error={errors.acao?.[index]?.categoria?.message}
                        {...register(`acao.${index}.categoria`, { 
                          required: 'Campo obrigatório'
                        })}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Input
                        id={`acao.${index}.previsao`}
                        type="number"
                        fullWidth
                        disabled={isLoading}
                        error={errors.acao?.[index]?.previsao?.message}
                        {...register(`acao.${index}.previsao`, { 
                          valueAsNumber: true,
                          min: { value: 0, message: 'Valor não pode ser negativo' }
                        })}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Input
                        id={`acao.${index}.acao_meta`}
                        type="text"
                        fullWidth
                        disabled={isLoading}
                        error={errors.acao?.[index]?.acao_meta?.message}
                        {...register(`acao.${index}.acao_meta`)}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Input
                        id={`acao.${index}.meta`}
                        type="number"
                        fullWidth
                        disabled={isLoading}
                        error={errors.acao?.[index]?.meta?.message}
                        {...register(`acao.${index}.meta`, { 
                          valueAsNumber: true,
                          min: { value: 0, message: 'Valor não pode ser negativo' }
                        })}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Input
                        id={`acao.${index}.arrecadacao_total`}
                        type="number"
                        fullWidth
                        disabled={isLoading}
                        error={errors.acao?.[index]?.arrecadacao_total?.message}
                        {...register(`acao.${index}.arrecadacao_total`, { 
                          valueAsNumber: true,
                          min: { value: 0, message: 'Valor não pode ser negativo' }
                        })}
                      />
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-4 py-4 whitespace-nowrap">TOTAL</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    R$ {totalPrevisao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap"></td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    R$ {totalMeta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    R$ {totalArrecadacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Previsão - Receitas Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Previsão - Receitas</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meta
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Realizado
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alcance da Meta
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalhamento da Meta
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previsaoReceitaFields.map((field, index) => (
                  <tr key={field.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input type="hidden" {...register(`previsao_receita.${index}.tipo`)} value="previsao_receita" />
                      <Input
                        id={`previsao_receita.${index}.categoria`}
                        type="text"
                        fullWidth
                        disabled={isLoading}
                        error={errors.previsao_receita?.[index]?.categoria?.message}
                        {...register(`previsao_receita.${index}.categoria`, { 
                          required: 'Campo obrigatório'
                        })}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Input
                        id={`previsao_receita.${index}.meta`}
                        type="number"
                        fullWidth
                        disabled={isLoading}
                        error={errors.previsao_receita?.[index]?.meta?.message}
                        {...register(`previsao_receita.${index}.meta`, { 
                          valueAsNumber: true,
                          min: { value: 0, message: 'Valor não pode ser negativo' }
                        })}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Input
                        id={`previsao_receita.${index}.realizado`}
                        type="number"
                        fullWidth
                        disabled={isLoading}
                        error={errors.previsao_receita?.[index]?.realizado?.message}
                        {...register(`previsao_receita.${index}.realizado`, { 
                          valueAsNumber: true,
                          min: { value: 0, message: 'Valor não pode ser negativo' }
                        })}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Input
                        id={`previsao_receita.${index}.alcance_meta`}
                        type="text"
                        fullWidth
                        disabled={isLoading}
                        error={errors.previsao_receita?.[index]?.alcance_meta?.message}
                        {...register(`previsao_receita.${index}.alcance_meta`)}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Input
                        id={`previsao_receita.${index}.detalhamento_meta`}
                        type="text"
                        fullWidth
                        disabled={isLoading}
                        error={errors.previsao_receita?.[index]?.detalhamento_meta?.message}
                        {...register(`previsao_receita.${index}.detalhamento_meta`)}
                      />
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-4 py-4 whitespace-nowrap">TOTAL</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    R$ {totalReceitaMeta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    R$ {totalReceitaRealizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap"></td>
                  <td className="px-4 py-4 whitespace-nowrap"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Previsão - Despesas Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Previsão - Despesas</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meta
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Realizado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previsaoDespesaFields.map((field, index) => (
                  <tr key={field.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="hidden" {...register(`previsao_despesa.${index}.tipo`)} value="previsao_despesa" />
                      <Input
                        id={`previsao_despesa.${index}.categoria`}
                        type="text"
                        fullWidth
                        disabled={isLoading}
                        error={errors.previsao_despesa?.[index]?.categoria?.message}
                        {...register(`previsao_despesa.${index}.categoria`, { 
                          required: 'Campo obrigatório'
                        })}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`previsao_despesa.${index}.meta`}
                        type="number"
                        fullWidth
                        disabled={isLoading}
                        error={errors.previsao_despesa?.[index]?.meta?.message}
                        {...register(`previsao_despesa.${index}.meta`, { 
                          valueAsNumber: true,
                          min: { value: 0, message: 'Valor não pode ser negativo' }
                        })}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`previsao_despesa.${index}.realizado`}
                        type="number"
                        fullWidth
                        disabled={isLoading}
                        error={errors.previsao_despesa?.[index]?.realizado?.message}
                        {...register(`previsao_despesa.${index}.realizado`, { 
                          valueAsNumber: true,
                          min: { value: 0, message: 'Valor não pode ser negativo' }
                        })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            leftIcon={isLoading ? <Loader className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
          >
            Confirmar
          </Button>
        </div>
      </form>
    </div>
  );
};