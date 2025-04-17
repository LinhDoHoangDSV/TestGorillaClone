import axios from 'axios'
import { SendTestRequestDto, serverBaseUrl } from '../constant/api'
import { TestAssignment, UpdateScoreTestAssignment } from '../constant/common'

export const TEST_URL = `${import.meta.env[`${serverBaseUrl}`]}/test-assignment`

export const getAllTestAssignmentByCriteria = async (
  data: Partial<TestAssignment>
) => {
  try {
    const result = await axios.post(`${TEST_URL}/criterias`, data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const sendTestRequest = async (data: SendTestRequestDto) => {
  try {
    const result = await axios.post(`${TEST_URL}/invite`, data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getTestAssignmentById = async (id: number) => {
  try {
    const result = await axios(`${TEST_URL}/${id}`)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateTestAssignment = async (
  data: UpdateScoreTestAssignment,
  id: number
) => {
  try {
    const result = await axios.patch(`${TEST_URL}/score-adjustment/${id}`, data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}
