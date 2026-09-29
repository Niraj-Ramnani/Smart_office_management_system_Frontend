import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBuildingManagement } from './useBuildingManagement'
import {
  BuildingFormModal,
  BuildingTable,
} from '../../components/building'
import {
  ConfirmDialog,
  NotificationBanner,
  PageHeader,
  SearchBar,
  TableCard,
} from '../../components/common'

export const BuildingManagement: React.FC = () => {
  const navigate = useNavigate()
  const {
    isAdmin,
    buildings,
    rawCount,
    isLoading,
    fetchError,
    searchTerm,
    setSearchTerm,
    modalOpen,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    editingBuilding,
    name,
    setName,
    code,
    setCode,
    address,
    setAddress,
    formError,
    actionError,
    actionSuccess,
    setActionError,
    setActionSuccess,
    isSubmitting,
    deleteConfirmId,
    setDeleteConfirmId,
    handleDelete,
    isDeleting,
  } = useBuildingManagement()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Building Management"
        subtitle="Manage company office buildings, locations, and campus facilities."
        action={
          isAdmin && (
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 shadow-sm transition-colors cursor-pointer"
            >
              + Add Building
            </button>
          )
        }
      />

      <NotificationBanner
        successMessage={actionSuccess}
        errorMessage={actionError}
        onClearSuccess={() => setActionSuccess(null)}
        onClearError={() => setActionError(null)}
      />

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by name, code, address..."
        totalCount={rawCount}
        filteredCount={buildings.length}
        itemLabel="buildings"
      />

      <TableCard
        isLoading={isLoading}
        loadingMessage="Loading buildings..."
        error={fetchError}
        isEmpty={buildings.length === 0}
        emptyTitle="No buildings found"
        emptyDescription={
          searchTerm
            ? 'Try matching a different keyword'
            : 'Get started by creating your first office building.'
        }
        emptyAction={
          isAdmin && !searchTerm && (
            <button
              type="button"
              onClick={openCreateModal}
              className="px-4 py-2 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer"
            >
              + Register First Building
            </button>
          )
        }
      >
        <BuildingTable
          buildings={buildings}
          isAdmin={isAdmin}
          onEdit={openEditModal}
          onDelete={(id) => setDeleteConfirmId(id)}
          onViewFloors={(buildingId) => navigate(`/floors?buildingId=${buildingId}`)}
        />
      </TableCard>

      <BuildingFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        editingBuilding={editingBuilding}
        code={code}
        setCode={setCode}
        name={name}
        setName={setName}
        address={address}
        setAddress={setAddress}
        formError={formError}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        title="Confirm Delete"
        message="Are you sure you want to delete this building? If any floors are registered under this building, deletion will be blocked."
        confirmText="Delete"
        loadingText="Deleting..."
        isLoading={isDeleting}
      />
    </div>
  )
}
