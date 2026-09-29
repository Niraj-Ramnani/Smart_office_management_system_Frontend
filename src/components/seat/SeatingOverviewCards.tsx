import React from 'react'
import type { SeatingOverview } from '../../types'

interface SeatingOverviewCardsProps {
  overview: SeatingOverview
  onSelectFloor: (floorId: number) => void
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
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Total Workstations
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {overview.total_seats}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Occupied Desks
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {overview.total_occupied}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-white">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
              Available Desks
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {overview.total_vacant}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {overview.buildings.map((building) => (
            <div
              key={building.building_id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs"
            >
              <div className="bg-zinc-950 text-white px-4 py-2.5 flex items-center justify-between">
                <span className="font-semibold text-xs tracking-wide">{building.building_name}</span>
                <span className="text-[11px] text-zinc-400">{building.total_seats} desks</span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-3 gap-2 text-center pb-3 mb-3 border-b border-slate-100">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{building.total_seats}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Total</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-800">{building.occupied_seats}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Occupied</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-orange-600">{building.vacant_seats}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Available</div>
                  </div>
                </div>

                <div className="space-y-1">
                  {building.floors.map((fl) => (
                    <button
                      key={fl.floor_id}
                      type="button"
                      onClick={() => onSelectFloor(fl.floor_id)}
                      className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-md hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                    >
                      <span className="font-medium text-slate-700">
                        {fl.floor_name}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        <span className="text-orange-600 font-semibold">{fl.vacant_seats} free</span> / {fl.total_seats}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                Role Distribution
              </h3>
              <span className="text-[11px] text-slate-400">{dynamicRoles.length} roles</span>
            </div>

            <div className="space-y-2">
              {dynamicRoles.map((role) => (
                <div key={role.role_name} className="flex items-center justify-between text-xs py-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span className="text-slate-700 font-medium">{role.role_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className="font-bold text-slate-900">{role.count}</span>
                    <span className="text-slate-400">({role.percent})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
          <h3 className="font-bold text-xs text-slate-900">
            Floor Maps <span className="font-normal text-slate-400">— click to open seating map</span>
          </h3>
        </div>

        <div className="space-y-4">
          {overview.buildings.map((b) => (
            <div key={b.building_id}>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {b.building_name}
              </div>
              <div className="flex flex-wrap gap-2">
                {b.floors.map((fl) => (
                  <button
                    key={fl.floor_id}
                    type="button"
                    onClick={() => onSelectFloor(fl.floor_id)}
                    className="flex flex-col items-start px-3 py-1.5 rounded-md border border-slate-200 hover:border-orange-500 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                  >
                    <span className="text-xs font-semibold text-slate-800">{fl.floor_name}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      <span>{fl.occupied_seats} occ</span> · <span className="text-orange-600 font-semibold">{fl.vacant_seats} available</span>
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

export default SeatingOverviewCards
