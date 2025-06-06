export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      receitas: {
        Row: {
          id: number
          mes: string
          apadrinhamento: number
          tvne: number
          doacao_eu: number
          troco_solidario: number
          eventos: number
          chico_rei: number
          total: number
          created_at: string
        }
        Insert: {
          id?: number
          mes: string
          apadrinhamento: number
          tvne: number
          doacao_eu: number
          troco_solidario: number
          eventos: number
          chico_rei: number
          total: number
          created_at?: string
        }
        Update: {
          id?: number
          mes?: string
          apadrinhamento?: number
          tvne?: number
          doacao_eu?: number
          troco_solidario?: number
          eventos?: number
          chico_rei?: number
          total?: number
          created_at?: string
        }
      }
      despesas: {
        Row: {
          id: number
          mes: string
          tarifas_bancarias: number
          tarifas_plataformas: number
          impostos_rf: number
          anuidade_plataformas: number
          salarios: number
          site: number
          marketing: number
          eventos: number
          certificado_digital: number
          medicina_trabalho: number
          contabilidade: number
          celular_claro: number
          manutencoes: number
          cartorio: number
          total: number
          created_at: string
        }
        Insert: {
          id?: number
          mes: string
          tarifas_bancarias: number
          tarifas_plataformas: number
          impostos_rf: number
          anuidade_plataformas: number
          salarios: number
          site: number
          marketing: number
          eventos: number
          certificado_digital: number
          medicina_trabalho: number
          contabilidade: number
          celular_claro: number
          manutencoes: number
          cartorio: number
          total: number
          created_at?: string
        }
        Update: {
          id?: number
          mes?: string
          tarifas_bancarias?: number
          tarifas_plataformas?: number
          impostos_rf?: number
          anuidade_plataformas?: number
          salarios?: number
          site?: number
          marketing?: number
          eventos?: number
          certificado_digital?: number
          medicina_trabalho?: number
          contabilidade?: number
          celular_claro?: number
          manutencoes?: number
          cartorio?: number
          total?: number
          created_at?: string
        }
      }
      resultados: {
        Row: {
          id: number
          mes: string
          receitas: number
          despesas: number
          resultado_op: number
          bolsas: number
          resultado_final: number
          soma_bolsas: number
          fornecedores: number
          contas_a_pagar: number
          created_at: string
        }
        Insert: {
          id?: number
          mes: string
          receitas: number
          despesas: number
          resultado_op: number
          bolsas: number
          resultado_final: number
          soma_bolsas: number
          fornecedores: number
          contas_a_pagar: number
          created_at?: string
        }
        Update: {
          id?: number
          mes?: string
          receitas?: number
          despesas?: number
          resultado_op?: number
          bolsas?: number
          resultado_final?: number
          soma_bolsas?: number
          fornecedores?: number
          contas_a_pagar?: number
          created_at?: string
        }
      }
      caixa: {
        Row: {
          id: number
          mes: string
          saldo_inicial: number
          saldo_final: number
          created_at: string
        }
        Insert: {
          id?: number
          mes: string
          saldo_inicial: number
          saldo_final: number
          created_at?: string
        }
        Update: {
          id?: number
          mes?: string
          saldo_inicial?: number
          saldo_final?: number
          created_at?: string
        }
      }
      previsao: {
        Row: {
          id: number
          tipo: 'despesa' | 'receita'
          categoria: string
          prevista: number
          realizada: number
          created_at: string
        }
        Insert: {
          id?: number
          tipo: 'despesa' | 'receita'
          categoria: string
          prevista: number
          realizada: number
          created_at?: string
        }
        Update: {
          id?: number
          tipo?: 'despesa' | 'receita'
          categoria?: string
          prevista?: number
          realizada?: number
          created_at?: string
        }
      }
      investimentos_metas: {
        Row: {
          id: number
          tipo: 'acao' | 'previsao_receita' | 'previsao_despesa'
          categoria: string
          previsao: number | null
          acao_meta: string | null
          meta: number | null
          arrecadacao_total: number | null
          realizado: number | null
          alcance_meta: string | null
          detalhamento_meta: string | null
          created_at: string
        }
        Insert: {
          id?: number
          tipo: 'acao' | 'previsao_receita' | 'previsao_despesa'
          categoria: string
          previsao?: number | null
          acao_meta?: string | null
          meta?: number | null
          arrecadacao_total?: number | null
          realizado?: number | null
          alcance_meta?: string | null
          detalhamento_meta?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          tipo?: 'acao' | 'previsao_receita' | 'previsao_despesa'
          categoria?: string
          previsao?: number | null
          acao_meta?: string | null
          meta?: number | null
          arrecadacao_total?: number | null
          realizado?: number | null
          alcance_meta?: string | null
          detalhamento_meta?: string | null
          created_at?: string
        }
      }
    }
  }
}