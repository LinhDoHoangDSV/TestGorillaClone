import axiosInstance from './axios.instance'
import {
  CreateUserAnser,
  SubmitCodeDto,
  UserAnserCriterias,
  UserAnswerUpdate
} from '../constant/api'

export const createUserAnsers = async (data: CreateUserAnser) => {
  try {
    const result = await axiosInstance.post('/user-answers', data)
    return result
  } catch (error) {
    return error
  }
}

export const getUserAnswerByCriterias = async (data: UserAnserCriterias) => {
  try {
    const result = await axiosInstance.post('/user-answers/criterias', data)
    return result
  } catch (error) {
    return error
  }
}

export const updateUserAnswer = async (id: number, data: UserAnswerUpdate) => {
  try {
    const result = await axiosInstance.patch(`/user-answers/${id}`, data)
    return result
  } catch (error) {
    return error
  }
}

export const submitCode = async (data: SubmitCodeDto) => {
  try {
    const result = await axiosInstance.post(`/user-answers/submit`, data)
    return result
  } catch (error) {
    return error
  }
}

export const getCodeResult = async (token: string) => {
  try {
    const result = await axiosInstance.get(`/user-answers/code-result/${token}`)
    return result
  } catch (error) {
    return error
  }
}
