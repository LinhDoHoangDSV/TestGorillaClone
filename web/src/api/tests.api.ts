import axios from 'axios'
import {
  CreateTestDto,
  serverBaseUrl,
  TestCriteria,
  UpdateTestDto
} from '../constant/api'

export const TEST_URL = `${import.meta.env[`${serverBaseUrl}`]}/tests`

export const createTest = async (data: CreateTestDto) => {
  try {
    const result = await axios.post(TEST_URL, data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getAllTests = async () => {
  try {
    const result = await axios(TEST_URL)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getAllTestsByCriteria = async (data: TestCriteria) => {
  try {
    const result = await axios.post(`${TEST_URL}/criterias`, data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getTestById = async (id: number) => {
  try {
    const result = await axios(`${TEST_URL}/${id}`)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateTest = async (id: number, data: UpdateTestDto) => {
  try {
    const result = await axios.patch(`${TEST_URL}/${id}`, data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}
