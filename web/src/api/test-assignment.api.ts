import axiosInstance from './axios.instance'
import { SendTestRequestDto } from '../constant/api'
import {
  TestAssignment,
  UpdateScoreTestAssignment,
  UpdateTestAssignment
} from '../constant/common'

export const getAllTestAssignmentByCriteria = async (
  data: Partial<TestAssignment>
) => {
  try {
    const result = await axiosInstance.post('/test-assignment/criterias', data)
    return result
  } catch (error) {
    return error
  }
}

export const sendTestRequest = async (data: SendTestRequestDto) => {
  try {
    const result = await axiosInstance.post('/test-assignment/invite', data)
    return result
  } catch (error) {
    return error
  }
}

export const getTestAssignmentById = async (id: number) => {
  try {
    const result = await axiosInstance.get(`/test-assignment/${id}`)
    return result
  } catch (error) {
    return error
  }
}

export const startAssessment = async (id: number) => {
  try {
    const result = await axiosInstance.get(`/test-assignment/start/${id}`)
    return result
  } catch (error) {
    return error
  }
}

export const completeAssessment = async (id: number) => {
  try {
    const result = await axiosInstance.get(`/test-assignment/complete/${id}`)
    return result
  } catch (error) {
    return error
  }
}

export const increaseScoreTestAssignment = async (
  data: UpdateScoreTestAssignment,
  id: number
) => {
  try {
    const result = await axiosInstance.patch(
      `/test-assignment/score-adjustment/${id}`,
      data
    )
    return result
  } catch (error) {
    return error
  }
}

export const updateTestAssignment = async (
  data: UpdateTestAssignment,
  id: number
) => {
  try {
    const result = await axiosInstance.patch(`/test-assignment/${id}`, data)
    return result
  } catch (error) {
    return error
  }
}
