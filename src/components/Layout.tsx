import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <main className="flex flex-col min-h-[100dvh] bg-gray-50 sm:items-center">
      <div className="w-full max-w-md bg-white min-h-[100dvh] relative shadow-2xl flex flex-col mx-auto overflow-hidden">
        <Outlet />
      </div>
    </main>
  )
}
