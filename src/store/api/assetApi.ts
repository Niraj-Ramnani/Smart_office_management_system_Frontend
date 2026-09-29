import { baseApi } from './baseApi'
import type {
  Asset,
  AssetAllocation,
  AssetCreatePayload,
  AssetUpdatePayload,
  AssetAllocatePayload,
  AssetReturnPayload,
  AssetMaintenancePayload,
  AssetReplacePayload,
} from '../../types'

export const assetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssets: builder.query<
      Asset[],
      { status?: string; asset_type?: string; search?: string } | void
    >({
      query: (params) => ({
        url: '/assets',
        params: params
          ? {
              status: params.status,
              asset_type: params.asset_type,
              search: params.search,
            }
          : undefined,
      }),
      providesTags: ['Asset'],
    }),

    getMyAssets: builder.query<Asset[], void>({
      query: () => '/assets/my',
      providesTags: ['Asset'],
    }),

    getEmployeeAssets: builder.query<Asset[], number>({
      query: (employeeId) => `/assets/employee/${employeeId}`,
      providesTags: ['Asset'],
    }),

    getAssetById: builder.query<Asset, number>({
      query: (assetId) => `/assets/${assetId}`,
      providesTags: ['Asset'],
    }),

    getAssetHistory: builder.query<AssetAllocation[], number>({
      query: (assetId) => `/assets/${assetId}/history`,
      providesTags: ['Asset'],
    }),

    createAsset: builder.mutation<Asset, AssetCreatePayload>({
      query: (payload) => ({
        url: '/assets',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Asset'],
    }),

    updateAsset: builder.mutation<Asset, { assetId: number; payload: AssetUpdatePayload }>({
      query: ({ assetId, payload }) => ({
        url: `/assets/${assetId}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Asset'],
    }),

    allocateAsset: builder.mutation<Asset, { assetId: number; payload: AssetAllocatePayload }>({
      query: ({ assetId, payload }) => ({
        url: `/assets/${assetId}/allocate`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Asset'],
    }),

    returnAsset: builder.mutation<Asset, { assetId: number; payload?: AssetReturnPayload }>({
      query: ({ assetId, payload }) => ({
        url: `/assets/${assetId}/return`,
        method: 'POST',
        body: payload || {},
      }),
      invalidatesTags: ['Asset'],
    }),

    maintenanceAsset: builder.mutation<
      Asset,
      { assetId: number; payload?: AssetMaintenancePayload }
    >({
      query: ({ assetId, payload }) => ({
        url: `/assets/${assetId}/maintenance`,
        method: 'POST',
        body: payload || {},
      }),
      invalidatesTags: ['Asset'],
    }),

    replaceAsset: builder.mutation<Asset, { assetId: number; payload: AssetReplacePayload }>({
      query: ({ assetId, payload }) => ({
        url: `/assets/${assetId}/replace`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Asset'],
    }),
  }),
})

export const {
  useGetAssetsQuery,
  useGetMyAssetsQuery,
  useGetEmployeeAssetsQuery,
  useGetAssetByIdQuery,
  useGetAssetHistoryQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useAllocateAssetMutation,
  useReturnAssetMutation,
  useMaintenanceAssetMutation,
  useReplaceAssetMutation,
} = assetApi
