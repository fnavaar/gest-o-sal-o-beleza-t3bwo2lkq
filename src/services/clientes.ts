import pb from '@/lib/pocketbase/client'

export interface ClienteRecord {
  id?: string
  nome: string
  telefone: string
  eh_preferencia: boolean
  usuario_id: string
  created?: string
  updated?: string
}

export const getClientes = () =>
  pb.collection('clientes').getFullList<ClienteRecord>({ sort: '-created' })
export const createCliente = (data: Omit<ClienteRecord, 'id' | 'created' | 'updated'>) =>
  pb.collection('clientes').create<ClienteRecord>(data)
export const updateCliente = (id: string, data: Partial<ClienteRecord>) =>
  pb.collection('clientes').update<ClienteRecord>(id, data)
export const deleteCliente = (id: string) => pb.collection('clientes').delete(id)
