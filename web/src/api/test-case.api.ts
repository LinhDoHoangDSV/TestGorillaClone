import {
  CreateTestCaseDto,
  FindTestCaseByCriterias,
  UpdateTestCaseDto
} from '../constant/common'
import axiosInstance from './axios.instance'

export const createTestCase = async (data: CreateTestCaseDto) => {
  try {
    const result = await axiosInstance.post('/test-cases', data)
    return result
  } catch (error) {
    return error
  }
}

export const findTestCaseByCriteria = async (data: FindTestCaseByCriterias) => {
  try {
    const result = await axiosInstance.post('/test-cases/criterias', data)
    return result
  } catch (error) {
    return error
  }
}

export const updateTestcase = async (id: number, data: UpdateTestCaseDto) => {
  try {
    const result = await axiosInstance.patch(`/test-cases/${id}`, data)
    return result
  } catch (error) {
    return error
  }
}

export const deleteTestcase = async (id: number) => {
  try {
    const result = await axiosInstance.delete(`/test-cases/${id}`)
    return result
  } catch (error) {
    return error
  }
}
