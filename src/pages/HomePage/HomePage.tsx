import React from 'react'
import { useHomePage } from './useHomePage'
import { PageHeader, StatCard } from '../../components/common'

export const HomePage: React.FC = () => {
  const {
    totalBuildings,
    totalFloors,
    totalEmployees,
    activeEmployees,
    activeUsers,
    totalUsers,
    isLoading,
  } = useHomePage()

  return (
    <div className="space-y-7">
      <PageHeader
        title="Workspace Overview"
        subtitle="Real-time operational summary across facilities, departments, and user provisioning."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-slate-200 animate-pulse h-36"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
            label="User Accounts"
            linkLabel="Users & Roles →"
            value={totalUsers}
            subValue={`${activeUsers} active`}
            description="Active accounts and access permissions"
          />
        </div>
      )}
    </div>
  )
}
