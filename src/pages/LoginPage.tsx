import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signIn } from '../lib/firebase';
import { Layout } from '../components/Layout/Layout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Database, Lock, Mail } from 'lucide-react';
import { toast } from 'react-toastify';

type LoginFormData = {
  email: string;
  password: string;
};

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      navigate('/dashboard');
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Falha no login. Verifique seu email e senha.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-8 py-12">
            <div className="flex justify-center mb-8">
              <Database className="h-12 w-12 text-primary-600" />
            </div>
            
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
              Portal de Transparência
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="seu@email.com"
                fullWidth
                leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                error={errors.email?.message}
                {...register('email', { 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
              />
              
              <Input
                id="password"
                type="password"
                label="Senha"
                placeholder="••••••••"
                fullWidth
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                error={errors.password?.message}
                {...register('password', { 
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 6,
                    message: 'A senha deve ter pelo menos 6 caracteres'
                  }
                })}
              />
              
              <div>
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  isLoading={isLoading}
                >
                  Entrar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};