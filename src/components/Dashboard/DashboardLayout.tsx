import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from '../Layout/Layout';
import { Sidebar } from './Sidebar';

export const DashboardLayout: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </Layout>
  );
};