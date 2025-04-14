import { createSlice } from '@reduxjs/toolkit'

interface commonState {
  isLoading: boolean
  toasterMessage: string
  toasterType: string
  toaster: boolean
}

const initialState: commonState = {
  isLoading: false,
  toasterMessage: '',
  toasterType: '',
  toaster: false
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
    },
    setToasterAppear: (state, action) => {
      state.toasterMessage = action.payload.message
      state.toasterType = action.payload.type
      state.toaster = true
    },
    setToasterDissappear: (state) => {
      state.toasterMessage = ''
      state.toasterType = ''
      state.toaster = false
    }
  }
})

export const {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterDissappear,
  setToasterAppear
} = commonSlice.actions
export default commonSlice.reducer
