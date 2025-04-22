import axios from 'axios'
import {
  CreateQuestionDto,
  QuestionsCriteriaDto,
  serverBaseUrl
} from '../constant/api'
import { UpdateQuestionDto } from '../constant/common'

export const TEST_URL = `${import.meta.env[`${serverBaseUrl}`]}/questions`

export const createQuestion = async (data: CreateQuestionDto) => {
  try {
    const result = await axios.post(TEST_URL, data, {
      withCredentials: true
    })
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getAllQuestionsByCriteria = async (data: QuestionsCriteriaDto) => {
  try {
    const result = await axios.post(`${TEST_URL}/criterias`, data, {
      withCredentials: true
    })
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateQuestion = async (id: number, data: UpdateQuestionDto) => {
  try {
    const result = await axios.patch(`${TEST_URL}/${id}`, data, {
      withCredentials: true
    })
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const deleteQuestion = async (id: number) => {
  try {
    const result = await axios.delete(`${TEST_URL}/${id}`, {
      withCredentials: true
    })
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}
