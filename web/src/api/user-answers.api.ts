import axios from 'axios'
import { CreateUserAnser, serverBaseUrl } from '../constant/api'

export const TEST_URL = `${import.meta.env[`${serverBaseUrl}`]}/user-answers`

export const createUserAnsers = async (data: CreateUserAnser) => {
  try {
    const result = await axios.post(TEST_URL, data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}
