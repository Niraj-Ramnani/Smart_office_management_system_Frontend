import { baseApi } from './baseApi'
import type {
  FloorSeatingMap,
  Seat,
  SeatAssignPayload,
  SeatBatchCreatePayload,
  SeatCreatePayload,
  SeatHistoryItem,
  SeatReleasePayload,
  SeatRelocatePayload,
  SeatSwapPayload,
  SeatUpdatePayload,
  SeatingOverview,
} from '../../types'

export const seatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSeatingOverview: builder.query<SeatingOverview, void>({
      query: () => '/seats/overview',
      providesTags: ['Seat'],
    }),

    getFloorSeatingMap: builder.query<FloorSeatingMap, number>({
      query: (floorId) => `/seats/floor-map/${floorId}`,
      providesTags: (_result, _error, floorId) => [{ type: 'Seat', id: `FLOOR_${floorId}` }, 'Seat'],
    }),

    listSeats: builder.query<Seat[], { floorId?: number; status?: string } | void>({
      query: (params) => ({
        url: '/seats',
        params: params ? { floor_id: params.floorId, status: params.status } : undefined,
      }),
      providesTags: ['Seat'],
    }),

    getSeat: builder.query<Seat, number>({
      query: (seatId) => `/seats/${seatId}`,
      providesTags: (_result, _error, seatId) => [{ type: 'Seat', id: seatId }],
    }),

    assignSeat: builder.mutation<Seat, { seatId: number; payload: SeatAssignPayload }>({
      query: ({ seatId, payload }) => ({
        url: `/seats/${seatId}/assign`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Seat', 'Employee'],
    }),

    releaseSeat: builder.mutation<Seat, { seatId: number; payload?: SeatReleasePayload }>({
      query: ({ seatId, payload }) => ({
        url: `/seats/${seatId}/release`,
        method: 'POST',
        body: payload || {},
      }),
      invalidatesTags: ['Seat', 'Employee'],
    }),

    relocateSeat: builder.mutation<Seat, SeatRelocatePayload>({
      query: (payload) => ({
        url: '/seats/relocate',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Seat', 'Employee'],
    }),

    swapSeats: builder.mutation<Seat[], SeatSwapPayload>({
      query: (payload) => ({
        url: '/seats/swap',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Seat', 'Employee'],
    }),

    getSeatHistory: builder.query<SeatHistoryItem[], number>({
      query: (seatId) => `/seats/${seatId}/history`,
      providesTags: (_result, _error, seatId) => [{ type: 'Seat', id: `HIST_${seatId}` }],
    }),

    getEmployeeSeatHistory: builder.query<SeatHistoryItem[], number>({
      query: (employeeId) => `/seats/employee/${employeeId}/history`,
    }),

    createSeat: builder.mutation<Seat, SeatCreatePayload>({
      query: (payload) => ({
        url: '/seats',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Seat', 'Floor'],
    }),

    batchCreateSeats: builder.mutation<Seat[], SeatBatchCreatePayload>({
      query: (payload) => ({
        url: '/seats/batch',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Seat', 'Floor'],
    }),

    updateSeat: builder.mutation<Seat, { seatId: number; payload: SeatUpdatePayload }>({
      query: ({ seatId, payload }) => ({
        url: `/seats/${seatId}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Seat'],
    }),

    deleteSeat: builder.mutation<{ message: string }, number>({
      query: (seatId) => ({
        url: `/seats/${seatId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Seat', 'Floor'],
    }),
  }),
})

export const {
  useGetSeatingOverviewQuery,
  useGetFloorSeatingMapQuery,
  useListSeatsQuery,
  useGetSeatQuery,
  useAssignSeatMutation,
  useReleaseSeatMutation,
  useRelocateSeatMutation,
  useSwapSeatsMutation,
  useGetSeatHistoryQuery,
  useGetEmployeeSeatHistoryQuery,
  useCreateSeatMutation,
  useBatchCreateSeatsMutation,
  useUpdateSeatMutation,
  useDeleteSeatMutation,
} = seatApi
