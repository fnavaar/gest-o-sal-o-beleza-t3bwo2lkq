import pb from '@/lib/pocketbase/client'

export interface ServicoRecord {
  id: string
  usuario_id: string
  cliente_id: string
  tipo_servico: string
  valor: number
  data_servico: string
  created: string
  updated: string
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
