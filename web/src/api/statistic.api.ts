import axios from 'axios'
import { serverBaseUrl } from '../constant/api'

export const TEST_URL = `${import.meta.env[`${serverBaseUrl}`]}/statistics`

export const getUserStatistics = async () => {
  try {
    const result = await axios(`${TEST_URL}/one/own`, {
      withCredentials: true
    })
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}
