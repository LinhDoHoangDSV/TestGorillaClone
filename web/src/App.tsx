import { matchPath, useLocation } from 'react-router-dom'
import Router from './pages/router'
import pagesData from './pages/page-data'

import { useSelector } from 'react-redux'
import { RootState } from './redux/store'
import Loading from './components/loading'
import Toaster from './components/ui/toast'
import { useMemo } from 'react'

function App() {
  const location = useLocation()
  const findPage = useMemo(() => {
    return pagesData.find((route) => {
      const match = matchPath({ path: route.path }, location.pathname)
      return match !== null
    })
  }, [location.pathname])
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
