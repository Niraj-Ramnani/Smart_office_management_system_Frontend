import { Outlet, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LogoutButton } from '../components/auth/LogoutButton'
import type { RootState } from '../store/store'

export const MainLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-lg text-slate-800 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
            Smart Office
          </Link>
          <nav className="flex gap-4 text-sm font-medium">
            <Link to="/" className="text-slate-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right text-xs">
                <p className="font-medium text-slate-800">{user.email}</p>
                <span className="inline-block px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {user.role}
                </span>
              </div>
              <LogoutButton />
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 px-3 py-1.5 rounded-md hover:bg-blue-50"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-56 bg-white border-r border-slate-200 p-4 hidden md:block">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Navigation</p>
          <ul className="space-y-1 text-sm font-medium text-slate-600">
            <li>
              <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold">
                Overview
              </Link>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
