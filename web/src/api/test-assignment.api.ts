import axios from 'axios'
import { serverBaseUrl } from '../constant/api'
import { TestAssignment } from '../constant/common'

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
