import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';
import { Despesa, MONTHS } from '../../types';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Save, Loader } from 'lucide-react';

export const DespesasPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    setValue,
    formState: { errors } 
  } = useForm<Despesa>({
    defaultValues: {
      mes: '',
      tarifas_bancarias: 0,
      tarifas_plataformas: 0,
      impostos_rf: 0,
      anuidade_plataformas: 0,
      salarios: 0,
      site: 0,
      marketing: 0,
      eventos: 0,
      certificado_digital: 0,
      medicina_trabalho: 0,
      contabilidade: 0,
      celular_claro: 0,
      manutencoes: 0,
      cartorio: 0,
      total: 0
    }
  });

  // Watch all numeric fields to calculate total
  const tarifas_bancarias = watch('tarifas_bancarias') || 0;
  const tarifas_plataformas = watch('tarifas_plataformas') || 0;
  const impostos_rf = watch('impostos_rf') || 0;
  const anuidade_plataformas = watch('anuidade_plataformas') || 0;
  const salarios = watch('salarios') || 0;
  const site = watch('site') || 0;
  const marketing = watch('marketing') || 0;
  const eventos = watch('eventos') || 0;
  const certificado_digital = watch('certificado_digital') || 0;
  const medicina_trabalho = watch('medicina_trabalho') || 0;
  const contabilidade = watch('contabilidade') || 0;
  const celular_claro = watch('celular_claro') || 0;
  const manutencoes = watch('manutencoes') || 0;
  const cartorio = watch('cartorio') || 0;
  
  // Calculate total and update form
  React.useEffect(() => {
    const total = 
      tarifas_bancarias + 
      tarifas_plataformas + 
      impostos_rf + 
      anuidade_plataformas + 
      salarios + 
      site + 
      marketing + 
      eventos + 
      certificado_digital + 
      medicina_trabalho + 
      contabilidade + 
      celular_claro + 
      manutencoes + 
      cartorio;
    
    setValue('total', total);
  }, [
    tarifas_bancarias, tarifas_plataformas, impostos_rf, anuidade_plataformas,
    salarios, site, marketing, eventos, certificado_digital, medicina_trabalho,
    contabilidade, celular_claro, manutencoes, cartorio, setValue
  ]);

  const onSubmit = async (data: Despesa) => {
    setIsLoading(true);
    try {
      // Check if entry for this month already exists
      const { data: existingData, error: queryError } = await supabase
        .from('despesas')
        .select('id')
        .eq('mes', data.mes)
        .maybeSingle();

      if (queryError) throw new Error(queryError.message);

      let result;
      
      if (existingData) {
        // Update existing entry
        result = await supabase
          .from('despesas')
          .update(data)
          .eq('id', existingData.id);
          
        if (result.error) throw new Error(result.error.message);
        toast.success(`Despesas de ${data.mes} atualizadas com sucesso!`);
      } else {
        // Insert new entry
        result = await supabase
          .from('despesas')
          .insert(data);
          
        if (result.error) throw new Error(result.error.message);
        toast.success(`Despesas de ${data.mes} cadastradas com sucesso!`);
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
        .from('despesas')
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
        // Reset form for new month
        setValue('tarifas_bancarias', 0);
        setValue('tarifas_plataformas', 0);
        setValue('impostos_rf', 0);
        setValue('anuidade_plataformas', 0);
        setValue('salarios', 0);
        setValue('site', 0);
        setValue('marketing', 0);
        setValue('eventos', 0);
        setValue('certificado_digital', 0);
        setValue('medicina_trabalho', 0);
        setValue('contabilidade', 0);
        setValue('celular_claro', 0);
        setValue('manutencoes', 0);
        setValue('cartorio', 0);
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
        <h1 className="text-2xl font-bold text-gray-900">Cadastrar Despesas</h1>
        <p className="text-gray-500 mt-1">Registre as despesas mensais do projeto</p>
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
            id="tarifas_bancarias"
            type="number"
            label="Tarifas bancárias"
            fullWidth
            disabled={isLoading}
            error={errors.tarifas_bancarias?.message}
            {...register('tarifas_bancarias', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="tarifas_plataformas"
            type="number"
            label="Tarifas das plataformas"
            fullWidth
            disabled={isLoading}
            error={errors.tarifas_plataformas?.message}
            {...register('tarifas_plataformas', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="impostos_rf"
            type="number"
            label="Impostos RF"
            fullWidth
            disabled={isLoading}
            error={errors.impostos_rf?.message}
            {...register('impostos_rf', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="anuidade_plataformas"
            type="number"
            label="Anuidade das plataformas"
            fullWidth
            disabled={isLoading}
            error={errors.anuidade_plataformas?.message}
            {...register('anuidade_plataformas', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="salarios"
            type="number"
            label="Salários"
            fullWidth
            disabled={isLoading}
            error={errors.salarios?.message}
            {...register('salarios', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="site"
            type="number"
            label="Site"
            fullWidth
            disabled={isLoading}
            error={errors.site?.message}
            {...register('site', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="marketing"
            type="number"
            label="Marketing"
            fullWidth
            disabled={isLoading}
            error={errors.marketing?.message}
            {...register('marketing', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="eventos"
            type="number"
            label="Eventos"
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
            id="certificado_digital"
            type="number"
            label="Certificado digital"
            fullWidth
            disabled={isLoading}
            error={errors.certificado_digital?.message}
            {...register('certificado_digital', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="medicina_trabalho"
            type="number"
            label="Medicina do trabalho"
            fullWidth
            disabled={isLoading}
            error={errors.medicina_trabalho?.message}
            {...register('medicina_trabalho', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="contabilidade"
            type="number"
            label="Contabilidade"
            fullWidth
            disabled={isLoading}
            error={errors.contabilidade?.message}
            {...register('contabilidade', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="celular_claro"
            type="number"
            label="Celular - Claro"
            fullWidth
            disabled={isLoading}
            error={errors.celular_claro?.message}
            {...register('celular_claro', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="manutencoes"
            type="number"
            label="Manutenções"
            fullWidth
            disabled={isLoading}
            error={errors.manutencoes?.message}
            {...register('manutencoes', { 
              required: 'Campo obrigatório',
              valueAsNumber: true,
              min: { value: 0, message: 'Valor não pode ser negativo' }
            })}
          />
          
          <Input
            id="cartorio"
            type="number"
            label="Cartório"
            fullWidth
            disabled={isLoading}
            error={errors.cartorio?.message}
            {...register('cartorio', { 
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