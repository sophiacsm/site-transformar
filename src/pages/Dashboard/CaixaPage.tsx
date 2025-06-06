import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';
import { Caixa, Resultado, MONTHS } from '../../types';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Save, Loader } from 'lucide-react';

export const CaixaPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previousMonthData, setPreviousMonthData] = useState<Caixa | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    setValue,
    formState: { errors } 
  } = useForm<Caixa>({
    defaultValues: {
      mes: '',
      saldo_inicial: 0,
      saldo_final: 0
    }
  });

  // Watch values for calculations
  const mes = watch('mes');
  const saldo_inicial = watch('saldo_inicial') || 0;
  
  const fetchPreviousMonthData = async (currentMonth: string) => {
    const monthIndex = MONTHS.indexOf(currentMonth);
    if (monthIndex <= 0) return null; // No previous month for January
    
    const previousMonth = MONTHS[monthIndex - 1];
    
    try {
      const { data, error } = await supabase
        .from('caixa')
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

  const fetchResultadoData = async (month: string) => {
    try {
      const { data, error } = await supabase
        .from('resultados')
        .select('*')
        .eq('mes', month)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error fetching resultado data:', error);
      return null;
    }
  };

  // Calculate saldo_final based on the month and data
  const calculateSaldoFinal = async (month: string, saldoInicial: number) => {
    const resultado = await fetchResultadoData(month);
    
    if (!resultado) return saldoInicial;
    
    // For January: saldo_inicial + resultado_final - contas_a_pagar
    if (month === 'janeiro') {
      return saldoInicial + resultado.resultado_final - resultado.contas_a_pagar;
    } 
    // For other months: saldo_inicial + resultado_op
    else {
      return saldoInicial + resultado.resultado_op;
    }
  };

  // Update saldo_final when saldo_inicial or month changes
  useEffect(() => {
    const updateSaldoFinal = async () => {
      if (mes) {
        const calculatedSaldoFinal = await calculateSaldoFinal(mes, saldo_inicial);
        setValue('saldo_final', calculatedSaldoFinal);
      }
    };
    
    updateSaldoFinal();
  }, [mes, saldo_inicial, setValue]);

  const onSubmit = async (data: Caixa) => {
    setIsLoading(true);
    try {
      // Check if entry for this month already exists
      const { data: existingData, error: queryError } = await supabase
        .from('caixa')
        .select('id')
        .eq('mes', data.mes)
        .maybeSingle();

      if (queryError) throw new Error(queryError.message);

      let result;
      
      if (existingData) {
        // Update existing entry
        result = await supabase
          .from('caixa')
          .update(data)
          .eq('id', existingData.id);
          
        if (result.error) throw new Error(result.error.message);
        toast.success(`Caixa de ${data.mes} atualizado com sucesso!`);
      } else {
        // Insert new entry
        result = await supabase
          .from('caixa')
          .insert(data);
          
        if (result.error) throw new Error(result.error.message);
        toast.success(`Caixa de ${data.mes} cadastrado com sucesso!`);
      }
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast.error(`Erro ao salvar dados: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthChange = async (month: string) => {
    setValue('mes', month);
    setIsLoading(true);
    
    try {
      // Get previous month's data for calculations
      const prevMonthData = await fetchPreviousMonthData(month);
      setPreviousMonthData(prevMonthData);
      
      // Check if entry for this month already exists
      const { data, error } = await supabase
        .from('caixa')
        .select('*')
        .eq('mes', month)
        .maybeSingle();

      if (error) throw new Error(error.message);
      
      if (data) {
        // Populate form with existing data
        setValue('saldo_inicial', data.saldo_inicial);
        setValue('saldo_final', data.saldo_final);
      } else {
        // Set up new entry with previous month's data
        if (prevMonthData) {
          setValue('saldo_inicial', prevMonthData.saldo_final);
        } else {
          setValue('saldo_inicial', 0);
        }
        
        // Calculate saldo_final based on the month and data
        const saldoFinal = await calculateSaldoFinal(month, prevMonthData?.saldo_final || 0);
        setValue('saldo_final', saldoFinal);
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
        <h1 className="text-2xl font-bold text-gray-900">Cadastrar Caixa</h1>
        <p className="text-gray-500 mt-1">Registre os saldos de caixa mensais</p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            id="saldo_inicial"
            type="number"
            label="Saldo Inicial"
            helper="Valor do saldo final do mês anterior"
            fullWidth
            disabled={isLoading}
            error={errors.saldo_inicial?.message}
            {...register('saldo_inicial', { 
              required: 'Campo obrigatório',
              valueAsNumber: true
            })}
          />
          
          <Input
            id="saldo_final"
            type="number"
            label="Saldo Final"
            helper="Calculado automaticamente com base nos resultados"
            fullWidth
            disabled={true}
            error={errors.saldo_final?.message}
            {...register('saldo_final', { valueAsNumber: true })}
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