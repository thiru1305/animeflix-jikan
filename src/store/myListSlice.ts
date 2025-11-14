import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Anime } from '@/types/anime'

export type Saved = Pick<
  Anime,
  | 'mal_id'
  | 'title'
  | 'title_english'
  | 'images'
  | 'score'
  | 'episodes'
  | 'synopsis'
  | 'season'
  | 'year'
  | 'scored_by'
  | 'favorites'
  | 'trailer'
> & {
  addedAt?: number
}

type MyListState = {
  items: Record<number, Saved>
}

const LS_KEY = 'animeflix_mylist_v1'

function loadFromStorage(): MyListState {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return { items: {} }
    const parsed = JSON.parse(raw) as MyListState
    return { items: parsed.items ?? {} }
  } catch {
    return { items: {} }
  }
}

const initialState: MyListState = { items: {} }

const persist = (state: MyListState) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state))
  } catch {
    // ignore storage errors
  }
}

const myListSlice = createSlice({
  name: 'myList',
  initialState,
  reducers: {
    hydrate(state) {
      const loaded = loadFromStorage()
      state.items = loaded.items
    },

    add(state, action: PayloadAction<Saved>) {
      const payload: Saved = {
        ...action.payload,
        addedAt: action.payload.addedAt ?? Date.now(),
      }
      state.items[payload.mal_id] = payload
      persist(state)
    },

    remove(state, action: PayloadAction<number>) {
      delete state.items[action.payload]
      persist(state)
    },

    toggle(state, action: PayloadAction<Saved>) {
      const id = action.payload.mal_id
      if (state.items[id]) {
        delete state.items[id]
      } else {
        state.items[id] = {
          ...action.payload,
          addedAt: action.payload.addedAt ?? Date.now(),
        }
      }
      persist(state)
    },

    clear(state) {
      state.items = {}
      persist(state)
    },
  },
})

export const { hydrate, add, remove, toggle, clear } = myListSlice.actions
export default myListSlice.reducer
