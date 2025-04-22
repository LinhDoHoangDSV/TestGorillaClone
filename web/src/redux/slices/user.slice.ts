import { createSlice } from '@reduxjs/toolkit'

interface UserState {
  id: number | null
  email: string
  first_name: string
  last_name: string
  role_id: number | null
  isAuthen: boolean
}

const initialState: UserState = {
  id: null,
  email: '',
  first_name: '',
  last_name: '',
  role_id: null,
  isAuthen: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setInitialState: (state, action) => {
      state.email = action.payload.email
      state.first_name = action.payload.first_name
      state.last_name = action.payload.last_name
      state.id = action.payload.id
      state.role_id = action.payload.role_id
    },
    setIsAuthen: (state, action) => {
      state.isAuthen = action.payload.value
    },
    clearAuth: (state) => {
      state.isAuthen = false
    }
  }
})

export const { setInitialState, setIsAuthen, clearAuth } = userSlice.actions
export default userSlice.reducer
