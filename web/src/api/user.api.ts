import axiosInstance from './axios.instance'

export interface UserInformation {
  email: string
  first_name: string
  last_name: string
  phone_number: string
}

export const updateUserInformation = async (data: UserInformation) => {
  try {
    const result = await axiosInstance.patch('/users/update', data)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}
