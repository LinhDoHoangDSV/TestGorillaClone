// import axios from 'axios'
// import { SendTestRequestDto, serverBaseUrl } from '../constant/api'
// import {
//   TestAssignment,
//   UpdateScoreTestAssignment,
//   UpdateTestAssignment
// } from '../constant/common'

// export const TEST_URL = `${import.meta.env[`${serverBaseUrl}`]}/test-assignment`

// export const getAllTestAssignmentByCriteria = async (
//   data: Partial<TestAssignment>
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

// export const sendTestRequest = async (data: SendTestRequestDto) => {
//   try {
//     const result = await axios.post(`${TEST_URL}/invite`, data, {
//       withCredentials: true
//     })
//     console.log(result)
//     return result
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }

// export const getTestAssignmentById = async (id: number) => {
//   try {
//     const result = await axios(`${TEST_URL}/${id}`, {
//       withCredentials: true
//     })
//     console.log(result)
//     return result
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }

// export const startAssessment = async (id: number) => {
//   try {
//     const result = await axios(`${TEST_URL}/start/${id}`, {
//       withCredentials: true
//     })
//     console.log(result)
//     return result
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }

// export const completeAssessment = async (id: number) => {
//   try {
//     const result = await axios(`${TEST_URL}/complete/${id}`, {
//       withCredentials: true
//     })
//     console.log(result)
//     return result
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }

// export const increaseScoreTestAssignment = async (
//   data: UpdateScoreTestAssignment,
//   id: number
// ) => {
//   try {
//     const result = await axios.patch(`${TEST_URL}/score-adjustment/${id}`, data)
//     console.log(result)
//     return result
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }

// export const updateTestAssignment = async (
//   data: UpdateTestAssignment,
//   id: number
// ) => {
//   try {
//     const result = await axios.patch(`${TEST_URL}/${id}`, data, {
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
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const sendTestRequest = async (data: SendTestRequestDto) => {
  try {
    const result = await axiosInstance.post('/test-assignment/invite', data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getTestAssignmentById = async (id: number) => {
  try {
    const result = await axiosInstance.get(`/test-assignment/${id}`)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const startAssessment = async (id: number) => {
  try {
    const result = await axiosInstance.get(`/test-assignment/start/${id}`)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const completeAssessment = async (id: number) => {
  try {
    const result = await axiosInstance.get(`/test-assignment/complete/${id}`)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
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
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const updateTestAssignment = async (
  data: UpdateTestAssignment,
  id: number
) => {
  try {
    const result = await axiosInstance.patch(`/test-assignment/${id}`, data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}
