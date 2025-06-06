import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';
import { Receita, MONTHS } from '../../types';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Save, Loader } from 'lucide-react';

export const ReceitasPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    setValue,
    formState: { errors } 
  } = useForm<Receita>({
    defaultValues: {
      mes: '',
      apadrinhamento: 0,
      tvne: 0,
      doacao_eu: 0,
      troco_solidario: 0,
      eventos: 0,
      chico_rei: 0,
      total: 0
    }
  });

  // Watch all numeric fields to calculate total
  const apadrinhamento = watch('apadrinhamento') || 0;
  const tvne = watch('tvne') || 0;
  const doacao_eu = watch('doacao_eu') || 0;
  const troco_solidario = watch('troco_solidario') || 0;
  const eventos = watch('eventos') || 0;
  const chico_rei = watch('chico_rei') || 0;
  
  // Calculate total and update form
  React.useEffect(() => {
    const total = apadrinhamento + tvne + doacao_eu + troco_solidario + eventos + chico_rei;
    setValue('total', total);
  }, [apadrinhamento, tvne, doacao_eu, troco_solidario, eventos, chico_rei, setValue]);

  const onSubmit = async (data: Receita) => {
    setIsLoading(true);
    try {
      // Check if entry for this month already exists
      const { data: existingData, error: queryError } = await supabase
        .from('receitas')
        .select('id')
        .eq('mes', data.mes)
        .maybeSingle();

      if (queryError) throw new Error(queryError.message);

      let result;
      
      if (existingData) {
        // Update existing entry
        result = await supabase
          .from('receitas')
          .update(data)
          .eq('id', existingData.id);
          
        if (result.error) throw new Error(result.error.message);
        toast.success(`Receitas de ${data.mes} atualizadas com sucesso!`);
      } else {
        // Insert new entry
        result = await supabase
          .from('receitas')
          .insert(data);
          
        if (result.error) throw new Error(result.error.message);
        toast.success(`Receitas de ${data.mes} cadastradas com sucesso!`);
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
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('receitas')
        .select('*')
        .eq('mes', month)
        .maybeSingle();

      if (error) throw new Error(error.message);
      
      if (data) {
        // Populate form with existing data
        setValue('apadrinhamento', data.apadrinhamento);
        setValue('tvne', data.tvne);
        setValue('doacao_eu', data.doacao_eu);
        setValue('troco_solidario', data.troco_solidario);
        setValue('eventos', data.eventos);
        setValue('chico_rei', data.chico_rei);
        setValue('total', data.total);
      } else {
        // Reset form for new month
        setValue('apadrinhamento', 0);
        setValue('tvne', 0);
        setValue('doacao_eu', 0);
        setValue('troco_solidario', 0);
        setValue('eventos', 0);
        setValue('chico_rei', 0);
        setValue('total', 0);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error(`Erro ao buscar dados: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cadastrar Receitas</h1>
        <p className="text-gray-500 mt-1">Registre as receitas mensais do projeto</p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Input
            id="apadrinhamento"
            type="number"
            label="Apadrinhamento"
            fullWidth
            disabled={isLoading}
            error={errors.apadrinhamento?.message}
            {...register('apadrinhamento', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="tvne"
            type="number"
            label="TVNE"
            fullWidth
            disabled={isLoading}
            error={errors.tvne?.message}
            {...register('tvne', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="doacao_eu"
            type="number"
            label="Doação E/U"
            fullWidth
            disabled={isLoading}
            error={errors.doacao_eu?.message}
            {...register('doacao_eu', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="troco_solidario"
            type="number"
            label="Troco Solidário"
            fullWidth
            disabled={isLoading}
            error={errors.troco_solidario?.message}
            {...register('troco_solidario', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="eventos"
            type="number"
            label="Eventos - Arraiá -Rifas - outros"
            fullWidth
            disabled={isLoading}
            error={errors.eventos?.message}
            {...register('eventos', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="chico_rei"
            type="number"
            label="Chico Rei"
            fullWidth
            disabled={isLoading}
            error={errors.chico_rei?.message}
            {...register('chico_rei', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total (mês)</span>
            <span className="text-xl font-semibold text-primary-700">
              R$ {Number(watch('total')).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <input type="hidden" {...register('total')} />
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