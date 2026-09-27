import React, { useMemo, useState } from 'react'
import type { Employee, Team } from '../../types'
import { Modal } from '../common'

export interface TeamDetailModalProps {
  isOpen: boolean
  onClose: () => void
  team: Team | null
  allEmployees: Employee[]
  isAdmin: boolean
  isManager: boolean
  onEditTeam: (team: Team) => void
  onAddMembers: (teamId: number, employeeIds: number[]) => Promise<void>
  onRemoveMember: (teamId: number, employeeId: number) => Promise<void>
}

export const TeamDetailModal: React.FC<TeamDetailModalProps> = ({
  isOpen,
  onClose,
  team,
  allEmployees,
  isAdmin,
  isManager,
  onEditTeam,
  onAddMembers,
  onRemoveMember,
}) => {
  const [memberSearch, setMemberSearch] = useState('')
  const [isAddMode, setIsAddMode] = useState(false)
  const [selectedToAdd, setSelectedToAdd] = useState<number[]>([])
  const [candidateSearch, setCandidateSearch] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<number | null>(null)

  const teamMembers = team?.members
  const members = useMemo(() => teamMembers || [], [teamMembers])

  const filteredMembers = useMemo(() => {
    if (!memberSearch.trim()) return members
    const q = memberSearch.toLowerCase()
    return members.filter(
      (m) =>
        m.first_name.toLowerCase().includes(q) ||
        m.last_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.employee_code.toLowerCase().includes(q) ||
        m.designation.toLowerCase().includes(q) ||
        (m.seat_number && m.seat_number.toLowerCase().includes(q))
    )
  }, [members, memberSearch])

  const currentMemberIds = useMemo(() => {
    return new Set(members.map((m) => m.id))
  }, [members])

  const eligibleCandidates = useMemo(() => {
    return allEmployees.filter((e) => !currentMemberIds.has(e.id))
  }, [allEmployees, currentMemberIds])

  const filteredCandidates = useMemo(() => {
    if (!candidateSearch.trim()) return eligibleCandidates
    const q = candidateSearch.toLowerCase()
    return eligibleCandidates.filter(
      (e) =>
        e.first_name.toLowerCase().includes(q) ||
        e.last_name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.employee_code.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q)
    )
  }, [eligibleCandidates, candidateSearch])

  const handleToggleCandidate = (id: number) => {
    setSelectedToAdd((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleConfirmAdd = async () => {
    if (!team || selectedToAdd.length === 0) return
    setIsProcessing(true)
    setActionError(null)
    try {
      await onAddMembers(team.id, selectedToAdd)
      setSelectedToAdd([])
      setIsAddMode(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add members'
      setActionError(msg)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemove = async (employeeId: number) => {
    if (!team) return
    setRemovingId(employeeId)
    setActionError(null)
    try {
      await onRemoveMember(team.id, employeeId)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove member'
      setActionError(msg)
    } finally {
      setRemovingId(null)
    }
  }

  if (!team) return null

  const canManage = isAdmin || (isManager && team.manager_id === team.manager_id)

  const managerInitials = team.manager_name
    ? team.manager_name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'MG'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={team.name}
      subtitle={`Department: ${team.department} · ${team.member_count} member${
        team.member_count === 1 ? '' : 's'
      }`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {actionError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between">
            <span>{actionError}</span>
            <button
              type="button"
              onClick={() => setActionError(null)}
              className="text-red-500 hover:text-red-700 font-bold ml-2 text-sm cursor-pointer"
            >
              &times;
            </button>
          </div>
        )}

        <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/50 rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md ring-4 ring-blue-50 shrink-0">
                {managerInitials}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                    Team Manager
                  </span>
                  {team.manager_employee_code && (
                    <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      #{team.manager_employee_code}
                    </span>
                  )}
                  {team.manager_seat_number ? (
                    <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Desk: {team.manager_seat_number}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Desk: Unassigned
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-bold text-slate-900 truncate">
                  {team.manager_name || `Manager ID: ${team.manager_id}`}
                </h4>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
                  {team.manager_designation && (
                    <span className="font-medium text-slate-700">
                      {team.manager_designation}
                    </span>
                  )}
                  {team.manager_email && (
                    <span className="text-slate-500">
                      · {team.manager_email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {canManage && (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onEditTeam(team)
                }}
                className="self-start sm:self-center shrink-0 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
              >
                Edit Team / Manager
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-base font-bold text-slate-900">
                  Team Members
                </h4>
                <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-full">
                  {members.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Personnel currently assigned to {team.name}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 bg-slate-50/50"
                />
                <svg
                  className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {canManage && (
                <button
                  type="button"
                  onClick={() => setIsAddMode((v) => !v)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  {isAddMode ? 'Close Picker' : '+ Add Members'}
                </button>
              )}
            </div>
          </div>

          {isAddMode && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800">
                  Select available employees to assign to {team.name}:
                </span>
                <input
                  type="text"
                  placeholder="Filter candidate employees..."
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  className="px-3 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-60 bg-white"
                />
              </div>

              {filteredCandidates.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">
                  No available employees match your search.
                </p>
              ) : (
                <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white">
                  {filteredCandidates.map((cand) => {
                    const isSelected = selectedToAdd.includes(cand.id)
                    return (
                      <label
                        key={cand.id}
                        className={`flex items-center justify-between px-3.5 py-2.5 text-xs cursor-pointer hover:bg-blue-50/50 transition-colors ${
                          isSelected ? 'bg-blue-50/70 font-medium' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleCandidate(cand.id)}
                            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-900 font-bold truncate">
                                {cand.first_name} {cand.last_name}
                              </span>
                              <span className="text-slate-500 font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                                {cand.employee_code}
                              </span>
                            </div>
                            <span className="text-slate-500 text-[11px] block truncate">
                              {cand.designation} · {cand.department}
                            </span>
                          </div>
                        </div>
                        {cand.team_name && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0 ml-2">
                            current: {cand.team_name}
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedToAdd([])
                    setIsAddMode(false)
                  }}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={selectedToAdd.length === 0 || isProcessing}
                  onClick={handleConfirmAdd}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs cursor-pointer transition"
                >
                  {isProcessing
                    ? 'Adding...'
                    : `Add Selected (${selectedToAdd.length})`}
                </button>
              </div>
            </div>
          )}

          {members.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-sm font-semibold text-slate-700">No members assigned</p>
              <p className="text-xs text-slate-400 mt-1">
                This team does not currently have any employees assigned to it.
              </p>
              {canManage && !isAddMode && (
                <button
                  type="button"
                  onClick={() => setIsAddMode(true)}
                  className="mt-3.5 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl cursor-pointer transition-colors"
                >
                  + Add Members to Team
                </button>
              )}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-xl">
              No team members match &quot;{memberSearch}&quot;.
            </div>
          ) : (
            <div className="border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3 min-w-[200px]">Member</th>
                      <th className="px-4 py-3 whitespace-nowrap">Code</th>
                      <th className="px-4 py-3 min-w-[140px]">Designation</th>
                      <th className="px-4 py-3 whitespace-nowrap">Desk</th>
                      <th className="px-4 py-3 whitespace-nowrap">Status</th>
                      {canManage && (
                        <th className="px-5 py-3 text-right whitespace-nowrap">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredMembers.map((m) => {
                      const initials = `${m.first_name?.[0] || ''}${m.last_name?.[0] || ''}`.toUpperCase()
                      return (
                        <tr
                          key={m.id}
                          className="hover:bg-slate-50/75 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                                {initials || 'EM'}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate">
                                  {m.first_name} {m.last_name}
                                </div>
                                <div className="text-[11px] text-slate-500 truncate">
                                  {m.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap font-mono">
                            <span className="inline-block bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                              {m.employee_code}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-slate-800">
                              {m.designation}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {m.department}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            {m.seat_number ? (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>{m.seat_number}</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                                Unallocated
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                m.employee_status === 'ACTIVE'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {m.employee_status}
                            </span>
                          </td>
                          {canManage && (
                            <td className="px-5 py-3.5 text-right whitespace-nowrap">
                              <button
                                type="button"
                                disabled={removingId === m.id}
                                onClick={() => handleRemove(m.id)}
                                className="text-[11px] font-semibold text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 py-1 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                              >
                                {removingId === m.id ? 'Removing...' : 'Remove'}
                              </button>
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Total team size: <strong className="text-slate-800">{members.length}</strong> {members.length === 1 ? 'member' : 'members'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}
