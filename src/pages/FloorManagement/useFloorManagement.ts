import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import type { RootState } from '../../store/store'
import {
  useCreateFloorMutation,
  useDeleteFloorMutation,
  useGetFloorsQuery,
  useUpdateFloorMutation,
} from '../../store/api/floorApi'
import { useGetBuildingsQuery } from '../../store/api/buildingApi'
import type { Floor } from '../../types'
import { extractErrorMessage } from '../../utils/authErrors'
import { useActionFeedback, useConfirmDialog, useEntityModal } from '../../hooks'

export const useFloorManagement = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const isAdmin = user?.role === 'Admin'

  const [searchParams, setSearchParams] = useSearchParams()
  const buildingParam = searchParams.get('buildingId')
  const selectedBuildingId = buildingParam ? Number(buildingParam) : undefined

  const handleSelectBuilding = (id?: number) => {
    const params = new URLSearchParams(searchParams)
    if (id) {
      params.set('buildingId', String(id))
    } else {
      params.delete('buildingId')
    }
    setSearchParams(params)
  }

  const { data: buildings = [] } = useGetBuildingsQuery()
  const {
    data: floors = [],
    isLoading,
    error: fetchError,
    refetch,
  } = useGetFloorsQuery(selectedBuildingId)

  const [createFloor, { isLoading: isCreating }] = useCreateFloorMutation()
  const [updateFloor, { isLoading: isUpdating }] = useUpdateFloorMutation()
  const [deleteFloor, { isLoading: isDeleting }] = useDeleteFloorMutation()

  const modal = useEntityModal<Floor>()
  const confirm = useConfirmDialog<number>()
  const feedback = useActionFeedback()

  const [buildingId, setBuildingId] = useState<number>(0)
  const [name, setName] = useState('')
  const [floorNumber, setFloorNumber] = useState<number>(1)
  const [mapWidth, setMapWidth] = useState<number>(1000)
  const [mapHeight, setMapHeight] = useState<number>(800)

  const openCreateModal = () => {
    setBuildingId(selectedBuildingId || (buildings.length > 0 ? buildings[0].id : 0))
    setName('')
    setFloorNumber(1)
    setMapWidth(1000)
    setMapHeight(800)
    modal.openCreate()
  }

  const openEditModal = (f: Floor) => {
    setBuildingId(f.building_id)
    setName(f.name)
    setFloorNumber(f.floor_number)
    setMapWidth(f.map_width)
    setMapHeight(f.map_height)
    modal.openEdit(f)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    modal.setFormError(null)
    feedback.clearFeedback()

    if (!buildingId) {
      modal.setFormError('Please select a building')
      return
    }
    if (!name.trim()) {
      modal.setFormError('Floor name is required')
      return
    }

    try {
      if (modal.editingItem) {
        await updateFloor({
          id: modal.editingItem.id,
          building_id: buildingId,
          name: name.trim(),
          floor_number: Number(floorNumber),
          map_width: Number(mapWidth),
          map_height: Number(mapHeight),
        }).unwrap()
        feedback.notifySuccess(`Floor '${name.trim()}' updated successfully`)
      } else {
        await createFloor({
          building_id: buildingId,
          name: name.trim(),
          floor_number: Number(floorNumber),
          map_width: Number(mapWidth),
          map_height: Number(mapHeight),
        }).unwrap()
        feedback.notifySuccess(`Floor '${name.trim()}' created successfully`)
      }
      modal.close()
    } catch (err) {
      modal.setFormError(extractErrorMessage(err, 'Failed to save floor'))
    }
  }

  const handleDelete = async (id: number) => {
    feedback.clearFeedback()
    try {
      const res = await deleteFloor(id).unwrap()
      feedback.notifySuccess(res.message || 'Floor deleted successfully')
      confirm.closeConfirm()
    } catch (err) {
      feedback.notifyError(err, 'Failed to delete floor')
      confirm.closeConfirm()
    }
  }

  return {
    isAdmin,
    buildings,
    floors,
    isLoading,
    fetchError: fetchError ? extractErrorMessage(fetchError) : null,
    refetch,
    selectedBuildingId,
    setSelectedBuildingId: handleSelectBuilding,
    modalOpen: modal.isOpen,
    openCreateModal,
    openEditModal,
    closeModal: modal.close,
    handleSubmit,
    editingFloor: modal.editingItem,
    buildingId,
    setBuildingId,
    name,
    setName,
    floorNumber,
    setFloorNumber,
    mapWidth,
    setMapWidth,
    mapHeight,
    setMapHeight,
    formError: modal.formError,
    actionError: feedback.actionError,
    actionSuccess: feedback.actionSuccess,
    setActionError: feedback.setActionError,
    setActionSuccess: feedback.setActionSuccess,
    isSubmitting: isCreating || isUpdating,
    deleteConfirmId: confirm.confirmTarget,
    setDeleteConfirmId: confirm.setConfirmTarget,
    handleDelete,
    isDeleting,
  }
}
