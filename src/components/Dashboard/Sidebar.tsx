import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  DollarSign, 
  BarChart, 
  Target, 
  FileSpreadsheet, 
  Home 
} from 'lucide-react';

const menuItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <Home size={20} />
  },
  {
    name: 'Cadastrar Receitas',
    path: '/dashboard/receitas',
    icon: <TrendingUp size={20} />
  },
  {
    name: 'Cadastrar Despesas',
    path: '/dashboard/despesas',
    icon: <TrendingDown size={20} />
  },
  {
    name: 'Cadastrar Resultados',
    path: '/dashboard/resultados',
    icon: <PieChart size={20} />
  },
  {
    name: 'Cadastrar Caixa',
    path: '/dashboard/caixa',
    icon: <DollarSign size={20} />
  },
  {
    name: 'Cadastrar Previsão',
    path: '/dashboard/previsao',
    icon: <BarChart size={20} />
  },
  {
    name: 'Cadastrar Investimentos',
    path: '/dashboard/investimentos',
    icon: <Target size={20} />
  },
  {
    name: 'Exportar Dados',
    path: '/dashboard/exportar',
    icon: <FileSpreadsheet size={20} />
  }
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <aside className="bg-white shadow-md rounded-lg overflow-hidden">
      <nav className="flex flex-col p-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Painel de Controle</h2>
          <p className="text-sm text-gray-500">Gerencie seus dados financeiros</p>
        </div>
        
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-4 py-3 rounded-md transition-colors
                  ${isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <span className={`mr-3 ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};