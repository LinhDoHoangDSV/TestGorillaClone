// import axios from 'axios'
// import {
//   CreateUserAnser,
//   serverBaseUrl,
//   UserAnserCriterias,
//   UserAnswerUpdate
// } from '../constant/api'

// export const TEST_URL = `${import.meta.env[`${serverBaseUrl}`]}/user-answers`

// export const createUserAnsers = async (data: CreateUserAnser) => {
//   try {
//     const result = await axios.post(TEST_URL, data)
//     console.log(result)
//     return result
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }

// export const getUserAnswerByCriterias = async (data: UserAnserCriterias) => {
//   try {
//     const result = await axios.post(`${TEST_URL}/criterias`, data, {
//       withCredentials: true
//     })
//     console.log(result)
//     return result
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }

// export const updateUserAnswer = async (id: number, data: UserAnswerUpdate) => {
//   try {
//     const result = await axios.patch(`${TEST_URL}/${id}`, data)
//     console.log(result)
//     return result
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }

import axiosInstance from './axios.instance'
import {
  CreateUserAnser,
  UserAnserCriterias,
  UserAnswerUpdate
} from '../constant/api'

export const createUserAnsers = async (data: CreateUserAnser) => {
  try {
    const result = await axiosInstance.post('/user-answers', data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getUserAnswerByCriterias = async (data: UserAnserCriterias) => {
  try {
    const result = await axiosInstance.post('/user-answers/criterias', data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateUserAnswer = async (id: number, data: UserAnswerUpdate) => {
  try {
    const result = await axiosInstance.patch(`/user-answers/${id}`, data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}
