import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, PlusCircle, Wallet, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Layout() {
  const location = useLocation()

  return (
    <main className="flex flex-col min-h-[100dvh] bg-gray-50 sm:items-center">
      <div className="w-full max-w-md bg-white min-h-[100dvh] relative shadow-2xl flex flex-col mx-auto overflow-hidden pb-16">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>

        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 px-4 z-10">
          <Link
            to="/"
            className={cn(
              'flex flex-col items-center gap-1 text-xs transition-colors',
              location.pathname === '/'
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Home className="w-5 h-5" />
            Início
          </Link>
          <Link
            to="/registrar-servico"
            className={cn(
              'flex flex-col items-center gap-1 text-xs transition-colors',
              location.pathname === '/registrar-servico'
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <PlusCircle className="w-5 h-5" />
            Novo
          </Link>
          <Link
            to="/balanco"
            className={cn(
              'flex flex-col items-center gap-1 text-xs transition-colors',
              location.pathname === '/balanco'
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Wallet className="w-5 h-5" />
            Balanço
          </Link>
          <Link
            to="/historico-clientes"
            className={cn(
              'flex flex-col items-center gap-1 text-xs transition-colors',
              location.pathname === '/historico-clientes'
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Users className="w-5 h-5" />
            Histórico
          </Link>
        </nav>
      </div>
    </main>
  )
}
