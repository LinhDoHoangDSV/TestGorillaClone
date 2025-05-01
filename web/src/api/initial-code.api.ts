import {
  CreateInitialCodeDto,
  FindInitialCodeCriteriasDto,
  UpdateInitialCodeDto
} from '../constant/common'
import axiosInstance from './axios.instance'

export const createInitialCode = async (data: CreateInitialCodeDto) => {
  try {
    const result = await axiosInstance.post('/initial-codes', data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const findInitialCodeByCriteria = async (
  data: FindInitialCodeCriteriasDto
) => {
  try {
    const result = await axiosInstance.post('/initial-codes/criterias', data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateInitialCode = async (
  id: number,
  data: UpdateInitialCodeDto
) => {
  try {
    const result = await axiosInstance.patch(`/initial-codes/${id}`, data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}
