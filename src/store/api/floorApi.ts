import { baseApi } from './baseApi'
import type {
  Floor,
  FloorCreatePayload,
  FloorUpdatePayload,
} from '../../types'

export const floorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFloors: builder.query<Floor[], number | void>({
      query: (buildingId) =>
        buildingId ? `/floors?building_id=${buildingId}` : '/floors',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Floor' as const, id })),
              { type: 'Floor', id: 'LIST' },
            ]
          : [{ type: 'Floor', id: 'LIST' }],
    }),
    createFloor: builder.mutation<Floor, FloorCreatePayload>({
      query: (body) => ({
        url: '/floors',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Floor', id: 'LIST' },
        { type: 'Building', id: 'LIST' },
      ],
    }),
    updateFloor: builder.mutation<Floor, FloorUpdatePayload>({
      query: ({ id, ...body }) => ({
        url: `/floors/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Floor', id },
        { type: 'Floor', id: 'LIST' },
        { type: 'Building', id: 'LIST' },
      ],
    }),
    deleteFloor: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/floors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Floor', id: 'LIST' },
        { type: 'Building', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetFloorsQuery,
  useCreateFloorMutation,
  useUpdateFloorMutation,
  useDeleteFloorMutation,
} = floorApi
