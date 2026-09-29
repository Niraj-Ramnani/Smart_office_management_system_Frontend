import { baseApi } from './baseApi'
import type {
  SeatRequest,
  SeatRequestCreatePayload,
  SeatRequestExecutePayload,
  SeatRequestReviewPayload,
  SwapConsentPayload,
} from '../../types'

export const seatRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSeatRequest: builder.mutation<SeatRequest, SeatRequestCreatePayload>({
      query: (payload) => ({
        url: '/seat-requests',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['SeatRequest'],
    }),

    getMySeatRequests: builder.query<SeatRequest[], void>({
      query: () => '/seat-requests/my',
      providesTags: ['SeatRequest'],
    }),

    getTeamSeatRequests: builder.query<SeatRequest[], { status?: string } | void>({
      query: (params) => ({
        url: '/seat-requests/team',
        params: params ? { status: params.status } : undefined,
      }),
      providesTags: ['SeatRequest'],
    }),

    getAllSeatRequests: builder.query<
      SeatRequest[],
      { status?: string; requestType?: string } | void
    >({
      query: (params) => ({
        url: '/seat-requests',
        params: params
          ? { status: params.status, request_type: params.requestType }
          : undefined,
      }),
      providesTags: ['SeatRequest'],
    }),

    getApprovedSeatRequests: builder.query<SeatRequest[], void>({
      query: () => '/seat-requests/approved',
      providesTags: ['SeatRequest'],
    }),

    reviewSeatRequest: builder.mutation<
      SeatRequest,
      { requestId: number; payload: SeatRequestReviewPayload }
    >({
      query: ({ requestId, payload }) => ({
        url: `/seat-requests/${requestId}/review`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['SeatRequest', 'Notification'],
    }),

    respondSwapConsent: builder.mutation<
      SeatRequest,
      { requestId: number; payload: SwapConsentPayload }
    >({
      query: ({ requestId, payload }) => ({
        url: `/seat-requests/${requestId}/consent`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['SeatRequest', 'Notification'],
    }),

    executeSeatRequest: builder.mutation<
      SeatRequest,
      { requestId: number; payload: SeatRequestExecutePayload }
    >({
      query: ({ requestId, payload }) => ({
        url: `/seat-requests/${requestId}/execute`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['SeatRequest', 'Seat', 'Employee', 'Asset', 'Notification'],
    }),
  }),
})

export const {
  useCreateSeatRequestMutation,
  useGetMySeatRequestsQuery,
  useGetTeamSeatRequestsQuery,
  useGetAllSeatRequestsQuery,
  useGetApprovedSeatRequestsQuery,
  useReviewSeatRequestMutation,
  useRespondSwapConsentMutation,
  useExecuteSeatRequestMutation,
} = seatRequestApi
