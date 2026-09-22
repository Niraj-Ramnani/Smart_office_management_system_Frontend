import { Outlet, Link } from 'react-router-dom'

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="font-semibold text-lg">Smart Office</h1>
        <nav className="flex gap-4 text-sm">
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </nav>
      </header>

      <div className="flex flex-1">
        <aside className="w-48 border-r p-4 hidden md:block">
          <p className="text-xs text-gray-500 uppercase">Sidebar</p>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
