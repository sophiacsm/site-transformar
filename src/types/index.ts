export const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro'
];

export interface Receita {
  id?: number;
  mes: string;
  apadrinhamento: number;
  tvne: number;
  doacao_eu: number;
  troco_solidario: number;
  eventos: number;
  chico_rei: number;
  total: number;
}

export interface Despesa {
  id?: number;
  mes: string;
  tarifas_bancarias: number;
  tarifas_plataformas: number;
  impostos_rf: number;
  anuidade_plataformas: number;
  salarios: number;
  site: number;
  marketing: number;
  eventos: number;
  certificado_digital: number;
  medicina_trabalho: number;
  contabilidade: number;
  celular_claro: number;
  manutencoes: number;
  cartorio: number;
  total: number;
}

export interface Resultado {
  id?: number;
  mes: string;
  receitas: number;
  despesas: number;
  resultado_op: number;
  bolsas: number;
  resultado_final: number;
  soma_bolsas: number;
  fornecedores: number;
  contas_a_pagar: number;
}

export interface Caixa {
  id?: number;
  mes: string;
  saldo_inicial: number;
  saldo_final: number;
}

export interface Previsao {
  id?: number;
  tipo: 'despesa' | 'receita';
  categoria: string;
  prevista: number;
  realizada: number;
}

export interface InvestimentoMeta {
  id?: number;
  tipo: 'acao' | 'previsao_receita' | 'previsao_despesa';
  categoria: string;
  previsao?: number | null;
  acao_meta?: string | null;
  meta?: number | null;
  arrecadacao_total?: number | null;
  realizado?: number | null;
  alcance_meta?: string | null;
  detalhamento_meta?: string | null;
}

export type AuthUser = {
  id: string;
  email: string;
};