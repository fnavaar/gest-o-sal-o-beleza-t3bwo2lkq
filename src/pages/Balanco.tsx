import { useState, useEffect, useCallback } from 'react'
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format, parseISO, isSameWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Download, AlertCircle, RefreshCcw, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { getServicosByDateRange, ServicoRecord } from '@/services/servicos'
import { useRealtime } from '@/hooks/use-realtime'

export default function Balanco() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [services, setServices] = useState<ServicoRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }) // Sunday

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const startStr = weekStart.toISOString()
      const endStr = weekEnd.toISOString()
      const data = await getServicosByDateRange(startStr, endStr)
      setServices(data)
    } catch (err) {
      console.error('Failed to load services:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [weekStart, weekEnd])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('servicos', () => {
    loadData()
  })

  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1))
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1))
  const currentWeek = () => setCurrentDate(new Date())

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const calculateEarnings = (service: ServicoRecord) => {
    if (service.tipo_servico === 'Unhas') return service.valor * 0.6
    if (service.tipo_servico === 'Sobrancelha') return service.valor * 0.5
    return 0
  }

  const totalFaturado = services.reduce((acc, curr) => acc + curr.valor, 0)

  const nailsEarnings = services
    .filter((s) => s.tipo_servico === 'Unhas')
    .reduce((acc, curr) => acc + calculateEarnings(curr), 0)

  const eyebrowEarnings = services
    .filter((s) => s.tipo_servico === 'Sobrancelha')
    .reduce((acc, curr) => acc + calculateEarnings(curr), 0)

  const totalGanho = nailsEarnings + eyebrowEarnings
  const quantidadeServicos = services.length

  const handleExport = () => {
    const headers = ['Data', 'Cliente', 'Tipo', 'Valor do Serviço', 'Valor Ganho']
    const rows = services.map((s) => [
      format(parseISO(s.data_servico), 'dd/MM/yyyy HH:mm'),
      s.expand?.cliente_id?.nome || 'Desconhecido',
      s.tipo_servico,
      s.valor.toFixed(2).replace('.', ','),
      calculateEarnings(s).toFixed(2).replace('.', ','),
    ])

    const csvContent = [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }) // BOM for Excel
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `balanco_semanal_${format(weekStart, 'yyyy-MM-dd')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col w-full h-full bg-gray-50/50">
      <div className="p-4 bg-white border-b sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Balanço Semanal</h1>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-6">
        {/* Navigation Controls */}
        <div className="flex items-center justify-between bg-white p-2 rounded-xl shadow-sm border">
          <Button variant="ghost" size="icon" onClick={prevWeek} className="h-10 w-10">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <div className="text-center flex flex-col items-center justify-center">
            <span className="text-sm font-semibold text-gray-800">
              {format(weekStart, 'dd MMM', { locale: ptBR })} -{' '}
              {format(weekEnd, 'dd MMM', { locale: ptBR })}
            </span>
            {!isSameWeek(currentDate, new Date(), { weekStartsOn: 1 }) && (
              <button
                onClick={currentWeek}
                className="text-[11px] font-medium text-primary hover:underline mt-0.5"
              >
                Voltar para atual
              </button>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={nextWeek} className="h-10 w-10">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </Button>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-red-500 gap-4 bg-white rounded-xl shadow-sm border p-6">
            <AlertCircle className="w-10 h-10 opacity-80" />
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Erro ao carregar dados</h3>
              <p className="text-sm text-gray-500 mt-1">
                Não foi possível buscar o balanço da semana.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={loadData}
              className="mt-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        ) : loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-[104px] w-full rounded-xl col-span-2" />
              <Skeleton className="h-[104px] w-full rounded-xl col-span-2 sm:col-span-1" />
              <Skeleton className="h-[104px] w-full rounded-xl col-span-2 sm:col-span-1" />
              <Skeleton className="h-[90px] w-full rounded-xl" />
              <Skeleton className="h-[90px] w-full rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="col-span-2 bg-primary text-primary-foreground border-transparent shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Total Faturado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tracking-tight">
                    {formatCurrency(totalFaturado)}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2 sm:col-span-1 shadow-sm border-gray-200/60">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                    Total Ganho
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(totalGanho)}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2 sm:col-span-1 shadow-sm border-gray-200/60">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                    Qtd de Serviços
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-2xl font-bold text-gray-800">{quantidadeServicos}</div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-gray-200/60">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Unhas (60%)
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-xl font-bold text-gray-800">
                    {formatCurrency(nailsEarnings)}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-gray-200/60">
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Sobrancelha (50%)
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-xl font-bold text-gray-800">
                    {formatCurrency(eyebrowEarnings)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Details Table */}
            <Card className="flex flex-col overflow-hidden shadow-sm border-gray-200/60">
              <CardHeader className="flex flex-row items-center justify-between py-4 bg-gray-50/50">
                <CardTitle className="text-[15px] font-semibold text-gray-800">
                  Serviços da Semana
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={services.length === 0}
                  className="h-8 text-xs font-medium bg-white"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Exportar
                </Button>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                {services.length === 0 ? (
                  <div className="py-12 px-4 text-center text-gray-500 text-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Wallet className="w-6 h-6 text-gray-400" />
                    </div>
                    Nenhum dado encontrado para este período.
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-gray-50/80">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="whitespace-nowrap text-xs">Data</TableHead>
                        <TableHead className="whitespace-nowrap text-xs">Cliente</TableHead>
                        <TableHead className="whitespace-nowrap text-xs">Tipo</TableHead>
                        <TableHead className="whitespace-nowrap text-xs text-right">
                          Valor
                        </TableHead>
                        <TableHead className="whitespace-nowrap text-xs text-right text-emerald-600 font-semibold">
                          Ganho
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow
                          key={service.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell className="whitespace-nowrap text-[13px] text-gray-500">
                            {format(parseISO(service.data_servico), 'dd/MM/yy', { locale: ptBR })}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-[13px] font-medium text-gray-800">
                            {service.expand?.cliente_id?.nome || '—'}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-[13px] text-gray-500">
                            {service.tipo_servico}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-right text-[13px] text-gray-600">
                            {formatCurrency(service.valor)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-right text-[13px] font-semibold text-emerald-600 bg-emerald-50/30">
                            {formatCurrency(calculateEarnings(service))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
