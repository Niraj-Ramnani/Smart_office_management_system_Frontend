import { Outlet, Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LogoutButton } from '../components/auth/LogoutButton'
import type { RootState } from '../store/store'
import logo from '../assets/logo.png'

export const MainLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const isManagerOrAdmin = user?.role === 'Admin' || user?.role === 'Manager'
  const isAdmin = user?.role === 'Admin'

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-700 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-lg text-slate-800 tracking-tight flex items-center gap-2.5">
            <img src={logo} alt="ITT DeskFlow Logo" className="h-8 w-auto object-contain" />
            {/* <span>ITT DeskFlow</span> */}
          </Link>
      
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
        <aside className="w-60 bg-white border-r border-slate-200 p-4 hidden md:block">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Main</p>
          <ul className="space-y-1 mb-6">
            <li>
              <NavLink to="/" end className={navItemClass}>
                Overview
              </NavLink>
            </li>
          </ul>

          {isManagerOrAdmin && (
            <>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Organization</p>
              <ul className="space-y-1 mb-6">
                <li>
                  <NavLink to="/buildings" className={navItemClass}>
                    Buildings
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/floors" className={navItemClass}>
                    Floors
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/teams" className={navItemClass}>
                    Teams
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/employees" className={navItemClass}>
                    Employees
                  </NavLink>
                </li>
              </ul>
            </>
          )}

          {isAdmin && (
            <>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Administration</p>
              <ul className="space-y-1">
                <li>
                  <NavLink to="/users" className={navItemClass}>
                    Users & Roles
                  </NavLink>
                </li>
              </ul>
            </>
          )}
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
