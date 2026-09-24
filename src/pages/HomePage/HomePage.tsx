import React from 'react'
import { useHomePage } from './useHomePage'
import { PageHeader, StatCard } from '../../components/common'

export const HomePage: React.FC = () => {
  const {
    totalBuildings,
    totalFloors,
    totalEmployees,
    activeEmployees,
    unlinkedUsers,
    totalUsers,
    isLoading,
  } = useHomePage()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workspace Overview"
        subtitle="Real-time operational summary across facilities, departments, and user provisioning."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-slate-200 animate-pulse h-32"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            to="/buildings"
            label="Buildings"
            linkLabel="Manage →"
            value={totalBuildings}
            subValue="locations"
            description="Campus offices and operational facilities"
          />

          <StatCard
            to="/floors"
            label="Floors"
            linkLabel="Manage →"
            value={totalFloors}
            subValue="configured"
            description="Floor levels mapped with seating zones"
          />

          <StatCard
            to="/employees"
            label="Employees"
            linkLabel="Directory →"
            value={activeEmployees}
            subValue={`active of ${totalEmployees}`}
            description="Active staff members across departments"
          />

          <StatCard
            to="/users"
            label="Pending Links"
            linkLabel="Users & Roles →"
            value={unlinkedUsers}
            subValue={`unlinked of ${totalUsers}`}
            description={
              unlinkedUsers > 0
                ? 'App users awaiting employee profile linkage'
                : 'All application accounts linked to employees'
            }
            valueClassName={unlinkedUsers > 0 ? 'text-amber-600' : 'text-slate-900'}
          />
        </div>
      )}
    </div>
  )
}
