import axiosInstance from './axios.instance'
import { CreateAnswerDto, UpdateAnswerDto } from '../constant/api'

export const createAnswer = async (data: CreateAnswerDto) => {
  try {
    const result = await axiosInstance.post('/answers', data)
    return result
  } catch (error) {
    return error
  }
}

export const getAllAnswerByCriteria = async (
  data: Partial<CreateAnswerDto>
) => {
  try {
    const result = await axiosInstance.post('/answers/criterias', data)
    return result
  } catch (error) {
    return error
  }
}

export const updateAnswer = async (
  id: number,
  updateAnswerDto: UpdateAnswerDto
) => {
  try {
    const result = await axiosInstance.patch(`/answers/${id}`, updateAnswerDto)
    return result
  } catch (error) {
    return error
  }
}

export const deleteAnswer = async (id: number) => {
  try {
    const result = await axiosInstance.delete(`/answers/${id}`)
    return result
  } catch (error) {
    return error
  }
}
