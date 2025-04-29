import axios from 'axios'
import { store } from '../redux/store'
import { clearAuth } from '../redux/slices/user.slice'
import { serverBaseUrl } from '../constant/api'
import { setToasterAppear } from '../redux/slices/common.slice'

const axiosInstance = axios.create({
  baseURL: `${import.meta.env[`${serverBaseUrl}`]}`,
  withCredentials: true
})

let isRefreshing: boolean = false
let refreshSubscribers = []

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken))
  refreshSubscribers = []
}

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback)
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest?.sent) {
      originalRequest.sent = true

      if (!isRefreshing) {
        isRefreshing = true

        try {
          const result = await axiosInstance.post(`/auth/refresh`)
          console.log('resu', result)

          if (
            result?.status > 299 &&
            window.location.href !== 'http://localhost:3000/login'
          ) {
            store.dispatch(
              setToasterAppear({
                message: 'You need to log in to continue',
                type: 'error'
              })
            )
            window.location.href = '/login'
          }

          isRefreshing = false
          onRefreshed('new-token')
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          console.log('refresh')

          isRefreshing = false
          refreshSubscribers = []
          store.dispatch(clearAuth())

          if (window.location.href !== 'http://localhost:3000/login') {
            store.dispatch(
              setToasterAppear({
                message: 'You need to log in to continue',
                type: 'error'
              })
            )
            window.location.href = '/login'
          }
          return Promise.reject(refreshError)
        }
      } else {
        return new Promise((resolve) => {
          console.log('Queueing request:', originalRequest.url)
          subscribeTokenRefresh(() => {
            resolve(axiosInstance(originalRequest))
          })
        })
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
