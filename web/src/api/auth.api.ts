// import axios from 'axios'
// import { serverBaseUrl } from '../constant/api'

// export const TEST_URL = `${import.meta.env[`${serverBaseUrl}`]}/auth`

// export const login = async (token: string) => {
//   try {
//     const result = await axios.post(
//       `${TEST_URL}/log-in`,
//       {},
//       {
//         headers: {
//           gid: token
//         },
//         withCredentials: true
//       }
//     )
//     console.log(result)
//     return result
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }

// export const getInformation = async () => {
//   try {
//     const result = await axios(`${TEST_URL}/me`, {
//       withCredentials: true
//     })
//     console.log(result)
//     return result
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }

// export const refreshToken = async () => {
//   try {
//     const result = await axios(`${TEST_URL}/refresh`, {
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

export const login = async (token: string) => {
  try {
    const result = await axiosInstance.post(
      `/auth/log-in`,
      {},
      {
        headers: {
          gid: token
        }
      }
    )
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getInformation = async () => {
  try {
    const result = await axiosInstance.get(`/auth/me`)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const refreshToken = async () => {
  try {
    const result = await axiosInstance.post(`/auth/refresh`)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const logout = async () => {
  try {
    const result = await axiosInstance.post(`/auth/log-out`)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}
