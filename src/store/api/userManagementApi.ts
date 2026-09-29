import { baseApi } from './baseApi'
import type {
  Role,
  UserManagement,
  UserProvisionCSVResponse,
  UserProvisionPayload,
} from '../../types'

export const userManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserManagement[], void>({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    getRoles: builder.query<Role[], void>({
      query: () => '/users/roles',
      providesTags: ['Role'],
    }),
    provisionUser: builder.mutation<UserManagement, UserProvisionPayload>({
      query: (body) => ({
        url: '/users/provision',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'User', id: 'LIST' },
        { type: 'Employee', id: 'LIST' },
      ],
    }),
    provisionUsersCsv: builder.mutation<UserProvisionCSVResponse, string>({
      query: (csv_content) => ({
        url: '/users/provision/csv',
        method: 'POST',
        body: { csv_content },
      }),
      invalidatesTags: [
        { type: 'User', id: 'LIST' },
        { type: 'Employee', id: 'LIST' },
      ],
    }),
    assignUserEmployee: builder.mutation<
      UserManagement,
      { userId: number; employeeId: number | null }
    >({
      query: ({ userId, employeeId }) => ({
        url: `/users/${userId}/employee`,
        method: 'PATCH',
        body: { employee_id: employeeId },
      }),
      invalidatesTags: [
        { type: 'User', id: 'LIST' },
        { type: 'Employee', id: 'LIST' },
      ],
    }),
    updateUserRole: builder.mutation<
      UserManagement,
      { userId: number; roleName: string }
    >({
      query: ({ userId, roleName }) => ({
        url: `/users/${userId}/role`,
        method: 'PATCH',
        body: { role_name: roleName },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUserStatus: builder.mutation<
      UserManagement,
      { userId: number; isActive: boolean }
    >({
      query: ({ userId, isActive }) => ({
        url: `/users/${userId}/status`,
        method: 'PATCH',
        body: { is_active: isActive },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    deleteUser: builder.mutation<{ message: string }, number>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'User', id: 'LIST' },
        { type: 'Employee', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetRolesQuery,
  useProvisionUserMutation,
  useProvisionUsersCsvMutation,
  useAssignUserEmployeeMutation,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
} = userManagementApi
