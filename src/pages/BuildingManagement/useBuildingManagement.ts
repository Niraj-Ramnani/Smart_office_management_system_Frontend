import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import {
  useCreateBuildingMutation,
  useDeleteBuildingMutation,
  useGetBuildingsQuery,
  useUpdateBuildingMutation,
} from '../../store/api/buildingApi'
import type { Building } from '../../types'
import { extractErrorMessage } from '../../utils/authErrors'
import { useActionFeedback, useConfirmDialog, useEntityModal } from '../../hooks'

export const useBuildingManagement = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const isAdmin = user?.role === 'Admin'

  const { data: buildings = [], isLoading, error: fetchError, refetch } = useGetBuildingsQuery()
  const [createBuilding, { isLoading: isCreating }] = useCreateBuildingMutation()
  const [updateBuilding, { isLoading: isUpdating }] = useUpdateBuildingMutation()
  const [deleteBuilding, { isLoading: isDeleting }] = useDeleteBuildingMutation()

  const [searchTerm, setSearchTerm] = useState('')
  const modal = useEntityModal<Building>()
  const confirm = useConfirmDialog<number>()
  const feedback = useActionFeedback()

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [address, setAddress] = useState('')

  const openCreateModal = () => {
    setName('')
    setCode('')
    setAddress('')
    modal.openCreate()
  }

  const openEditModal = (b: Building) => {
    setName(b.name)
    setCode(b.code)
    setAddress(b.address || '')
    modal.openEdit(b)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    modal.setFormError(null)
    feedback.clearFeedback()

    if (!name.trim()) {
      modal.setFormError('Building name is required')
      return
    }
    if (!code.trim()) {
      modal.setFormError('Building code is required')
      return
    }

    try {
      if (modal.editingItem) {
        await updateBuilding({
          id: modal.editingItem.id,
          name: name.trim(),
          code: code.trim(),
          address: address.trim() || null,
        }).unwrap()
        feedback.notifySuccess(`Building '${name.trim()}' updated successfully`)
      } else {
        await createBuilding({
          name: name.trim(),
          code: code.trim(),
          address: address.trim() || null,
        }).unwrap()
        feedback.notifySuccess(`Building '${name.trim()}' created successfully`)
      }
      modal.close()
    } catch (err) {
      modal.setFormError(extractErrorMessage(err, 'Failed to save building'))
    }
  }

  const handleDelete = async (id: number) => {
    feedback.clearFeedback()
    try {
      const res = await deleteBuilding(id).unwrap()
      feedback.notifySuccess(res.message || 'Building deleted successfully')
      confirm.closeConfirm()
    } catch (err) {
      feedback.notifyError(err, 'Failed to delete building')
      confirm.closeConfirm()
    }
  }

  const filteredBuildings = buildings.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.address && b.address.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return {
    isAdmin,
    buildings: filteredBuildings,
    rawCount: buildings.length,
    isLoading,
    fetchError: fetchError ? extractErrorMessage(fetchError) : null,
    refetch,
    searchTerm,
    setSearchTerm,
    modalOpen: modal.isOpen,
    openCreateModal,
    openEditModal,
    closeModal: modal.close,
    handleSubmit,
    editingBuilding: modal.editingItem,
    name,
    setName,
    code,
    setCode,
    address,
    setAddress,
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
