import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Users, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { getClientes, ClienteRecord } from '@/services/clientes'
import { Skeleton } from '@/components/ui/skeleton'

export default function NewService() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedClient = searchParams.get('cliente')

  const [clientes, setClientes] = useState<ClienteRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [clienteId, setClienteId] = useState(preselectedClient || '')
  const [tipo, setTipo] = useState('')
  const [valor, setValor] = useState('')
  const [dataHora, setDataHora] = useState(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  })

  const loadClientes = async () => {
    try {
      setLoading(true)
      setError(false)
      const data = await getClientes()
      setClientes(data)
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClientes()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clienteId || !tipo || !valor || !dataHora) return

    // Mock save behavior
    toast.success('Serviço registrado com sucesso')
    setClienteId('')
    setTipo('')
    setValor('')
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    setDataHora(now.toISOString().slice(0, 16))
  }

  const isFormValid = clienteId && tipo && valor && dataHora

  return (
    <div className="flex flex-col h-full animate-fade-in pb-16">
      <header className="px-4 py-4 bg-white/80 backdrop-blur-md flex items-center gap-3 sticky top-0 z-10 border-b border-gray-100/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full -ml-2 text-gray-600 hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Registrar Serviço</h1>
      </header>

      <main className="flex-1 p-5 overflow-y-auto">
        {loading ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Ops, algo deu errado</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Não foi possível carregar suas clientes. Verifique sua conexão.
            </p>
            <Button onClick={loadClientes} variant="outline" className="rounded-xl h-11 px-6">
              Tentar novamente
            </Button>
          </div>
        ) : clientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Nenhuma cliente</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Nenhuma cliente cadastrada. Adicione uma cliente primeiro.
            </p>
            <Button onClick={() => navigate('/')} className="rounded-xl h-11 px-6">
              Ir para Início
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-700 text-sm font-medium ml-1">Cliente</Label>
              <Select value={clienteId} onValueChange={setClienteId}>
                <SelectTrigger className="h-14 rounded-2xl bg-white border-gray-200 text-base shadow-sm px-4 focus:ring-primary/20 transition-all">
                  <SelectValue placeholder="Selecione a cliente" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-xl max-h-[250px]">
                  {clientes.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={c.id || ''}
                      className="text-base py-3 cursor-pointer"
                    >
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 text-sm font-medium ml-1">Tipo de Serviço</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger className="h-14 rounded-2xl bg-white border-gray-200 text-base shadow-sm px-4 focus:ring-primary/20 transition-all">
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                  <SelectItem value="Unhas" className="text-base py-3 cursor-pointer">
                    Unhas
                  </SelectItem>
                  <SelectItem value="Sobrancelha" className="text-base py-3 cursor-pointer">
                    Sobrancelha
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 text-sm font-medium ml-1">Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 50,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="h-14 rounded-2xl bg-white border-gray-200 text-base shadow-sm px-4 focus-visible:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 text-sm font-medium ml-1">Data e Hora</Label>
              <Input
                type="datetime-local"
                value={dataHora}
                onChange={(e) => setDataHora(e.target.value)}
                className="h-14 rounded-2xl bg-white border-gray-200 text-base shadow-sm px-4 w-full flex focus-visible:ring-primary/20 transition-all"
              />
            </div>

            <div className="pt-6 mt-4">
              <Button
                type="submit"
                disabled={!isFormValid}
                className="w-full h-14 rounded-2xl text-base font-medium shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
              >
                Registrar serviço
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
