import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <span className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Portal de Transparência Financeira. Todos os direitos reservados.
            </span>
          </div>
          
          <div className="mt-4 md:mt-0">
            <p className="text-center text-sm text-gray-500 flex items-center justify-center md:justify-end">
              Feito com <Heart className="h-4 w-4 mx-1 text-error-500" /> para você!
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center md:justify-start space-x-6">
          <Link to="/privacidade" className="text-sm text-gray-500 hover:text-gray-900">
            Política de Privacidade
          </Link>
          <Link to="/termos" className="text-sm text-gray-500 hover:text-gray-900">
            Termos de Uso
          </Link>
          <Link to="/sobre" className="text-sm text-gray-500 hover:text-gray-900">
            Sobre
          </Link>
          <Link to="/contato" className="text-sm text-gray-500 hover:text-gray-900">
            Contato
          </Link>
        </div>
      </div>
    </footer>
  );
};