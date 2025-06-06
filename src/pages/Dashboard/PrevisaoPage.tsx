import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';
import { Previsao } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Save, Loader, Plus, Trash2 } from 'lucide-react';

type PrevisaoFormData = {
  despesas: {
    categoria: string;
    prevista: number;
    realizada: number;
  }[];
  receitas: {
    categoria: string;
    prevista: number;
    realizada: number;
  }[];
};

export const PrevisaoPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    control,
    watch,
    setValue,
    formState: { errors } 
  } = useForm<PrevisaoFormData>({
    defaultValues: {
      despesas: [
        { categoria: 'Tarifas administrativas, bancárias, impostos, contabilidade', prevista: 0, realizada: 0 },
        { categoria: 'Custo operacional', prevista: 0, realizada: 0 },
        { categoria: 'Eventos, site, celular, marketing e manutenção', prevista: 0, realizada: 0 },
        { categoria: 'Bolsas de estudo e RD', prevista: 0, realizada: 0 },
        { categoria: 'Investimentos', prevista: 0, realizada: 0 }
      ],
      receitas: [
        { categoria: 'Apadrinhamento', prevista: 0, realizada: 0 },
        { categoria: 'TVNE/ Parcerias/Chico Rei', prevista: 0, realizada: 0 },
        { categoria: 'Troco Solidário "em negociação"', prevista: 0, realizada: 0 },
        { categoria: 'Eventos, rifas, vendas de produtos', prevista: 0, realizada: 0 }
      ]
    }
  });

  const { fields: despesasFields } = useFieldArray({
    control,
    name: 'despesas'
  });
  
  const { fields: receitasFields } = useFieldArray({
    control,
    name: 'receitas'
  });

  // Watch all fields to calculate totals
  const despesas = watch('despesas');
  const receitas = watch('receitas');
  
  const totalDespesasPrevista = despesas.reduce((sum, item) => sum + (item.prevista || 0), 0);
  const totalDespesasRealizada = despesas.reduce((sum, item) => sum + (item.realizada || 0), 0);
  
  const totalReceitasPrevista = receitas.reduce((sum, item) => sum + (item.prevista || 0), 0);
  const totalReceitasRealizada = receitas.reduce((sum, item) => sum + (item.realizada || 0), 0);

  useEffect(() => {
    // Load data on component mount
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch despesas data
        const { data: despesasData, error: despesasError } = await supabase
          .from('previsao')
          .select('*')
          .eq('tipo', 'despesa');

        if (despesasError) throw new Error(despesasError.message);
        
        // Fetch receitas data
        const { data: receitasData, error: receitasError } = await supabase
          .from('previsao')
          .select('*')
          .eq('tipo', 'receita');

        if (receitasError) throw new Error(receitasError.message);
        
        // Update form with fetched data if exists
        if (despesasData && despesasData.length > 0) {
          setValue('despesas', despesasData.map(item => ({
            categoria: item.categoria,
            prevista: item.prevista,
            realizada: item.realizada
          })));
        }
        
        if (receitasData && receitasData.length > 0) {
          setValue('receitas', receitasData.map(item => ({
            categoria: item.categoria,
            prevista: item.prevista,
            realizada: item.realizada
          })));
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

  const onSubmit = async (data: PrevisaoFormData) => {
    setIsLoading(true);
    try {
      // Clear existing data
      await supabase.from('previsao').delete().filter('id', 'gt', 0);
      
      // Prepare data for insertion
      const despesasData = data.despesas.map(item => ({
        tipo: 'despesa',
        categoria: item.categoria,
        prevista: item.prevista,
        realizada: item.realizada
      }));
      
      const receitasData = data.receitas.map(item => ({
        tipo: 'receita',
        categoria: item.categoria,
        prevista: item.prevista,
        realizada: item.realizada
      }));
      
      // Insert all data
      const { error } = await supabase
        .from('previsao')
        .insert([...despesasData, ...receitasData]);
        
      if (error) throw new Error(error.message);
      
      toast.success('Previsões salvas com sucesso!');
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
        <h1 className="text-2xl font-bold text-gray-900">Cadastrar Previsão</h1>
        <p className="text-gray-500 mt-1">Registre as previsões de receitas e despesas</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Despesas Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Despesas</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prevista
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Realizada
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {despesasFields.map((field, index) => (
                  <tr key={field.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`despesas.${index}.categoria`}
                        type="text"
                        fullWidth
                        disabled={isLoading}
                        error={errors.despesas?.[index]?.categoria?.message}
                        {...register(`despesas.${index}.categoria`, { 
                          required: 'Campo obrigatório'
                        })}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`despesas.${index}.prevista`}
                        type="number"
                        fullWidth
                        disabled={isLoading}
                        error={errors.despesas?.[index]?.prevista?.message}
                        {...register(`despesas.${index}.prevista`, { 
                          required: 'Campo obrigatório',
                          valueAsNumber: true,
                          min: { value: 0, message: 'Valor não pode ser negativo' }
                        })}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`despesas.${index}.realizada`}
                        type="number"
                        fullWidth
                        disabled={isLoading}
                        error={errors.despesas?.[index]?.realizada?.message}
                        {...register(`despesas.${index}.realizada`, { 
                          required: 'Campo obrigatório',
                          valueAsNumber: true,
                          min: { value: 0, message: 'Valor não pode ser negativo' }
                        })}
                      />
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-4 whitespace-nowrap">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    R$ {totalDespesasPrevista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    R$ {totalDespesasRealizada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Receitas Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Receitas</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prevista
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Realizada
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {receitasFields.map((field, index) => (
                  <tr key={field.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`receitas.${index}.categoria`}
                        type="text"
                        fullWidth
                        disabled={isLoading}
                        error={errors.receitas?.[index]?.categoria?.message}
                        {...register(`receitas.${index}.categoria`, { 
                          required: 'Campo obrigatório'
                        })}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`receitas.${index}.prevista`}
                        type="number"
                        fullWidth
                        disabled={isLoading}
                        error={errors.receitas?.[index]?.prevista?.message}
                        {...register(`receitas.${index}.prevista`, { 
                          required: 'Campo obrigatório',
                          valueAsNumber: true,
                          min: { value: 0, message: 'Valor não pode ser negativo' }
                        })}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`receitas.${index}.realizada`}
                        type="number"
                        fullWidth
                        disabled={isLoading}
                        error={errors.receitas?.[index]?.realizada?.message}
                        {...register(`receitas.${index}.realizada`, { 
                          required: 'Campo obrigatório',
                          valueAsNumber: true,
                          min: { value: 0, message: 'Valor não pode ser negativo' }
                        })}
                      />
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-4 whitespace-nowrap">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    R$ {totalReceitasPrevista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    R$ {totalReceitasRealizada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
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