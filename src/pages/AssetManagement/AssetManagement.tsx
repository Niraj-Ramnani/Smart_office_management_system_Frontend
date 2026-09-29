import React, { useMemo, useState } from 'react'
import {
  useGetAssetsQuery,
  useCreateAssetMutation,
  useAllocateAssetMutation,
  useReturnAssetMutation,
  useMaintenanceAssetMutation,
  useGetAssetHistoryQuery,
} from '../../store/api/assetApi'
import { useGetEmployeesQuery } from '../../store/api/employeeApi'
import type { Asset, AssetType } from '../../types'
import { Badge } from '../../components/common/Badge'
import { ActionMenu } from '../../components/common/ActionMenu'

type SectionCategory = 'All' | 'Monitor' | 'Mouse' | 'Earphone' | 'Desktop'

const SECTIONS = [
  {
    key: 'All' as SectionCategory,
    label: 'All Equipment',
    desc: 'Complete IT hardware inventory across all categories',
    prefix: 'AST',
  },
  {
    key: 'Monitor' as SectionCategory,
    label: 'Monitors',
    desc: 'Workstation display panels and monitors',
    prefix: 'MON',
    defaultModel: 'Dell UltraSharp 27" 4K',
  },
  {
    key: 'Mouse' as SectionCategory,
    label: 'Mice',
    desc: 'Ergonomic optical and wireless computer mice',
    prefix: 'MOU',
    defaultModel: 'Logitech Master 3S',
  },
  {
    key: 'Earphone' as SectionCategory,
    label: 'Earphones',
    desc: 'Headphones, communication headsets, and earphones',
    prefix: 'EPH',
    defaultModel: 'Sony Noise-Cancelling Headset',
  },
  {
    key: 'Desktop' as SectionCategory,
    label: 'Desktops',
    desc: 'Office workstation towers and desktop units',
    prefix: 'DSK',
    defaultModel: 'Dell OptiPlex Tower',
  },
] as const

export const AssetManagement: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionCategory>('Monitor')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [allocateAsset, setAllocateAsset] = useState<Asset | null>(null)
  const [historyAssetId, setHistoryAssetId] = useState<number | null>(null)
  const [actionAsset, setActionAsset] = useState<{
    asset: Asset
    action: 'RETURN' | 'MAINTENANCE'
  } | null>(null)

  const { data: allAssets = [], isLoading } = useGetAssetsQuery(
    {
      search: search || undefined,
      status: statusFilter || undefined,
    },
    { pollingInterval: 12000 }
  )

  const { data: activeEmployees = [] } = useGetEmployeesQuery({
    employee_status: 'ACTIVE',
  })

  const [createAsset, { isLoading: isCreating }] = useCreateAssetMutation()
  const [allocateMutation, { isLoading: isAllocating }] = useAllocateAssetMutation()
  const [returnMutation, { isLoading: isReturning }] = useReturnAssetMutation()
  const [maintenanceMutation, { isLoading: isMaintaining }] = useMaintenanceAssetMutation()

  const { data: historyLogs = [], isLoading: isHistoryLoading } = useGetAssetHistoryQuery(
    historyAssetId || 0,
    { skip: !historyAssetId }
  )

  const [createForm, setCreateForm] = useState<{
    asset_code: string
    asset_type: AssetType
    model_name: string
    serial_number: string
    notes: string
  }>({
    asset_code: '',
    asset_type: 'Monitor',
    model_name: '',
    serial_number: '',
    notes: '',
  })
  const [createError, setCreateError] = useState<string | null>(null)

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | ''>('')
  const [allocateNotes, setAllocateNotes] = useState('')
  const [allocateError, setAllocateError] = useState<string | null>(null)

  const [actionNotes, setActionNotes] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)

  const sectionCounts = useMemo(() => {
    const stats: Record<string, { total: number; assigned: number; available: number }> = {
      Monitor: { total: 0, assigned: 0, available: 0 },
      Mouse: { total: 0, assigned: 0, available: 0 },
      Earphone: { total: 0, assigned: 0, available: 0 },
      Desktop: { total: 0, assigned: 0, available: 0 },
      All: { total: 0, assigned: 0, available: 0 },
    }

    for (const a of allAssets) {
      stats.All.total++
      if (a.status === 'Assigned') stats.All.assigned++
      if (a.status === 'Available') stats.All.available++

      const typeKey = a.asset_type as string
      if (stats[typeKey]) {
        stats[typeKey].total++
        if (a.status === 'Assigned') stats[typeKey].assigned++
        if (a.status === 'Available') stats[typeKey].available++
      }
    }
    return stats
  }, [allAssets])

  const filteredAssets = useMemo(() => {
    return allAssets.filter((asset) => {
      if (activeSection !== 'All' && asset.asset_type !== activeSection) {
        return false
      }
      return true
    })
  }, [allAssets, activeSection])

  const openCreateForSection = (targetSection: SectionCategory) => {
    const sectionType = targetSection === 'All' ? 'Monitor' : targetSection
    const prefix =
      SECTIONS.find((s) => s.key === sectionType)?.prefix || 'AST'
    const existingCount = allAssets.filter((a) => a.asset_type === sectionType).length
    const suggestedCode = `${prefix}-${String(existingCount + 1).padStart(2, '0')}`

    setCreateForm({
      asset_code: suggestedCode,
      asset_type: sectionType as AssetType,
      model_name: '',
      serial_number: `SN-${suggestedCode}`,
      notes: '',
    })
    setCreateError(null)
    setIsCreateModalOpen(true)
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)
    const code = createForm.asset_code.trim().toUpperCase()
    const model = createForm.model_name.trim() || `${createForm.asset_type} Standard`
    const serial = createForm.serial_number.trim() || `SN-${code}`

    try {
      await createAsset({
        asset_code: code,
        asset_type: createForm.asset_type,
        name: model,
        model_name: model,
        serial_number: serial,
        notes: createForm.notes.trim() || undefined,
      }).unwrap()

      setIsCreateModalOpen(false)
      setCreateForm({
        asset_code: '',
        asset_type: 'Monitor',
        model_name: '',
        serial_number: '',
        notes: '',
      })
    } catch (err: unknown) {
      const apiErr = err as { data?: { detail?: string } }
      setCreateError(apiErr?.data?.detail || 'Failed to create asset')
    }
  }

  const handleAllocateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!allocateAsset || !selectedEmployeeId) return
    setAllocateError(null)
    try {
      await allocateMutation({
        assetId: allocateAsset.id,
        payload: {
          employee_id: Number(selectedEmployeeId),
          notes: allocateNotes.trim() || undefined,
        },
      }).unwrap()

      setAllocateAsset(null)
      setSelectedEmployeeId('')
      setAllocateNotes('')
    } catch (err: unknown) {
      const apiErr = err as { data?: { detail?: string } }
      setAllocateError(apiErr?.data?.detail || 'Failed to allocate asset')
    }
  }

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!actionAsset) return
    setActionError(null)
    try {
      if (actionAsset.action === 'RETURN') {
        await returnMutation({
          assetId: actionAsset.asset.id,
          payload: { notes: actionNotes.trim() || undefined },
        }).unwrap()
      } else {
        await maintenanceMutation({
          assetId: actionAsset.asset.id,
          payload: { notes: actionNotes.trim() || undefined },
        }).unwrap()
      }

      setActionAsset(null)
      setActionNotes('')
    } catch (err: unknown) {
      const apiErr = err as { data?: { detail?: string } }
      setActionError(apiErr?.data?.detail || 'Failed to update asset status')
    }
  }

  const activeSectionMeta =
    SECTIONS.find((s) => s.key === activeSection) || SECTIONS[1]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            IT Asset & Hardware Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor, mouse, earphone, and desktop inventory, active custodians, and equipment lifecycle
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreateForSection(activeSection)}
          className="py-2 px-3.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
        >
          <span>+ Add {activeSection === 'All' ? 'Hardware Item' : activeSection}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {(['Monitor', 'Mouse', 'Earphone', 'Desktop'] as SectionCategory[]).map((sec) => {
          const stats = sectionCounts[sec] || { total: 0, assigned: 0, available: 0 }
          const isSelected = activeSection === sec
          return (
            <div
              key={sec}
              onClick={() => setActiveSection(sec)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-white border-orange-500 shadow-xs ring-1 ring-orange-500'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">{sec}s</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {stats.total} total
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Assigned</div>
                  <div className="font-bold text-slate-900">{stats.assigned}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">In Stock</div>
                  <div className="font-bold text-emerald-600">{stats.available}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center space-x-1 border-b border-slate-200">
        {SECTIONS.map((sec) => {
          const isCurrent = activeSection === sec.key
          const count =
            sec.key === 'All' ? allAssets.length : sectionCounts[sec.key]?.total || 0
          return (
            <button
              key={sec.key}
              type="button"
              onClick={() => setActiveSection(sec.key)}
              className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
                isCurrent
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{sec.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isCurrent ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search by code, model, serial, or employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Retired">Retired</option>
          </select>

          {(search || statusFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setStatusFilter('')
              }}
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold px-2 py-1 cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{activeSectionMeta.label} Section</h3>
            <p className="text-xs text-slate-500">{activeSectionMeta.desc}</p>
          </div>
          <button
            type="button"
            onClick={() => openCreateForSection(activeSection)}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
          >
            + Add New {activeSection === 'All' ? 'Item' : activeSection}
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading equipment records...</div>
        ) : filteredAssets.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <div>No items found in this section.</div>
            <button
              type="button"
              onClick={() => openCreateForSection(activeSection)}
              className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer"
            >
              + Register first {activeSection === 'All' ? 'hardware item' : activeSection.toLowerCase()}
            </button>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="px-5 py-3">Asset Code</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Model & Serial</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3">Given To (Current Custodian)</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map((asset) => {
                  const custodianName =
                    asset.current_employee_name || asset.current_allocation?.employee_name
                  const custodianCode =
                    asset.current_employee_code || asset.current_allocation?.employee_code

                  return (
                    <tr key={asset.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-mono text-xs font-bold text-slate-900">
                          {asset.asset_code}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(asset.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-800">{asset.asset_type}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-slate-800 font-medium">
                          {asset.name || asset.model_name || 'Standard Unit'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {asset.serial_number ? `S/N: ${asset.serial_number}` : 'No serial number'}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <Badge status={asset.status} showDot />
                      </td>
                      <td className="px-5 py-3.5">
                        {custodianName ? (
                          <div>
                            <div className="font-bold text-slate-900">{custodianName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              #{custodianCode || 'EMP'}
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-400 font-medium flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span>In Stock (Unassigned)</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <ActionMenu
                          primaryAction={
                            asset.status === 'Available'
                              ? {
                                  label: 'Allocate',
                                  onClick: () => setAllocateAsset(asset),
                                }
                              : undefined
                          }
                          items={[
                            ...(asset.status === 'Assigned'
                              ? [
                                  {
                                    label: 'Return Asset (Remove Custody)',
                                    onClick: () => setActionAsset({ asset, action: 'RETURN' }),
                                  },
                                ]
                              : []),
                            ...(asset.status !== 'Under Maintenance' && asset.status !== 'Retired'
                              ? [
                                  {
                                    label: 'Place Under Maintenance',
                                    onClick: () =>
                                      setActionAsset({ asset, action: 'MAINTENANCE' }),
                                  },
                                ]
                              : []),
                            {
                              label: 'Allocation History',
                              onClick: () => setHistoryAssetId(asset.id),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Add {createForm.asset_type} to Inventory
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Register hardware asset into the {createForm.asset_type} catalog
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-4 space-y-3.5">
              {createError && (
                <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium border border-rose-200">
                  {createError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asset Category
                </label>
                <select
                  value={createForm.asset_type}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      asset_type: e.target.value as AssetType,
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="Monitor">Monitor</option>
                  <option value="Mouse">Mouse</option>
                  <option value="Earphone">Earphone</option>
                  <option value="Desktop">Desktop</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asset Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MON-01, MOU-02"
                  value={createForm.asset_code}
                  onChange={(e) => setCreateForm({ ...createForm, asset_code: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Model / Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell UltraSharp 27-inch 4K"
                  value={createForm.model_name}
                  onChange={(e) => setCreateForm({ ...createForm, model_name: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Serial Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SN-88492048"
                  value={createForm.serial_number}
                  onChange={(e) => setCreateForm({ ...createForm, serial_number: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  placeholder="Specifications, location, or condition"
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isCreating ? 'Saving...' : 'Register Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {allocateAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Allocate {allocateAsset.asset_code}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Give {allocateAsset.asset_type.toLowerCase()} to an employee
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAllocateAsset(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAllocateSubmit} className="p-4 space-y-3.5">
              {allocateError && (
                <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium border border-rose-200">
                  {allocateError}
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div>
                  Item:{' '}
                  <span className="font-semibold text-slate-900">
                    {allocateAsset.name || allocateAsset.model_name || allocateAsset.asset_type}
                  </span>
                </div>
                <div>
                  Code: <span className="font-mono text-slate-700">{allocateAsset.asset_code}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Employee Custodian *
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(Number(e.target.value) || '')}
                  required
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">-- Choose employee --</option>
                  {activeEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name} ({emp.employee_code} - {emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Allocation Notes (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Workstation deployment"
                  value={allocateNotes}
                  onChange={(e) => setAllocateNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAllocateAsset(null)}
                  className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAllocating}
                  className="flex-1 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isAllocating ? 'Assigning...' : 'Confirm Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {actionAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {actionAsset.action === 'RETURN'
                    ? 'Return Asset (Remove Custody)'
                    : 'Place Under Maintenance'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{actionAsset.asset.asset_code}</p>
              </div>
              <button
                type="button"
                onClick={() => setActionAsset(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleActionSubmit} className="p-4 space-y-3.5">
              {actionError && (
                <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium border border-rose-200">
                  {actionError}
                </div>
              )}

              <p className="text-xs text-slate-600 leading-relaxed">
                {actionAsset.action === 'RETURN' ? (
                  <>
                    Are you sure you want to remove custody and return{' '}
                    <strong>{actionAsset.asset.asset_code}</strong> ({actionAsset.asset.asset_type})
                    back to available IT stock?
                  </>
                ) : (
                  <>
                    Are you sure you want to mark{' '}
                    <strong>{actionAsset.asset.asset_code}</strong> as Under Maintenance?
                  </>
                )}
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes / Reason
                </label>
                <input
                  type="text"
                  placeholder="e.g. Employee offboarding or scheduled diagnostics"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActionAsset(null)}
                  className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReturning || isMaintaining}
                  className="flex-1 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  Confirm Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {historyAssetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Asset Allocation History
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Historical custody and lifecycle records</p>
              </div>
              <button
                type="button"
                onClick={() => setHistoryAssetId(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-4 max-h-80 overflow-y-auto">
              {isHistoryLoading ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading history...</div>
              ) : historyLogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No historical records for this asset yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {historyLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-lg border border-slate-200 text-xs flex items-center justify-between bg-slate-50/50"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-900">{log.action}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-700">
                            {log.employee_name || `Employee #${log.employee_id}`}
                          </span>
                        </div>
                        {log.notes && (
                          <div className="text-[11px] text-slate-500 italic">Notes: {log.notes}</div>
                        )}
                      </div>
                      <div className="text-right text-[11px] text-slate-400">
                        <div>{new Date(log.allocated_at).toLocaleDateString()}</div>
                        {log.returned_at && (
                          <div>Ret: {new Date(log.returned_at).toLocaleDateString()}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AssetManagement
