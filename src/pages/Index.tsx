import { useState, useEffect, useMemo } from 'react'
import { Search, Plus, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Client } from '@/types'
import { ClientCard } from '@/components/ClientCard'
import { ClientFormModal } from '@/components/ClientFormModal'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'

const INITIAL_CLIENTS: Client[] = [
  { id: '1', name: 'Mariana Silva', phone: '(11) 98765-4321', isPreference: true },
  { id: '2', name: 'Beatriz Oliveira', phone: '(21) 97654-3210', isPreference: false },
  { id: '3', name: 'Camila Santos', phone: '(31) 99988-7766', isPreference: true },
  { id: '4', name: 'Amanda Costa', phone: '(41) 98877-6655', isPreference: false },
]

export default function Index() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setClients(INITIAL_CLIENTS)
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredClients = useMemo(() => {
    if (!search) return clients
    const lower = search.toLowerCase()
    return clients.filter((c) => c.name.toLowerCase().includes(lower) || c.phone.includes(lower))
  }, [clients, search])

  const handleSaveClient = (data: Omit<Client, 'id'>) => {
    if (clientToEdit) {
      setClients((prev) => prev.map((c) => (c.id === clientToEdit.id ? { ...data, id: c.id } : c)))
      toast.success('Cliente atualizada com sucesso!')
    } else {
      const newClient = { ...data, id: Math.random().toString(36).substr(2, 9) }
      setClients((prev) => [newClient, ...prev])
      toast.success('Cliente adicionada com sucesso!')
    }
    setIsFormOpen(false)
    setClientToEdit(null)
  }

  const confirmDelete = () => {
    if (clientToDelete) {
      setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id))
      toast.success('Cliente removida com sucesso!')
    }
    setIsDeleteOpen(false)
    setClientToDelete(null)
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
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Minhas Clientes</h1>
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

      <main className="flex-1 overflow-y-auto p-5 pb-24 relative">
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

      <div className="absolute bottom-6 w-full flex justify-end px-6 pointer-events-none z-30">
        <Button
          className="h-14 w-14 rounded-full shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all pointer-events-auto flex items-center justify-center p-0"
          onClick={openAdd}
        >
          <Plus className="h-7 w-7 text-white" />
        </Button>
      </div>

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
      />
    </>
  )
}
