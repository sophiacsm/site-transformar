import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../components/Dashboard/DashboardLayout';
import { DashboardHomePage } from '../pages/Dashboard/DashboardHomePage';
import { ReceitasPage } from '../pages/Dashboard/ReceitasPage';
import { DespesasPage } from '../pages/Dashboard/DespesasPage';
import { ResultadosPage } from '../pages/Dashboard/ResultadosPage';
import { CaixaPage } from '../pages/Dashboard/CaixaPage';
import { PrevisaoPage } from '../pages/Dashboard/PrevisaoPage';
import { InvestimentosPage } from '../pages/Dashboard/InvestimentosPage';
import { ExportarPage } from '../pages/Dashboard/ExportarPage';
import { RelatoriosPage } from '../pages/RelatoriosPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/relatorios" element={<RelatoriosPage />} />
      
      {/* Protected dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHomePage />} />
        <Route path="receitas" element={<ReceitasPage />} />
        <Route path="despesas" element={<DespesasPage />} />
        <Route path="resultados" element={<ResultadosPage />} />
        <Route path="caixa" element={<CaixaPage />} />
        <Route path="previsao" element={<PrevisaoPage />} />
        <Route path="investimentos" element={<InvestimentosPage />} />
        <Route path="exportar" element={<ExportarPage />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};