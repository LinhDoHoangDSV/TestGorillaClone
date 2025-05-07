import axiosInstance from './axios.instance'
import { CreateTestDto, TestCriteria, UpdateTestDto } from '../constant/api'

export const createTest = async (data: CreateTestDto) => {
  try {
    const result = await axiosInstance.post('/tests', data)
    return result
  } catch (error) {
    return error
  }
}

export const getAllTests = async () => {
  try {
    const result = await axiosInstance.get('/tests')
    return result
  } catch (error) {
    return error
  }
}

export const getAllTestsByCriteria = async (data?: TestCriteria) => {
  try {
    const result = await axiosInstance.post('/tests/criterias', data)
    return result
  } catch (error) {
    return error
  }
}

export const getAllOwnTests = async () => {
  try {
    const result = await axiosInstance.get('/tests/all/own')
    return result
  } catch (error) {
    return error
  }
}

export const getTestById = async (id: number) => {
  try {
    const result = await axiosInstance.get(`/tests/${id}`)
    return result
  } catch (error) {
    return error
  }
}

export const updateTest = async (id: number, data: UpdateTestDto) => {
  try {
    const result = await axiosInstance.patch(`/tests/${id}`, data)
    return result
  } catch (error) {
    return error
  }
}
