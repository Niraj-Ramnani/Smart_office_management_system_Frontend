import React from 'react'
import type { SeatingOverview } from '../../types'

interface SeatingOverviewCardsProps {
  overview: SeatingOverview
  onSelectFloor: (floorId: number) => void
}

const roleColors: Record<string, string> = {
  'Senior Developer': 'bg-orange-500',
  'UI/UX Designer': 'bg-emerald-500',
  'Project Manager': 'bg-amber-500',
  'Junior Developer': 'bg-blue-500',
  'Intern': 'bg-purple-500',
  'Managing Director': 'bg-teal-500',
  'DevOps Engineer': 'bg-emerald-400',
}

export const SeatingOverviewCards: React.FC<SeatingOverviewCardsProps> = ({
  overview,
  onSelectFloor,
}) => {
  const dynamicRoles = overview.role_distribution && overview.role_distribution.length > 0
    ? overview.role_distribution
    : [
        { role_name: 'Senior Developer', count: 1, percent: '14%' },
        { role_name: 'UI/UX Designer', count: 1, percent: '14%' },
        { role_name: 'Project Manager', count: 1, percent: '14%' },
        { role_name: 'Junior Developer', count: 1, percent: '14%' },
        { role_name: 'Intern', count: 1, percent: '14%' },
        { role_name: 'Managing Director', count: 1, percent: '14%' },
        { role_name: 'DevOps Engineer', count: 1, percent: '14%' },
      ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Occupied
            </div>
            <div className="text-3xl font-extrabold text-orange-400">
              {overview.total_occupied}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-orange-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Vacant
            </div>
            <div className="text-3xl font-extrabold text-white">
              {overview.total_vacant}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {overview.buildings.map((building) => (
            <div
              key={building.building_id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between"
            >
              <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                  </svg>
                  <span className="font-semibold text-xs tracking-wide">{building.building_name}</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">{building.total_seats} seats</span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-3 gap-2 text-center pb-4 mb-4 border-b border-slate-100">
                  <div>
                    <div className="text-base font-bold text-slate-800">{building.total_seats}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Total</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-orange-600">{building.occupied_seats}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Occ.</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-slate-600">{building.vacant_seats}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Vacant</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {building.floors.map((fl) => (
                    <div
                      key={fl.floor_id}
                      onClick={() => onSelectFloor(fl.floor_id)}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer transition text-xs"
                    >
                      <span className="font-medium text-slate-700">
                        {fl.floor_name}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {fl.vacant_seats}v / {fl.total_seats}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">Role Distribution</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">{dynamicRoles.length} roles</span>
            </div>

            <div className="space-y-3">
              {dynamicRoles.map((role) => (
                <div key={role.role_name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`w-1 h-3 rounded-full ${roleColors[role.role_name] || 'bg-slate-400'}`} />
                    <span className="text-slate-700 font-medium">{role.role_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800">{role.count}</span>
                    <span className="text-slate-400 text-[11px]">{role.percent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-slate-800" />
            <h3 className="font-bold text-xs text-slate-800">
              Floor Maps <span className="font-normal text-slate-400">— click any floor to open seating map</span>
            </h3>
          </div>
        </div>

        <div className="space-y-5">
          {overview.buildings.map((b) => (
            <div key={b.building_id}>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                {b.building_name}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {b.floors.map((fl) => (
                  <button
                    key={fl.floor_id}
                    onClick={() => onSelectFloor(fl.floor_id)}
                    className="flex flex-col items-start px-3.5 py-2 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-slate-50 transition cursor-pointer text-left"
                  >
                    <span className="text-xs font-semibold text-slate-800">{fl.floor_name}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      <span className="text-emerald-600 font-semibold">{fl.occupied_seats}</span> / {fl.total_seats} · <span className="text-orange-600 font-semibold">{fl.vacant_seats}v</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
