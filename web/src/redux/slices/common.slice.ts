import { createSlice } from '@reduxjs/toolkit'

interface commonState {
  isLoading: boolean
  toasterMessage: string
  toasterType: string
  toaster: boolean
  activeState: number
}

const initialState: commonState = {
  isLoading: false,
  toasterMessage: '',
  toasterType: '',
  toaster: false,
  activeState: 0
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
    },
    setActiveState: (state, action) => {
      state.activeState = action.payload.value
    }
  }
})

export const {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterDissappear,
  setToasterAppear,
  setActiveState
} = commonSlice.actions
export default commonSlice.reducer
