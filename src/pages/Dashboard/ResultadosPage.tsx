import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';
import { Resultado, MONTHS } from '../../types';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Save, Loader } from 'lucide-react';

export const ResultadosPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previousMonthData, setPreviousMonthData] = useState<Resultado | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    setValue,
    formState: { errors } 
  } = useForm<Resultado>({
    defaultValues: {
      mes: '',
      receitas: 0,
      despesas: 0,
      resultado_op: 0,
      bolsas: 0,
      resultado_final: 0,
      soma_bolsas: 0,
      fornecedores: 0,
      contas_a_pagar: 0
    }
  });

  // Watch values for calculations
  const mes = watch('mes');
  const receitas = watch('receitas') || 0;
  const despesas = watch('despesas') || 0;
  const resultado_op = watch('resultado_op') || 0;
  const bolsas = watch('bolsas') || 0;
  const soma_bolsas = watch('soma_bolsas') || 0;
  const fornecedores = watch('fornecedores') || 0;
  
  // Calculate dependent fields
  useEffect(() => {
    // Calculate resultado_op (receitas - despesas)
    const calculatedResultadoOp = receitas - despesas;
    setValue('resultado_op', calculatedResultadoOp);
    
    // Calculate resultado_final (resultado_op - bolsas)
    const calculatedResultadoFinal = calculatedResultadoOp - bolsas;
    setValue('resultado_final', calculatedResultadoFinal);
    
    // Calculate soma_bolsas (negative of bolsas)
    setValue('soma_bolsas', -bolsas);
    
    // Calculate contas_a_pagar
    // For January, it's soma_bolsas + fornecedores
    // For other months, it's previous month's contas_a_pagar + soma_bolsas + fornecedores
    const currentMonthIndex = MONTHS.indexOf(mes);
    if (currentMonthIndex === 0) { // January
      setValue('contas_a_pagar', soma_bolsas + fornecedores);
    } else if (mes && previousMonthData) {
      setValue('contas_a_pagar', previousMonthData.contas_a_pagar + soma_bolsas + fornecedores);
    }
  }, [mes, receitas, despesas, bolsas, soma_bolsas, fornecedores, setValue, previousMonthData]);

  const onSubmit = async (data: Resultado) => {
    setIsLoading(true);
    try {
      // Check if entry for this month already exists
      const { data: existingData, error: queryError } = await supabase
        .from('resultados')
        .select('id')
        .eq('mes', data.mes)
        .maybeSingle();

      if (queryError) throw new Error(queryError.message);

      let result;
      
      if (existingData) {
        // Update existing entry
        result = await supabase
          .from('resultados')
          .update(data)
          .eq('id', existingData.id);
          
        if (result.error) throw new Error(result.error.message);
        toast.success(`Resultados de ${data.mes} atualizados com sucesso!`);
      } else {
        // Insert new entry
        result = await supabase
          .from('resultados')
          .insert(data);
          
        if (result.error) throw new Error(result.error.message);
        toast.success(`Resultados de ${data.mes} cadastrados com sucesso!`);
      }
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast.error(`Erro ao salvar dados: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPreviousMonthData = async (currentMonth: string) => {
    const monthIndex = MONTHS.indexOf(currentMonth);
    if (monthIndex <= 0) return null; // No previous month for January
    
    const previousMonth = MONTHS[monthIndex - 1];
    
    try {
      const { data, error } = await supabase
        .from('resultados')
        .select('*')
        .eq('mes', previousMonth)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error fetching previous month data:', error);
      return null;
    }
  };

  const fetchFinancialData = async (month: string) => {
    try {
      // Fetch receitas data
      const { data: receitasData, error: receitasError } = await supabase
        .from('receitas')
        .select('total')
        .eq('mes', month)
        .maybeSingle();

      if (receitasError) throw new Error(receitasError.message);
      
      // Fetch despesas data
      const { data: despesasData, error: despesasError } = await supabase
        .from('despesas')
        .select('total')
        .eq('mes', month)
        .maybeSingle();

      if (despesasError) throw new Error(despesasError.message);
      
      return {
        receitas: receitasData?.total || 0,
        despesas: despesasData?.total || 0
      };
    } catch (error) {
      console.error('Error fetching financial data:', error);
      return { receitas: 0, despesas: 0 };
    }
  };

  const handleMonthChange = async (month: string) => {
    setValue('mes', month);
    setIsLoading(true);
    
    try {
      // Get previous month's data for calculations
      const prevMonthData = await fetchPreviousMonthData(month);
      setPreviousMonthData(prevMonthData);
      
      // Get financial data for the selected month
      const financialData = await fetchFinancialData(month);
      
      // Check if entry for this month already exists
      const { data, error } = await supabase
        .from('resultados')
        .select('*')
        .eq('mes', month)
        .maybeSingle();

      if (error) throw new Error(error.message);
      
      if (data) {
        // Populate form with existing data
        Object.keys(data).forEach((key) => {
          if (key !== 'id' && key !== 'created_at') {
            // @ts-ignore
            setValue(key, data[key]);
          }
        });
      } else {
        // Set up new entry with financial data
        setValue('receitas', financialData.receitas);
        setValue('despesas', financialData.despesas);
        setValue('resultado_op', financialData.receitas - financialData.despesas);
        setValue('bolsas', 0);
        setValue('resultado_final', financialData.receitas - financialData.despesas);
        setValue('soma_bolsas', 0);
        setValue('fornecedores', 0);
        
        // Set contas_a_pagar based on month
        if (month === 'janeiro') {
          setValue('contas_a_pagar', 0);
        } else if (prevMonthData) {
          setValue('contas_a_pagar', prevMonthData.contas_a_pagar);
        } else {
          setValue('contas_a_pagar', 0);
        }
      }
    } catch (error: any) {
      console.error('Error setting up form:', error);
      toast.error(`Erro ao configurar formulário: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cadastrar Resultados</h1>
        <p className="text-gray-500 mt-1">Registre os resultados financeiros mensais</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            id="mes"
            label="Selecionar mês"
            options={MONTHS.map(month => ({ value: month, label: month.charAt(0).toUpperCase() + month.slice(1) }))}
            fullWidth
            disabled={isLoading}
            error={errors.mes?.message}
            {...register('mes', { required: 'Mês é obrigatório' })}
            onChange={handleMonthChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            id="receitas"
            type="number"
            label="RECEITAS"
            fullWidth
            disabled={isLoading}
            error={errors.receitas?.message}
            {...register('receitas', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="despesas"
            type="number"
            label="DESPESAS"
            fullWidth
            disabled={isLoading}
            error={errors.despesas?.message}
            {...register('despesas', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="resultado_op"
            type="number"
            label="Resultado Op."
            fullWidth
            disabled={true}
            error={errors.resultado_op?.message}
            {...register('resultado_op', { valueAsNumber: true })}
          />
          
          <Input
            id="bolsas"
            type="number"
            label="BOLSAS"
            fullWidth
            disabled={isLoading}
            error={errors.bolsas?.message}
            {...register('bolsas', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="resultado_final"
            type="number"
            label="Res. Final"
            fullWidth
            disabled={true}
            error={errors.resultado_final?.message}
            {...register('resultado_final', { valueAsNumber: true })}
          />
          
          <Input
            id="soma_bolsas"
            type="number"
            label="Soma Bolsas"
            fullWidth
            disabled={true}
            error={errors.soma_bolsas?.message}
            {...register('soma_bolsas', { valueAsNumber: true })}
          />
          
          <Input
            id="fornecedores"
            type="number"
            label="Fornecedores"
            fullWidth
            disabled={isLoading}
            error={errors.fornecedores?.message}
            {...register('fornecedores', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="contas_a_pagar"
            type="number"
            label="Contas a Pagar"
            fullWidth
            disabled={true}
            error={errors.contas_a_pagar?.message}
            {...register('contas_a_pagar', { valueAsNumber: true })}
          />
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