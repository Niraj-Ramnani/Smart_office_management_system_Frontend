import { baseApi } from './baseApi'
import type {
  Building,
  BuildingCreatePayload,
  BuildingUpdatePayload,
} from '../../types'

export const buildingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBuildings: builder.query<Building[], void>({
      query: () => '/buildings',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Building' as const, id })),
              { type: 'Building', id: 'LIST' },
            ]
          : [{ type: 'Building', id: 'LIST' }],
    }),
    createBuilding: builder.mutation<Building, BuildingCreatePayload>({
      query: (body) => ({
        url: '/buildings',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Building', id: 'LIST' }],
    }),
    updateBuilding: builder.mutation<Building, BuildingUpdatePayload>({
      query: ({ id, ...body }) => ({
        url: `/buildings/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Building', id },
        { type: 'Building', id: 'LIST' },
      ],
    }),
    deleteBuilding: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/buildings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Building', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetBuildingsQuery,
  useCreateBuildingMutation,
  useUpdateBuildingMutation,
  useDeleteBuildingMutation,
} = buildingApi
