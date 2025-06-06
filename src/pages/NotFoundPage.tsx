import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <h1 className="text-9xl font-extrabold text-primary-600">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Página não encontrada</h2>
          <p className="mt-2 text-base text-gray-500">
            Desculpe, não conseguimos encontrar a página que você está procurando.
          </p>
          <div className="mt-6">
            <Link to="/">
              <Button 
                variant="primary"
                leftIcon={<Home className="h-5 w-5" />}
              >
                Voltar para a Página Inicial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};