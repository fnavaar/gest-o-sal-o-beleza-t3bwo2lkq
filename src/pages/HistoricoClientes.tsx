import { useState, useEffect, useMemo } from 'react'
import {
  Search,
  Star,
  MessageSquare,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
} from 'lucide-react'
import { getClientes, type ClienteRecord } from '@/services/clientes'
import { getServicos, type ServicoRecord } from '@/services/servicos'
import { formatCurrency, formatDate, formatPhone } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ClientStats {
  client: ClienteRecord
  totalSpent: number
  totalProfit: number
  lastVisit: string | null
  firstVisit: string | null
  servicesCount: number
  services: ServicoRecord[]
  mostFrequentService: string
}

const calcProfit = (s: ServicoRecord) => s.valor * (s.tipo_servico === 'Unhas' ? 0.6 : 0.5)

export default function HistoricoClientes() {
  const [clientes, setClientes] = useState<ClienteRecord[]>([])
  const [servicos, setServicos] = useState<ServicoRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'spent' | 'last_visit'>('last_visit')
  const [selectedClient, setSelectedClient] = useState<ClientStats | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [cRes, sRes] = await Promise.all([getClientes(), getServicos()])
      setClientes(cRes)
      setServicos(sRes)
    } catch (err) {
      setError('Erro ao carregar os dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const clientStats = useMemo(() => {
    const statsMap = new Map<string, ClientStats>()
    clientes.forEach((c) => {
      statsMap.set(c.id!, {
        client: c,
        totalSpent: 0,
        totalProfit: 0,
        lastVisit: null,
        firstVisit: null,
        servicesCount: 0,
        services: [],
        mostFrequentService: '-',
      })
    })

    servicos.forEach((s) => {
      const stats = statsMap.get(s.cliente_id)
      if (stats) {
        stats.services.push(s)
        stats.servicesCount++
        stats.totalSpent += s.valor
        stats.totalProfit += calcProfit(s)
        if (!stats.lastVisit || new Date(s.data_servico) > new Date(stats.lastVisit)) {
          stats.lastVisit = s.data_servico
        }
        if (!stats.firstVisit || new Date(s.data_servico) < new Date(stats.firstVisit)) {
          stats.firstVisit = s.data_servico
        }
      }
    })

    statsMap.forEach((stats) => {
      let unhas = 0,
        sobrancelha = 0
      stats.services.forEach((s) => (s.tipo_servico === 'Unhas' ? unhas++ : sobrancelha++))
      if (unhas > sobrancelha) stats.mostFrequentService = 'Unhas'
      else if (sobrancelha > unhas) stats.mostFrequentService = 'Sobrancelha'
      else if (stats.servicesCount > 0) stats.mostFrequentService = 'Ambos'
      stats.services.sort(
        (a, b) => new Date(b.data_servico).getTime() - new Date(a.data_servico).getTime(),
      )
    })

    return Array.from(statsMap.values())
  }, [clientes, servicos])

  const filteredAndSorted = useMemo(() => {
    let result = clientStats.filter((cs) => {
      if (onlyFavorites && !cs.client.eh_preferencia) return false
      if (search && !cs.client.nome.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })

    result.sort((a, b) => {
      if (sortBy === 'name') return a.client.nome.localeCompare(b.client.nome)
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent
      const dateA = a.lastVisit ? new Date(a.lastVisit).getTime() : 0
      const dateB = b.lastVisit ? new Date(b.lastVisit).getTime() : 0
      return dateB - dateA
    })
    return result
  }, [clientStats, search, onlyFavorites, sortBy])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 space-y-4 text-center">
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={fetchData}>Tentar Novamente</Button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Histórico de Clientes</h1>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="favs" checked={onlyFavorites} onCheckedChange={setOnlyFavorites} />
            <Label htmlFor="favs" className="text-sm">
              Preferências
            </Label>
          </div>
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_visit">Última Visita</SelectItem>
              <SelectItem value="spent">Mais Gastos</SelectItem>
              <SelectItem value="name">Nome (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : filteredAndSorted.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Nenhuma cliente encontrada.</div>
        ) : (
          filteredAndSorted.map((cs) => (
            <Card
              key={cs.client.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSelectedClient(cs)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{cs.client.nome}</h3>
                    {cs.client.eh_preferencia && (
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{formatPhone(cs.client.telefone)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Última: {formatDate(cs.lastVisit || '')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">{formatCurrency(cs.totalSpent)}</p>
                  <p className="text-xs text-green-600 font-medium">
                    Lucro: {formatCurrency(cs.totalProfit)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{cs.servicesCount} serviços</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Sheet open={!!selectedClient} onOpenChange={(o) => !o && setSelectedClient(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto pb-10" side="right">
          {selectedClient && (
            <>
              <SheetHeader className="text-left space-y-1">
                <div className="flex items-center gap-2">
                  <SheetTitle className="text-xl">{selectedClient.client.nome}</SheetTitle>
                  {selectedClient.client.eh_preferencia && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    >
                      VIP
                    </Badge>
                  )}
                </div>
                <SheetDescription>{formatPhone(selectedClient.client.telefone)}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                  <a
                    href={`https://wa.me/55${selectedClient.client.telefone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chamar no WhatsApp
                  </a>
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Card className="bg-primary/5 border-none shadow-sm">
                    <CardContent className="p-4">
                      <DollarSign className="w-5 h-5 text-primary mb-1" />
                      <p className="text-sm text-muted-foreground">Total Gasto</p>
                      <p className="text-lg font-bold">
                        {formatCurrency(selectedClient.totalSpent)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-none shadow-sm">
                    <CardContent className="p-4">
                      <TrendingUp className="w-5 h-5 text-green-600 mb-1" />
                      <p className="text-sm text-green-700">Lucro Estimado</p>
                      <p className="text-lg font-bold text-green-700">
                        {formatCurrency(selectedClient.totalProfit)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted border-none shadow-sm">
                    <CardContent className="p-4">
                      <Activity className="w-5 h-5 text-muted-foreground mb-1" />
                      <p className="text-sm text-muted-foreground">Serviço Favorito</p>
                      <p className="text-lg font-bold">{selectedClient.mostFrequentService}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted border-none shadow-sm">
                    <CardContent className="p-4">
                      <Calendar className="w-5 h-5 text-muted-foreground mb-1" />
                      <p className="text-sm text-muted-foreground">Cliente desde</p>
                      <p className="text-lg font-bold">
                        {formatDate(selectedClient.firstVisit || '')}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-lg">Todos os Serviços</h3>
                  {selectedClient.services.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum serviço registrado.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedClient.services.map((s) => (
                        <div
                          key={s.id}
                          className="flex justify-between items-center p-3 rounded-lg border bg-card"
                        >
                          <div>
                            <p className="font-medium text-sm">{s.tipo_servico}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(s.data_servico)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatCurrency(s.valor)}</p>
                            <p className="text-xs text-green-600 font-medium">
                              +{formatCurrency(calcProfit(s))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
