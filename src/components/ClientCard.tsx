import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit2, Star, Trash2, PlusCircle } from 'lucide-react'
import { Client } from '@/types'
import { useNavigate } from 'react-router-dom'

interface ClientCardProps {
  client: Client
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
}

export function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  const navigate = useNavigate()

  return (
    <div className="p-4 mb-3 bg-white border border-gray-100 shadow-sm rounded-2xl flex flex-col animate-fade-in-up transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-800 text-lg leading-tight">{client.nome}</span>
            {client.eh_preferencia && (
              <Badge
                variant="secondary"
                className="bg-[#D4AF37]/15 text-[#b59325] hover:bg-[#D4AF37]/25 border-none px-2 py-0.5 h-5 text-[10px] uppercase tracking-wider font-bold"
              >
                <Star className="w-3 h-3 mr-1 fill-current" />
                Pref
              </Badge>
            )}
          </div>
          <span className="text-gray-500 text-sm font-medium">{client.telefone}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(client)}
            className="text-gray-400 hover:text-primary hover:bg-primary/10 h-10 w-10 rounded-xl"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(client)}
            className="text-gray-400 hover:text-destructive hover:bg-destructive/10 h-10 w-10 rounded-xl"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-50 flex">
        <Button
          variant="ghost"
          className="w-full text-primary hover:bg-primary/5 h-11 rounded-xl font-medium justify-center"
          onClick={() => navigate(`/registrar-servico?cliente=${client.id}`)}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Registrar serviço
        </Button>
      </div>
    </div>
  )
}
