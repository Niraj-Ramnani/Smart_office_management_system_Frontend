import React from 'react'
import { useFloorManagement } from './useFloorManagement'
import {
  FloorFilterBar,
  FloorFormModal,
  FloorTable,
} from '../../components/floor'
import {
  ConfirmDialog,
  NotificationBanner,
  PageHeader,
  TableCard,
} from '../../components/common'

export const FloorManagement: React.FC = () => {
  const {
    isAdmin,
    buildings,
    floors,
    isLoading,
    fetchError,
    selectedBuildingId,
    setSelectedBuildingId,
    modalOpen,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    editingFloor,
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
  } = useFloorManagement()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Floor Management"
        subtitle="Configure building levels, floor maps, and seating layouts."
        action={
          isAdmin && (
            <button
              type="button"
              disabled={buildings.length === 0}
              onClick={openCreateModal}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Floor
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

      <FloorFilterBar
        selectedBuildingId={selectedBuildingId}
        onBuildingChange={setSelectedBuildingId}
        buildings={buildings}
        floorCount={floors.length}
      />

      <TableCard
        isLoading={isLoading}
        loadingMessage="Loading floors..."
        error={fetchError}
        isEmpty={floors.length === 0}
        emptyTitle="No floors found"
        emptyDescription={
          buildings.length === 0
            ? 'Create a building first before adding floors.'
            : 'No floors configured for the selected criteria.'
        }
        emptyAction={
          isAdmin && buildings.length > 0 && (
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer"
            >
              + Add Floor
            </button>
          )
        }
      >
        <FloorTable
          floors={floors}
          isAdmin={isAdmin}
          onEdit={openEditModal}
          onDelete={(id) => setDeleteConfirmId(id)}
        />
      </TableCard>

      <FloorFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        editingFloor={editingFloor}
        buildings={buildings}
        buildingId={buildingId}
        setBuildingId={setBuildingId}
        name={name}
        setName={setName}
        floorNumber={floorNumber}
        setFloorNumber={setFloorNumber}
        mapWidth={mapWidth}
        setMapWidth={setMapWidth}
        mapHeight={mapHeight}
        setMapHeight={setMapHeight}
        formError={formError}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId !== null && handleDelete(deleteConfirmId)}
        title="Confirm Delete Floor"
        message="Are you sure you want to delete this floor? If any seating positions are configured on this floor, deletion will be blocked."
        confirmText="Delete"
        loadingText="Deleting..."
        isLoading={isDeleting}
      />
    </div>
  )
}
