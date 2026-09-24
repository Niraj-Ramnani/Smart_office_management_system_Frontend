import { baseApi } from './baseApi'
import type {
  Team,
  TeamCreatePayload,
  TeamUpdatePayload,
} from '../../types'

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeams: builder.query<Team[], void>({
      query: () => '/teams',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Team' as const, id })),
              { type: 'Team', id: 'LIST' },
            ]
          : [{ type: 'Team', id: 'LIST' }],
    }),
    createTeam: builder.mutation<Team, TeamCreatePayload>({
      query: (body) => ({
        url: '/teams',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Team', id: 'LIST' }],
    }),
    updateTeam: builder.mutation<Team, TeamUpdatePayload>({
      query: ({ id, ...body }) => ({
        url: `/teams/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Team', id },
        { type: 'Team', id: 'LIST' },
      ],
    }),
    deleteTeam: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Team', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = teamApi
