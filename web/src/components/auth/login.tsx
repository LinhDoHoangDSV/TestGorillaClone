import { useEffect, useState } from 'react'
import styles from '../../style/components/auth/login.module.scss'
import logoImage from '../../assets/logo.svg'
import { useGoogleLogin } from '@react-oauth/google'
import { getInformation, login, refreshToken } from '../../api/auth.api'
import { useDispatch, useSelector } from 'react-redux'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../redux/slices/common.slice'
import { useNavigate } from 'react-router-dom'
import { setIsAuthen } from '../../redux/slices/user.slice'
import { RootState } from '../../redux/store'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthen = useSelector((state: RootState) => {
    return state.user.isAuthen
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthen) navigate('/')
  }, [isAuthen, navigate])

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      dispatch(setIsLoadingTrue())
      const result = await login(tokenResponse.access_token)

      if (result?.status > 299) {
        dispatch(
          setToasterAppear({ message: 'Login Fail. Try again', type: 'error' })
        )
        return
      }

      dispatch(setIsAuthen({ value: true }))
      dispatch(setIsLoadingFalse())
    }
  })

  return (
    <div className={styles.login}>
      <div className={styles.login__container}>
        <div className={styles.login__header}>
          <img
            src={logoImage || '/placeholder.svg'}
            alt='Company Logo'
            className={styles.login__logo}
          />
          <h1 className={styles.login__title}>We're glad to see you again</h1>
        </div>

        <div className={styles.login__content}>
          <button
            className={styles.login__googleButton}
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg
              className={styles.login__googleIcon}
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 488 512'
            >
              <path d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z' />
            </svg>
            <span className={styles.login__googleText}>
              {isLoading ? 'Connecting...' : 'Continue with Google'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
