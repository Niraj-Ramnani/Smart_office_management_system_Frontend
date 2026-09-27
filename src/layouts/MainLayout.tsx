import { useState } from 'react'
import { Outlet, Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LogoutButton } from '../components/auth/LogoutButton'
import { NotificationBell } from '../components/common/NotificationBell'
import { UserProfileModal } from '../components/profile'
import { useNotificationWebSocket } from '../hooks/useNotificationWebSocket'
import type { RootState } from '../store/store'
import logo from '../assets/logo.png'

export const MainLayout = () => {
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user)
  useNotificationWebSocket(user?.id)

  const isManagerOrAdmin = user?.role === 'Admin' || user?.role === 'Manager'
  const isAdmin = user?.role === 'Admin'
  const isEmployee = user?.role === 'Employee'

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
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
      isActive
        ? 'bg-orange-50 text-orange-600 font-semibold border-l-[3px] border-orange-500 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.08)]'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
    }`

  return (
    <div className="h-screen flex flex-col bg-slate-50/60 text-slate-900 overflow-hidden">
      {/* ─── Fixed Header ─── */}
      <header className="bg-zinc-950 border-b border-zinc-800/90 px-6 py-2.5 flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-white px-2.5 py-1 rounded shadow-xs flex items-center justify-center">
              <img src={logo} alt="InTimeTec Deskflow" className="h-5 w-auto object-contain" />
            </div>
            <div className="hidden sm:block border-l border-zinc-800 pl-3">
              <div className="text-xs font-bold text-white tracking-tight leading-tight">
                Smart Office
              </div>
              <div className="text-[10px] text-orange-500 font-medium tracking-wide uppercase leading-tight">
                ITT Deskflow
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <NotificationBell />

              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                title="View your profile details"
                className="flex items-center space-x-2.5 pl-2 border-l border-zinc-800 hover:bg-zinc-900/80 px-2 py-1 rounded-md transition-colors cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <div className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold flex items-center justify-center text-xs">
                  {userInitials}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-medium text-zinc-200 leading-tight">
                    {displayName}
                  </div>
                  <div className="text-[10px] text-zinc-400 leading-tight">
                    {user.role}
                  </div>
                </div>
              </button>

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

      {/* ─── Body: Sidebar + Scrollable Main ─── */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar - fixed height, internal scroll */}
        <aside className="w-56 bg-white border-r border-slate-200/80 hidden md:flex md:flex-col flex-shrink-0">
          <nav className="flex-1 p-4 sidebar-scroll">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2.5">
              Workspace
            </div>
            <ul className="space-y-0.5 mb-5">
              <li>
                <NavLink to={isEmployee ? '/' : '/dashboard'} end={isEmployee} className={navItemClass}>
                  <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink to={isEmployee ? '/seats' : '/'} end={!isEmployee} className={navItemClass}>
                  <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Seating Map</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/seat-requests" className={navItemClass}>
                  <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>{isEmployee ? 'My Requests' : 'Requests & Approvals'}</span>
                </NavLink>
              </li>
              {isAdmin && (
                <li>
                  <NavLink to="/assets" className={navItemClass}>
                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Asset Inventory</span>
                  </NavLink>
                </li>
              )}
            </ul>

            {isManagerOrAdmin && (
              <>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2.5">
                  {isAdmin ? 'Organization' : 'My Organization'}
                </div>
                <ul className="space-y-0.5 mb-5">
                  {isAdmin && (
                    <>
                      <li>
                        <NavLink to="/buildings" className={navItemClass}>
                          <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                          </svg>
                          <span>Buildings</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/floors" className={navItemClass}>
                          <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                          <span>Floors</span>
                        </NavLink>
                      </li>
                    </>
                  )}
                  <li>
                    <NavLink to="/teams" className={navItemClass}>
                      <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Teams</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/employees" className={navItemClass}>
                      <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>{user?.role === 'Manager' ? 'Team Seating' : 'Employees'}</span>
                    </NavLink>
                  </li>
                </ul>
              </>
            )}

            {isAdmin && (
              <>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2.5">
                  Administration
                </div>
                <ul className="space-y-0.5">
                  <li>
                    <NavLink to="/users" className={navItemClass}>
                      <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Users & Roles</span>
                    </NavLink>
                  </li>
                </ul>
              </>
            )}
          </nav>

          {/* Sidebar footer */}
          <div className="px-4 py-3 border-t border-slate-100 flex-shrink-0">
            <div className="text-[10px] text-slate-400 text-center">
              ITT Deskflow v1.0
            </div>
          </div>
        </aside>

        {/* Main Content - scrollable */}
        <main className="flex-1 min-h-0 main-scroll-area">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  )
}

export default MainLayout
