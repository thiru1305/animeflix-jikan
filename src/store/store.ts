import { configureStore } from '@reduxjs/toolkit'
import { jikanApi } from './jikanApi'
import searchReducer from './uiSlice'
import myListReducer from './myListSlice' // ← add this

export const store = configureStore({
  reducer: {
    [jikanApi.reducerPath]: jikanApi.reducer,
    search: searchReducer,
    myList: myListReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jikanApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

