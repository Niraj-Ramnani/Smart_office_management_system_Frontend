import React from 'react'
import { Link } from 'react-router-dom'

export const TeamRequirementNotice: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800 flex items-start gap-3">
      <svg
        className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <div>
        <p className="font-semibold">Employee Required Before Team Creation</p>
        <p className="text-xs text-amber-700 mt-0.5">
          Each team requires an assigned manager. Please{' '}
          <Link
            to="/employees"
            className="underline font-semibold hover:text-amber-900"
          >
            create an employee first
          </Link>{' '}
          before creating a team.
        </p>
      </div>
    </div>
  )
}
