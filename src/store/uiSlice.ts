
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
  query: string
  page: number
}

const initialState: SearchState = {
  query: '',
  page: 1,
}

const uiSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
      state.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
  },
})

export const { setQuery, setPage } = uiSlice.actions
export default uiSlice.reducer
