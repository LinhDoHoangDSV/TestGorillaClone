import axios from 'axios'
import { CreateTestDto, serverBaseUrl } from '../constant/api'

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
