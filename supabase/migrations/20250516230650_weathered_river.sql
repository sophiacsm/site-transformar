/*
  # Create financial transparency portal tables

  1. New Tables
    - `receitas` - Tracks monthly income sources
    - `despesas` - Tracks monthly expenses
    - `resultados` - Tracks monthly financial results
    - `caixa` - Tracks monthly cash balances
    - `previsao` - Tracks forecasted vs. actual financial data
    - `investimentos_metas` - Tracks investments, goals and metrics
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their data
*/

-- Create receitas (income) table
CREATE TABLE IF NOT EXISTS receitas (
  id BIGSERIAL PRIMARY KEY,
  mes TEXT NOT NULL,
  apadrinhamento DECIMAL NOT NULL DEFAULT 0,
  tvne DECIMAL NOT NULL DEFAULT 0,
  doacao_eu DECIMAL NOT NULL DEFAULT 0,
  troco_solidario DECIMAL NOT NULL DEFAULT 0,
  eventos DECIMAL NOT NULL DEFAULT 0,
  chico_rei DECIMAL NOT NULL DEFAULT 0,
  total DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(mes)
);

-- Create despesas (expenses) table
CREATE TABLE IF NOT EXISTS despesas (
  id BIGSERIAL PRIMARY KEY,
  mes TEXT NOT NULL,
  tarifas_bancarias DECIMAL NOT NULL DEFAULT 0,
  tarifas_plataformas DECIMAL NOT NULL DEFAULT 0,
  impostos_rf DECIMAL NOT NULL DEFAULT 0,
  anuidade_plataformas DECIMAL NOT NULL DEFAULT 0,
  salarios DECIMAL NOT NULL DEFAULT 0,
  site DECIMAL NOT NULL DEFAULT 0,
  marketing DECIMAL NOT NULL DEFAULT 0,
  eventos DECIMAL NOT NULL DEFAULT 0,
  certificado_digital DECIMAL NOT NULL DEFAULT 0,
  medicina_trabalho DECIMAL NOT NULL DEFAULT 0,
  contabilidade DECIMAL NOT NULL DEFAULT 0,
  celular_claro DECIMAL NOT NULL DEFAULT 0,
  manutencoes DECIMAL NOT NULL DEFAULT 0,
  cartorio DECIMAL NOT NULL DEFAULT 0,
  total DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(mes)
);

-- Create resultados (results) table
CREATE TABLE IF NOT EXISTS resultados (
  id BIGSERIAL PRIMARY KEY,
  mes TEXT NOT NULL,
  receitas DECIMAL NOT NULL DEFAULT 0,
  despesas DECIMAL NOT NULL DEFAULT 0,
  resultado_op DECIMAL NOT NULL DEFAULT 0,
  bolsas DECIMAL NOT NULL DEFAULT 0,
  resultado_final DECIMAL NOT NULL DEFAULT 0,
  soma_bolsas DECIMAL NOT NULL DEFAULT 0,
  fornecedores DECIMAL NOT NULL DEFAULT 0,
  contas_a_pagar DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(mes)
);

-- Create caixa (cash) table
CREATE TABLE IF NOT EXISTS caixa (
  id BIGSERIAL PRIMARY KEY,
  mes TEXT NOT NULL,
  saldo_inicial DECIMAL NOT NULL DEFAULT 0,
  saldo_final DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(mes)
);

-- Create previsao (forecast) table
CREATE TABLE IF NOT EXISTS previsao (
  id BIGSERIAL PRIMARY KEY,
  tipo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  prevista DECIMAL NOT NULL DEFAULT 0,
  realizada DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create investimentos_metas (investments and goals) table
CREATE TABLE IF NOT EXISTS investimentos_metas (
  id BIGSERIAL PRIMARY KEY,
  tipo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  previsao DECIMAL NULL,
  acao_meta TEXT NULL,
  meta DECIMAL NULL,
  arrecadacao_total DECIMAL NULL,
  realizado DECIMAL NULL,
  alcance_meta TEXT NULL,
  detalhamento_meta TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE resultados ENABLE ROW LEVEL SECURITY;
ALTER TABLE caixa ENABLE ROW LEVEL SECURITY;
ALTER TABLE previsao ENABLE ROW LEVEL SECURITY;
ALTER TABLE investimentos_metas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Authenticated users can read receitas" 
  ON receitas FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can insert receitas" 
  ON receitas FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update receitas" 
  ON receitas FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can read despesas" 
  ON despesas FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can insert despesas" 
  ON despesas FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update despesas" 
  ON despesas FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can read resultados" 
  ON resultados FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can insert resultados" 
  ON resultados FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update resultados" 
  ON resultados FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can read caixa" 
  ON caixa FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can insert caixa" 
  ON caixa FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update caixa" 
  ON caixa FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can read previsao" 
  ON previsao FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can insert previsao" 
  ON previsao FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update previsao" 
  ON previsao FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can delete previsao" 
  ON previsao FOR DELETE 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can read investimentos_metas" 
  ON investimentos_metas FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can insert investimentos_metas" 
  ON investimentos_metas FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update investimentos_metas" 
  ON investimentos_metas FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can delete investimentos_metas" 
  ON investimentos_metas FOR DELETE 
  TO authenticated 
  USING (true);

-- Create public access policies for read-only access to limited data
CREATE POLICY "Public users can read receitas" 
  ON receitas FOR SELECT 
  TO anon 
  USING (true);

CREATE POLICY "Public users can read despesas" 
  ON despesas FOR SELECT 
  TO anon 
  USING (true);

CREATE POLICY "Public users can read resultados" 
  ON resultados FOR SELECT 
  TO anon 
  USING (true);

CREATE POLICY "Public users can read caixa" 
  ON caixa FOR SELECT 
  TO anon 
  USING (true);