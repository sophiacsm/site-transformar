import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Button } from '../components/ui/Button';
import { BarChart2, TrendingUp, Shield, ExternalLink } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-[#e44d52] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block">Portal de Transparência</span>
              <span className="block text-[#f9c738]">Financeira</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-200 sm:max-w-3xl">
              Acompanhe em tempo real a gestão financeira do nosso projeto social,
              com total transparência sobre a origem e o destino de cada recurso.
            </p>
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
              <div className="space-y-4 sm:space-y-0 sm:mx-auto text-[#25a3c5] sm:inline-grid sm:grid-cols-2 sm:gap-5">
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-8 py-3 text-[#25a3c5] bg-[#25a3c5] hover:bg-[#25a3c5]"
                    rightIcon={<ExternalLink className="h-5 w-5" />}
                  >
                    Ver Dados
                  </Button>
                </Link>
                <Link to="/sobre">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-8 py-3 border-white text-white hover:bg-[#25a3c5]"
                  >
                    Saiba Mais
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-[#25a3c5] font-semibold tracking-wide uppercase">Transparência</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Compromisso com a clareza financeira
            </p>
            <p className="mt-4 max-w-2xl text-xl text-[#9e9da2] lg:mx-auto">
              Acompanhe todos os detalhes sobre nossas receitas, despesas e investimentos
              em um formato claro e acessível.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#25a3c5] text-white mb-5">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Receitas e Despesas</h3>
                <p className="text-base text-[#9e9da2]">
                  Visualize todas as entradas e saídas financeiras, categorizadas e organizadas por mês.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#f9c738] text-white mb-5">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Análises Gráficas</h3>
                <p className="text-base text-[#9e9da2]">
                  Compreenda os dados facilmente através de gráficos interativos e visualizações claras.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#e44d52] text-white mb-5">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Prestação de Contas</h3>
                <p className="text-base text-[#9e9da2]">
                  Acesso completo aos dados financeiros, demonstrando o compromisso com a 
                  transparência e integridade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#25a3c5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#e44d52] rounded-2xl shadow-xl overflow-hidden">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center lg:max-w-3xl">
                <h2 className="text-3xl font-extrabold text-[#f9c738] sm:text-4xl">
                  <span className="block">Quer conhecer mais?</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-gray-200">
                  Acesse agora mesmo o painel de transparência financeira e veja como os recursos estão sendo utilizados
                  para transformar vidas.
                </p>
                <Link 
                  to="/dashboard" 
                  className="mt-8 bg-white border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium text-[#e44d52] hover:bg-gray-100"
                >
                  Acessar o painel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};