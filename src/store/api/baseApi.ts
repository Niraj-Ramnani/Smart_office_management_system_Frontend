import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getAccessToken } from '../../services/authService'
import type { UserProfile } from '../slices/authSlice'

export interface HealthResponse {
  status: string
}

export type UserMeResponse = UserProfile

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      try {
        const token = await getAccessToken()
        if (token) {
          headers.set('authorization', `Bearer ${token}`)
        }
      } catch (err) {
        console.warn('Unable to attach access token to request', err)
      }
      return headers
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getHealth: builder.query<HealthResponse, void>({
      query: () => '/health',
    }),
    getMe: builder.query<UserMeResponse, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
})

export const { useGetHealthQuery, useGetMeQuery, useLazyGetMeQuery } = baseApi
