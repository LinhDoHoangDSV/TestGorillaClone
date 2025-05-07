import axiosInstance from './axios.instance'

export const getUserStatistics = async () => {
  try {
    const result = await axiosInstance.get('/statistics/one/own')
    return result
  } catch (error) {
    return error
  }
}
