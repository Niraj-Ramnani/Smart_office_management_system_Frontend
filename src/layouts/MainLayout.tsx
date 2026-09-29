import { useState, useEffect } from 'react'
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LogoutButton } from '../components/auth/LogoutButton'
import { NotificationBell } from '../components/common/NotificationBell'
import { UserProfileModal } from '../components/profile'
import { useNotificationWebSocket } from '../hooks/useNotificationWebSocket'
import { useGetNotificationsQuery } from '../store/api/notificationApi'
import type { RootState } from '../store/store'
import logo from '../assets/logo.png'

export const MainLayout = () => {
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user)
  const location = useLocation()
  useNotificationWebSocket(user?.id)

  const { data: notifData } = useGetNotificationsQuery(undefined, { pollingInterval: 10000 })
  const unreadCount = notifData?.unread_count || 0

  const isManagerOrAdmin = user?.role === 'Admin' || user?.role === 'Manager'
  const isAdmin = user?.role === 'Admin'
  const isEmployee = user?.role === 'Employee'

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

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
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
      isActive
        ? 'bg-orange-50 text-orange-600 font-semibold border-l-[3px] border-orange-500'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`

  const SidebarContent = () => (
    <>
      <nav className="flex-1 px-3 py-4 sidebar-scroll">

        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2.5">
          Workspace
        </div>
        <ul className="space-y-0.5 mb-5">
          <li>
            <NavLink to={isEmployee ? '/' : '/dashboard'} end={isEmployee} className={navItemClass}>
              <svg className="w-[17px] h-[17px] shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to={isEmployee ? '/seats' : '/'} end={!isEmployee} className={navItemClass}>
              <svg className="w-[17px] h-[17px] shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Seating Map</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/seat-requests" className={navItemClass}>
              <div className="relative shrink-0 flex items-center justify-center">
                <svg className="w-[17px] h-[17px] text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </div>
              <span className="flex-1 truncate">{isEmployee ? 'My Requests' : 'Requests & Approvals'}</span>
              {unreadCount > 0 && (
                <span className="flex items-center gap-1.5 ml-auto">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded-full shadow-xs">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                </span>
              )}
            </NavLink>
          </li>
          {isAdmin && (
            <li>
              <NavLink to="/assets" className={navItemClass}>
                <svg className="w-[17px] h-[17px] shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Asset Inventory</span>
              </NavLink>
            </li>
          )}
        </ul>

        {isManagerOrAdmin && (
          <>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2.5">
              {isAdmin ? 'Organization' : 'My Organization'}
            </div>
            <ul className="space-y-0.5 mb-5">
              {isAdmin && (
                <>
                  <li>
                    <NavLink to="/buildings" className={navItemClass}>
                      <svg className="w-[17px] h-[17px] shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                      </svg>
                      <span>Buildings</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/floors" className={navItemClass}>
                      <svg className="w-[17px] h-[17px] shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      <span>Floors</span>
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <NavLink to="/teams" className={navItemClass}>
                  <svg className="w-[17px] h-[17px] shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Teams</span>
                </NavLink>
              </li>
              {isAdmin && (
                <li>
                  <NavLink to="/employees" className={navItemClass}>
                    <svg className="w-[17px] h-[17px] shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>Employees</span>
                  </NavLink>
                </li>
              )}
            </ul>
          </>
        )}

        {isAdmin && (
          <>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2.5">
              Administration
            </div>
            <ul className="space-y-0.5">
              <li>
                <NavLink to="/users" className={navItemClass}>
                  <svg className="w-[17px] h-[17px] shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Users & Roles</span>
                </NavLink>
              </li>
            </ul>
          </>
        )}
      </nav>

      <div className="px-4 py-3 border-t border-slate-100 flex-shrink-0">
        <div className="text-[11px] text-slate-400 text-center">
          ITT Deskflow v1.0
        </div>
      </div>
    </>
  )

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden">

      <header className="bg-zinc-950 border-b border-zinc-800 px-5 h-14 flex items-center justify-between flex-shrink-0 z-40">
        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="xl:hidden relative flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer gap-1.5 shrink-0"
            aria-label="Toggle sidebar"
          >
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
            <span className={`block w-5 h-0.5 bg-zinc-300 rounded transition-all duration-200 ${sidebarOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-zinc-300 rounded transition-all duration-200 ${sidebarOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-zinc-300 rounded transition-all duration-200 ${sidebarOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white px-2.5 py-1.5 rounded shadow-sm flex items-center justify-center">
              <img src={logo} alt="InTimeTec Deskflow" className="h-5 w-auto object-contain" />
            </div>
            <div className="hidden sm:block border-l border-zinc-700 pl-3">
              <div className="text-[13px] font-bold text-white tracking-tight leading-tight">
                Smart Office
              </div>
              <div className="text-[11px] text-orange-500 font-semibold tracking-wide leading-tight">
                ITT Deskflow
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <NotificationBell />

              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                title="View your profile details"
                className="flex items-center gap-2.5 pl-3 border-l border-zinc-800 hover:bg-zinc-900 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  {userInitials}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[13px] font-semibold text-zinc-100 leading-tight">
                    {displayName}
                  </div>
                  <div className="text-[11px] text-zinc-400 leading-tight">
                    {user.role}
                  </div>
                </div>
              </button>

              <LogoutButton />
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-orange-400 hover:text-orange-300 border border-orange-500/40 px-3.5 py-1.5 rounded-lg"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <div className="flex flex-1 min-h-0 relative">

        {sidebarOpen && (
          <div
            className="xl:hidden fixed inset-0 bg-black/40 z-30 top-14"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-30
            w-60
            xl:flex xl:static xl:translate-x-0
            fixed top-14 bottom-0 left-0
            transition-transform duration-200
            ${sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full xl:translate-x-0'}
          `}
        >
          <SidebarContent />
        </aside>

        <main className="flex-1 min-h-0 min-w-0 main-scroll-area">
          <div className="p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
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
