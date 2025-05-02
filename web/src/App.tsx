import { matchPath, useLocation } from 'react-router-dom'
import Router from './pages/router'
import pagesData from './pages/page-data'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './redux/store'
import Loading from './components/loading'
import Toaster from './components/ui/toast'
import { useEffect, useMemo } from 'react'
import { setActiveState, setToasterAppear } from './redux/slices/common.slice'
import { setInitialState, setIsAuthen } from './redux/slices/user.slice'
import { getInformation } from './api/auth.api'

function App() {
  const location = useLocation()
  const dispatch = useDispatch()
  const findPage = useMemo(() => {
    return pagesData.find((route) => {
      const match = matchPath({ path: route.path }, location.pathname)
      return match !== null
    })
  }, [location.pathname])
  const isAuthen = useSelector((state: RootState) => {
    return state.user.isAuthen
  })
  const isLoading = useSelector((state: RootState) => {
    return state.common.isLoading
  })
  const toaster: boolean = useSelector(
    (state: RootState) => state.common.toaster
  )
  const toasterMessage: string = useSelector(
    (state: RootState) => state.common.toasterMessage
  )
  const toasterType: string = useSelector(
    (state: RootState) => state.common.toasterType
  )

  useEffect(() => {
    const checkAuth = async () => {
      const userInformation = await getInformation()

      if (userInformation?.status > 299 && window.location.href !== '/login') {
        dispatch(setIsAuthen({ value: false }))
        return
      }

      dispatch(setIsAuthen({ value: true }))
      const data = userInformation?.data?.data

      dispatch(
        setInitialState({
          email: data?.email,
          id: data?.id,
          first_name: data?.first_name,
          last_name: data?.last_name,
          role_id: data?.role_id,
          phone_number: data?.phone_number
        })
      )
    }

    if (!isAuthen && !location.pathname.includes('assessments/attendance')) {
      checkAuth()
    }
  }, [isAuthen])

  useEffect(() => {
    if (location.pathname.includes('assessments'))
      dispatch(setActiveState({ value: 1 }))
    else if (location.pathname.includes('candidates'))
      dispatch(setActiveState({ value: 2 }))
    else if (location.pathname === '/') dispatch(setActiveState({ value: 0 }))
  }, [location.pathname])

  return (
    <>
      {findPage?.header}
      <Router />
      {findPage?.footer}
      {isLoading && <Loading />}
      {toaster && <Toaster message={toasterMessage} type={toasterType} />}
    </>
  )
}

export default App
