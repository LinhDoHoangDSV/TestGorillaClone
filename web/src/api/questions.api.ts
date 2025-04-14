import axios from 'axios'
import { CreateQuestionDto, serverBaseUrl } from '../constant/api'

export const TEST_URL = `${import.meta.env[`${serverBaseUrl}`]}/questions`

export const createQuestion = async (data: CreateQuestionDto) => {
  try {
    const result = await axios.post(TEST_URL, data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}
