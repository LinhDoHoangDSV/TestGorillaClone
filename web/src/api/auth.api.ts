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
    return result
  } catch (error) {
    return error
  }
}

export const getInformation = async () => {
  try {
    const result = await axiosInstance.get(`/auth/me`)
    return result
  } catch (error) {
    return error
  }
}

export const refreshToken = async () => {
  try {
    const result = await axiosInstance.post(`/auth/refresh`)
    return result
  } catch (error) {
    return error
  }
}

export const logout = async () => {
  try {
    const result = await axiosInstance.post(`/auth/log-out`)
    return result
  } catch (error) {
    return error
  }
}
