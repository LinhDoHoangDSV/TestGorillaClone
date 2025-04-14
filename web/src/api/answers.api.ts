import axios from 'axios'
import { CreateAnswerDto, serverBaseUrl } from '../constant/api'

export const TEST_URL = `${import.meta.env[`${serverBaseUrl}`]}/answers`

export const createAnswer = async (data: CreateAnswerDto) => {
  try {
    const result = await axios.post(TEST_URL, data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}
