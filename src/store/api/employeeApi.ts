import { baseApi } from './baseApi'
import type {
  Employee,
  EmployeeCreatePayload,
  EmployeeUpdatePayload,
  EmployeeFilterParams,
  CSVImportSummary,
} from '../../types'

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], EmployeeFilterParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams()
        if (params?.search) queryParams.append('search', params.search)
        if (params?.department) queryParams.append('department', params.department)
        if (params?.team_id) queryParams.append('team_id', String(params.team_id))
        if (params?.employee_status) queryParams.append('employee_status', params.employee_status)
        const qs = queryParams.toString()
        return qs ? `/employees?${qs}` : '/employees'
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Employee' as const, id })),
              { type: 'Employee', id: 'LIST' },
            ]
          : [{ type: 'Employee', id: 'LIST' }],
    }),
    createEmployee: builder.mutation<Employee, EmployeeCreatePayload>({
      query: (body) => ({
        url: '/employees',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Employee', id: 'LIST' },
        { type: 'Team', id: 'LIST' },
      ],
    }),
    updateEmployee: builder.mutation<Employee, EmployeeUpdatePayload>({
      query: ({ id, ...body }) => ({
        url: `/employees/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Employee', id },
        { type: 'Employee', id: 'LIST' },
        { type: 'Team', id: 'LIST' },
      ],
    }),
    updateEmployeeStatus: builder.mutation<
      Employee,
      { id: number; employee_status: string }
    >({
      query: ({ id, employee_status }) => ({
        url: `/employees/${id}/status`,
        method: 'PATCH',
        body: { employee_status },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Employee', id },
        { type: 'Employee', id: 'LIST' },
      ],
    }),
    deleteEmployee: builder.mutation<Employee, number>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Employee', id },
        { type: 'Employee', id: 'LIST' },
      ],
    }),
    importEmployeesCsv: builder.mutation<CSVImportSummary, string>({
      query: (csv_content) => ({
        url: '/employees/csv-import',
        method: 'POST',
        body: { csv_content },
      }),
      invalidatesTags: [
        { type: 'Employee', id: 'LIST' },
        { type: 'Team', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useUpdateEmployeeStatusMutation,
  useDeleteEmployeeMutation,
  useImportEmployeesCsvMutation,
} = employeeApi
