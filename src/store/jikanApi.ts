// jikanApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  Anime,
  AnimeSearchResponse,
  AnimeDetailResponse,
  AnimeListResponse,
  AnimeRecommendationsResponse,
} from '@/types/anime'

export const jikanApi = createApi({
  reducerPath: 'jikanApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.jikan.moe/v4' }),
  tagTypes: ['Anime', 'Search'],
  endpoints: (builder) => ({
    searchAnime: builder.query<
      AnimeSearchResponse,
      { q: string; page: number; limit?: number }
    >({
      query: ({ q, page, limit = 24 }) => {
        const params = new URLSearchParams()
        if (q) params.set('q', q)
        params.set('page', String(page))
        params.set('limit', String(limit))
        params.set('sfw', 'true')
        params.set('order_by', 'score')
        params.set('sort', 'desc')
        return { url: `/anime?${params.toString()}` }
      },
      providesTags: (res) =>
        res?.data
          ? [
              ...res.data.map(({ mal_id }) => ({ type: 'Anime' as const, id: mal_id })),
              { type: 'Search', id: 'LIST' },
            ]
          : [{ type: 'Search', id: 'LIST' }],
    }),

    getAnimeById: builder.query<AnimeDetailResponse, number>({
      query: (id) => ({ url: `/anime/${id}/full` }),
      providesTags: (_res, _err, id) => [{ type: 'Anime', id }],
    }),

    topAnime: builder.query<AnimeListResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 24 } = {}) => ({
        url: `/top/anime?page=${page}&limit=${limit}`,
      }),
      providesTags: [{ type: 'Search', id: 'TOP' }],
    }),

    seasonsNow: builder.query<AnimeListResponse, void>({
      query: () => ({ url: `/seasons/now` }),
      providesTags: [{ type: 'Search', id: 'SEASON_NOW' }],
    }),

    // Keep this for future use (not used in Discover anymore)
    getRecommendations: builder.query<Anime[], number>({
      query: (id) => ({ url: `/anime/${id}/recommendations` }),
      transformResponse: (response: AnimeRecommendationsResponse) =>
        response.data.map((r) => r.entry),
      providesTags: (_res, _err, id) => [{ type: 'Anime', id }],
    }),
  }),
})

export const {
  useSearchAnimeQuery,
  useGetAnimeByIdQuery,
  useTopAnimeQuery,
  useSeasonsNowQuery,
  useGetRecommendationsQuery, // unused in Discover but available
} = jikanApi
