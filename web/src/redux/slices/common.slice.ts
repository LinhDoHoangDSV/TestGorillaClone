import { createSlice } from '@reduxjs/toolkit'

interface commonState {
  isLoading: boolean
}

const initialState: commonState = {
  isLoading: false
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setIsLoadingTrue: (state) => {
      state.isLoading = true
    },
    setIsLoadingFalse: (state) => {
      state.isLoading = false
    }
  }
})

export const { setIsLoadingFalse, setIsLoadingTrue } = commonSlice.actions
export default commonSlice.reducer
