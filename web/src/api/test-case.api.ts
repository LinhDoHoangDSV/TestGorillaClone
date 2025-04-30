import { CreateTestCaseDto, FindTestCaseByCriterias } from '../constant/common'
import axiosInstance from './axios.instance'

export const createTestCase = async (data: CreateTestCaseDto) => {
  try {
    const result = await axiosInstance.post('/test-cases', data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const findTestCaseByCriteria = async (data: FindTestCaseByCriterias) => {
  try {
    const result = await axiosInstance.post('/test-cases/criterias', data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}
