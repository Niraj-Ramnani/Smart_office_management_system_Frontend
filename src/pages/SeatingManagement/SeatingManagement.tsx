import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import type { RootState } from '../../store/store'
import {
  useGetFloorSeatingMapQuery,
  useGetSeatingOverviewQuery,
} from '../../store/api/seatApi'
import type { Seat, SeatRequestType } from '../../types'
import { SeatingOverviewCards } from '../../components/seat/SeatingOverviewCards'
import { FloorMapHeader } from '../../components/seat/FloorMapHeader'
import { FloorMapGrid } from '../../components/seat/FloorMapGrid'
import { SeatActionModal } from '../../components/seat/SeatActionModal'
import { SeatHistoryModal } from '../../components/seat/SeatHistoryModal'
import { EmployeeSeatModal } from '../../components/seat/EmployeeSeatModal'
import { SeatRequestModal } from '../../components/seatRequest/SeatRequestModal'
import { AddSeatModal } from '../../components/seat/AddSeatModal'

export const SeatingManagement: React.FC = () => {
  const [searchParams] = useSearchParams()
  const queryBuildingId = searchParams.get('buildingId') ? Number(searchParams.get('buildingId')) : null
  const queryFloorId = searchParams.get('floorId') ? Number(searchParams.get('floorId')) : null

  const user = useSelector((state: RootState) => state.auth.user)
  const isAdmin = user?.role === 'Admin'
  const isEmployee = user?.role === 'Employee'
  const currentEmployeeId = user?.employee_id || null

  const [activeView, setActiveView] = useState<'map' | 'overview'>('map')
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null)
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null)
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const [historySeatId, setHistorySeatId] = useState<number | null>(null)
  const [addSeatModalOpen, setAddSeatModalOpen] = useState(false)

  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [requestModalProps, setRequestModalProps] = useState<{
    initialType?: SeatRequestType
    initialSeat?: { id: number; seat_number: string } | null
    initialTargetEmployeeId?: number | null
  }>({})

  const { data: overview, isLoading: isOverviewLoading } = useGetSeatingOverviewQuery()

  const activeBuildingId =
    selectedBuildingId || queryBuildingId || overview?.buildings[0]?.building_id || null

  const activeBuilding =
    overview?.buildings.find((b) => b.building_id === activeBuildingId) ||
    overview?.buildings[0]

  const activeFloors = activeBuilding?.floors || []

  const activeFloorId =
    selectedFloorId || queryFloorId || (activeFloors.length > 0 ? activeFloors[0].floor_id : null)

  const { data: floorMap, isLoading: isMapLoading } = useGetFloorSeatingMapQuery(
    activeFloorId || 0,
    { skip: !activeFloorId }
  )

  const handleSelectSeat = (seat: Seat) => {
    setSelectedSeat(seat)
  }

  const handleViewHistory = (seatId: number) => {
    setSelectedSeat(null)
    setHistorySeatId(seatId)
  }

  const handleSelectBuilding = (bldgId: number) => {
    setSelectedBuildingId(bldgId)
    const bldg = overview?.buildings.find((b) => b.building_id === bldgId)
    if (bldg && bldg.floors.length > 0) {
      setSelectedFloorId(bldg.floors[0].floor_id)
    }
  }

  const handleSelectFloor = (floorId: number) => {
    setSelectedFloorId(floorId)
    setActiveView('map')
  }

  const handleEmployeeRequestSeat = (seat: Seat, type: SeatRequestType) => {
    setSelectedSeat(null)
    setRequestModalProps({
      initialType: type,
      initialSeat:
        type === 'NEW_SEAT' || type === 'RELOCATION'
          ? { id: seat.id, seat_number: seat.seat_number }
          : null,
      initialTargetEmployeeId: type === 'SWAP' ? seat.employee_id : null,
    })
    setRequestModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                {isEmployee ? 'Floor Seating Map' : 'Seating Floor Map & Management'}
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEmployee
                ? 'Explore office seating, locate your workspace, or submit a seat request to your manager.'
                : 'Select building and floor level to inspect desk occupancy, view capacity, or manage allocations.'}
            </p>
          </div>

          {!isEmployee && (
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveView('map')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeView === 'map'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Floor Seating Map
              </button>
              <button
                onClick={() => setActiveView('overview')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeView === 'overview'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Buildings Overview
              </button>
            </div>
          )}
        </div>

        {overview && overview.buildings.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mr-1">
                Building:
              </span>
              {overview.buildings.map((b) => (
                <button
                  key={b.building_id}
                  onClick={() => handleSelectBuilding(b.building_id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    activeBuilding?.building_id === b.building_id
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {b.building_name} ({b.total_seats})
                </button>
              ))}
            </div>

            {activeFloors.length > 0 && (
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mr-1">
                  Floor:
                </span>
                {activeFloors.map((fl) => (
                  <button
                    key={fl.floor_id}
                    onClick={() => handleSelectFloor(fl.floor_id)}
                    className={`px-2.5 py-1 rounded-md text-xs transition ${
                      activeFloorId === fl.floor_id && activeView === 'map'
                        ? 'bg-orange-500 text-white font-bold'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-500 hover:text-orange-600'
                    }`}
                  >
                    {fl.floor_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isOverviewLoading && (
        <div className="py-20 text-center text-slate-400 text-sm">
          Loading seating map data...
        </div>
      )}

      {!isOverviewLoading && overview && activeView === 'overview' && !isEmployee && (
        <SeatingOverviewCards
          overview={overview}
          onSelectFloor={(floorId) => handleSelectFloor(floorId)}
        />
      )}

      {!isOverviewLoading && (activeView === 'map' || isEmployee) && (
        <div>
          {isMapLoading ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              Loading floor seating map...
            </div>
          ) : floorMap ? (
            <>
              <FloorMapHeader
                buildingName={floorMap.building_name}
                floorName={floorMap.floor_name}
                totalSeats={floorMap.total_seats}
                occupiedSeats={floorMap.occupied_seats}
                vacantSeats={floorMap.vacant_seats}
                onBack={!isEmployee ? () => setActiveView('overview') : undefined}
                isAdmin={isAdmin}
                onAddSeat={() => setAddSeatModalOpen(true)}
              />
              <FloorMapGrid
                seats={floorMap.seats}
                onSelectSeat={handleSelectSeat}
                currentEmployeeId={currentEmployeeId}
              />
            </>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
              <p className="text-slate-500 mb-4">No floor map data found for this level.</p>
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <SeatActionModal
          seat={selectedSeat}
          isOpen={selectedSeat !== null}
          onClose={() => setSelectedSeat(null)}
          onViewHistory={handleViewHistory}
          availableSeats={floorMap?.seats || []}
        />
      )}

      {!isAdmin && (
        <EmployeeSeatModal
          seat={selectedSeat}
          isOpen={selectedSeat !== null}
          onClose={() => setSelectedSeat(null)}
          onRequestSeat={handleEmployeeRequestSeat}
          currentEmployeeId={currentEmployeeId}
        />
      )}

      <SeatRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        initialType={requestModalProps.initialType}
        initialSeat={requestModalProps.initialSeat}
        initialTargetEmployeeId={requestModalProps.initialTargetEmployeeId}
      />

      <SeatHistoryModal
        seatId={historySeatId}
        isOpen={historySeatId !== null}
        onClose={() => setHistorySeatId(null)}
      />

      {isAdmin && activeFloorId && (
        <AddSeatModal
          isOpen={addSeatModalOpen}
          onClose={() => setAddSeatModalOpen(false)}
          floorId={activeFloorId}
          floorName={floorMap?.floor_name || ''}
          existingSeats={floorMap?.seats || []}
        />
      )}
    </div>
  )
}
export default SeatingManagement
