import { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, Plus, Sparkles, X, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Client } from '@/types'
import { ClientCard } from '@/components/ClientCard'
import { ClientFormModal } from '@/components/ClientFormModal'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import { getClientes, createCliente, updateCliente, deleteCliente } from '@/services/clientes'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/hooks/use-auth'

export default function Index() {
  const { user, signOut } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const data = await getClientes()
      setClients(data as unknown as Client[])
    } catch (error) {
      toast.error('Erro ao carregar clientes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('clientes', () => {
    loadData()
  })

  const filteredClients = useMemo(() => {
    if (!search) return clients
    const lower = search.toLowerCase()
    return clients.filter((c) => c.nome.toLowerCase().includes(lower) || c.telefone.includes(lower))
  }, [clients, search])

  const handleSaveClient = async (data: Omit<Client, 'id' | 'usuario_id'>) => {
    try {
      if (clientToEdit) {
        await updateCliente(clientToEdit.id, data)
        toast.success('Cliente atualizada com sucesso!')
      } else {
        await createCliente({ ...data, usuario_id: user?.id })
        toast.success('Cliente adicionada com sucesso!')
      }
      setIsFormOpen(false)
      setClientToEdit(null)
    } catch (error) {
      toast.error('Erro ao salvar cliente')
    }
  }

  const confirmDelete = async () => {
    if (clientToDelete) {
      try {
        setIsDeleting(true)
        await deleteCliente(clientToDelete.id)
        toast.success('Cliente removida com sucesso!')
        setIsDeleteOpen(false)
        setClientToDelete(null)
      } catch (error) {
        toast.error('Erro ao remover cliente')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const openAdd = () => {
    setClientToEdit(null)
    setIsFormOpen(true)
  }

  const openEdit = (client: Client) => {
    setClientToEdit(client)
    setIsFormOpen(true)
  }

  const openDelete = (client: Client) => {
    setClientToDelete(client)
    setIsDeleteOpen(true)
  }

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-5 py-4 flex flex-col gap-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Minhas Clientes</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={openAdd}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold shadow-sm h-9 px-3"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Novo Registro
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="text-gray-400 hover:text-red-500 h-9 w-9"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Buscar por nome ou telefone..."
            className="pl-10 pr-10 h-12 bg-gray-50 border-transparent focus:bg-white rounded-xl text-base shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-5 pb-6 relative">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center h-[88px] animate-pulse"
              >
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-32 bg-gray-100" />
                  <Skeleton className="h-4 w-24 bg-gray-100" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-10 rounded-xl bg-gray-100" />
                  <Skeleton className="h-10 w-10 rounded-xl bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredClients.length > 0 ? (
          <div className="flex flex-col">
            {filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} onEdit={openEdit} onDelete={openDelete} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in h-full">
            <div className="bg-primary/10 p-5 rounded-full mb-5">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {search ? 'Nenhuma cliente encontrada' : 'Lista vazia'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-[260px] leading-relaxed">
              {search
                ? 'Tente buscar com outros termos.'
                : 'Comece adicionando sua primeira cliente para gerenciar sua agenda.'}
            </p>
            {!search && (
              <Button
                onClick={openAdd}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 font-semibold shadow-lg shadow-primary/20"
              >
                Adicionar cliente
              </Button>
            )}
          </div>
        )}
      </main>

      <ClientFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveClient}
        client={clientToEdit}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        client={clientToDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}
