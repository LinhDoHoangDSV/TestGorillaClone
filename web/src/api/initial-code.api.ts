import {
  CreateInitialCodeDto,
  FindInitialCodeCriteriasDto,
  UpdateInitialCodeDto
} from '../constant/common'
import axiosInstance from './axios.instance'

export const createInitialCode = async (data: CreateInitialCodeDto) => {
  try {
    const result = await axiosInstance.post('/initial-codes', data)
    return result
  } catch (error) {
    return error
  }
}

export const findInitialCodeByCriteria = async (
  data: FindInitialCodeCriteriasDto
) => {
  try {
    const result = await axiosInstance.post('/initial-codes/criterias', data)
    return result
  } catch (error) {
    return error
  }
}

export const updateInitialCode = async (
  id: number,
  data: UpdateInitialCodeDto
) => {
  try {
    const result = await axiosInstance.patch(`/initial-codes/${id}`, data)
    return result
  } catch (error) {
    return error
  }
}
