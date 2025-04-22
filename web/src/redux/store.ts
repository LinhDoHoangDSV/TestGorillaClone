import { configureStore } from '@reduxjs/toolkit'
import commonReducer from './slices/common.slice'
import userReducer from './slices/user.slice'

export const store = configureStore({
  reducer: {
    common: commonReducer,
    user: userReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
