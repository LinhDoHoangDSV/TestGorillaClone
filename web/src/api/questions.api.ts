import axiosInstance from './axios.instance'
import { CreateQuestionDto, QuestionsCriteriaDto } from '../constant/api'
import { UpdateQuestionDto } from '../constant/common'

export const createQuestion = async (data: CreateQuestionDto) => {
  try {
    const result = await axiosInstance.post('/questions', data)
    return result
  } catch (error) {
    return error
  }
}

export const getAllQuestionsByCriteria = async (data: QuestionsCriteriaDto) => {
  try {
    const result = await axiosInstance.post('/questions/criterias', data)
    return result
  } catch (error) {
    return error
  }
}

export const updateQuestion = async (id: number, data: UpdateQuestionDto) => {
  try {
    const result = await axiosInstance.patch(`/questions/${id}`, data)
    return result
  } catch (error) {
    return error
  }
}

export const deleteQuestion = async (id: number) => {
  try {
    const result = await axiosInstance.delete(`/questions/${id}`)
    return result
  } catch (error) {
    return error
  }
}
