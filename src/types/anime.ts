// src/types/anime.ts

export type ImageSet = {
  image_url: string
  small_image_url?: string
  large_image_url?: string
}

export type NameRef = { name: string }

export type AnimeTitle = {
  type: string
  title: string
}

export type AirDateProp = {
  day?: number | null
  month?: number | null
  year?: number | null
}

export type Trailer = {
  url?: string | null
  youtube_id?: string | null
  embed_url?: string | null
}

export type Anime = {
  mal_id: number
  url: string
  images: { jpg: ImageSet; webp?: ImageSet }

  // titles
  title: string
  title_english?: string
  titles?: AnimeTitle[]
  title_japanese?: string | null
  title_synonyms?: string[]

  // basic info
  type?: string | null
  score?: number
  rank?: number
  year?: number
  season?: string

  aired?: {
    from?: string | null
    to?: string | null
    prop?: {
      from?: AirDateProp
      to?: AirDateProp
    }
  }

  episodes?: number
  status?: string
  synopsis?: string
  duration?: string
  rating?: string

  // tags
  genres?: NameRef[]
  themes?: NameRef[]
  demographics?: NameRef[]

  // people / production
  studios?: NameRef[]
  producers?: NameRef[]

  // stats
  scored_by?: number
  favorites?: number

  // trailer
  trailer?: Trailer

  // airing / broadcast
  broadcast?: {
    string?: string | null
  }

  // relations / streaming
  relations?: {
    relation?: string
    entry?: {
      mal_id: number
      type?: string
      name: string
      url?: string
    }[]
  }[]
  streaming?: {
    name: string
    url?: string
  }[]
}

export type Pagination = {
  last_visible_page: number
  has_next_page: boolean
  current_page?: number
  items?: { count: number; total: number; per_page: number }
}

export type AnimeSearchResponse = {
  data: Anime[]
  pagination: Pagination
}

export type AnimeDetailResponse = {
  data: Anime
}

export type AnimeListResponse = {
  data: Anime[]
  pagination?: Pagination
}

export type AnimeRecommendationsResponse = {
  data: { entry: Anime }[]
}
