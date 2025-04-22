import { createSlice } from '@reduxjs/toolkit'

interface UserState {
  id: number | null
  email: string
  first_name: string
  last_name: string
  role_id: number | null
}

const initialState: UserState = {
  id: null,
  email: '',
  first_name: '',
  last_name: '',
  role_id: null
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
    }
  }
})

export const { setInitialState } = userSlice.actions
export default userSlice.reducer
