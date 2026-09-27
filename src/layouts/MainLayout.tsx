import { Outlet, Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LogoutButton } from '../components/auth/LogoutButton'
import type { RootState } from '../store/store'
import logo from '../assets/logo.png'

export const MainLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const isManagerOrAdmin = user?.role === 'Admin' || user?.role === 'Manager'
  const isAdmin = user?.role === 'Admin'

  const getDisplayName = () => {
    if (user?.role === 'Admin') return 'InTimeTec Admin'
    if (!user?.email) return 'User'
    const local = user.email.split('@')[0]
    if (local.includes('smartoffice.employee')) return 'Smart Office Employee'
    if (local.includes('smartoffice.manager')) return 'Smart Office Manager'
    const words = local.replace(/[0-9]+/g, '').split(/[._-]/).filter(Boolean)
    if (words.length > 0) {
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    }
    return local
  }

  const displayName = getDisplayName()
  const userInitials =
    displayName
      .split(' ')
      .map((w) => w[0]?.toUpperCase())
      .join('')
      .slice(0, 2) || 'U'

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors font-medium ${
      isActive
        ? 'bg-slate-100 text-orange-600 font-semibold border-l-3 border-orange-500'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="bg-slate-900 border-b border-slate-800/80 px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-white px-3 py-1 rounded-md shadow-xs flex items-center justify-center transition group-hover:shadow-md">
              <img src={logo} alt="InTimeTec Deskflow" className="h-5.5 w-auto object-contain" />
            </div>
            <div className="hidden sm:block border-l border-slate-700/80 pl-3">
              <div className="text-xs font-bold text-white tracking-wide leading-tight">
                Smart Office
              </div>
              <div className="text-[10px] text-orange-400 font-medium tracking-wider uppercase leading-tight">
                Seating System
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <div className="flex items-center space-x-2.5 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-full shadow-xs">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold flex items-center justify-center text-[11px] shadow-xs">
                  {userInitials}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {displayName}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    {user.role} Access
                  </div>
                </div>
              </div>

              <LogoutButton />
            </>
          ) : (
            <Link
              to="/login"
              className="text-xs font-medium text-orange-400 hover:text-orange-300 border border-orange-500/40 px-3 py-1 rounded-md"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>
      <div className="h-[2px] bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 w-full" />

      <div className="flex flex-1">
        <aside className="w-56 bg-white border-r border-slate-200/80 p-4 hidden md:block">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
            Seating Map
          </div>
          <ul className="space-y-1 mb-5">
            <li>
              <NavLink to="/" end className={navItemClass}>
                Seating Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/seat-requests" className={navItemClass}>
                Seat Requests & Approvals
              </NavLink>
            </li>
          </ul>

          {isManagerOrAdmin && (
            <>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                Organization
              </div>
              <ul className="space-y-1 mb-5">
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
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                Administration
              </div>
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

        <main className="flex-1 p-5 md:p-7 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
export default MainLayout
