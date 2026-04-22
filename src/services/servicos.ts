import pb from '@/lib/pocketbase/client'
import { Client } from '@/types'

export interface ServicoRecord {
  id: string
  usuario_id: string
  cliente_id: string
  tipo_servico: string
  valor: number
  data_servico: string
  created: string
  updated: string
  expand?: {
    cliente_id: Client
  }
}

export const createServico = (data: {
  usuario_id: string
  cliente_id: string
  tipo_servico: string
  valor: number
  data_servico: string
}) => {
  return pb.collection('servicos').create<ServicoRecord>(data)
}

export const getServicos = () => {
  return pb.collection('servicos').getFullList<ServicoRecord>({
    sort: '-data_servico',
    expand: 'cliente_id',
  })
}

export const getServicosByDateRange = (startDate: string, endDate: string) => {
  return pb.collection('servicos').getFullList<ServicoRecord>({
    filter: `data_servico >= '${startDate}' && data_servico <= '${endDate}'`,
    sort: '-data_servico',
    expand: 'cliente_id',
  })
}
