// import axios from 'axios'
// import { CreateAnswerDto, serverBaseUrl } from '../constant/api'

// export const TEST_URL = `${import.meta.env[`${serverBaseUrl}`]}/answers`

// export const createAnswer = async (data: CreateAnswerDto) => {
//   try {
//     const result = await axios.post(TEST_URL, data, {
//       withCredentials: true
//     })
//     console.log(result)
//     return result
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }

// export const getAllAnswerByCriteria = async (
//   data: Partial<CreateAnswerDto>
// ) => {
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

import axiosInstance from './axios.instance'
import { CreateAnswerDto, UpdateAnswerDto } from '../constant/api'

export const createAnswer = async (data: CreateAnswerDto) => {
  try {
    const result = await axiosInstance.post('/answers', data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getAllAnswerByCriteria = async (
  data: Partial<CreateAnswerDto>
) => {
  try {
    const result = await axiosInstance.post('/answers/criterias', data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateAnswer = async (
  id: number,
  updateAnswerDto: UpdateAnswerDto
) => {
  try {
    const result = await axiosInstance.patch(`/answers/${id}`, updateAnswerDto)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const deleteAnswer = async (id: number) => {
  try {
    const result = await axiosInstance.delete(`/answers/${id}`)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}
