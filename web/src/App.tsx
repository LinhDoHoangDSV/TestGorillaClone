import { useLocation } from 'react-router-dom'
import Router from './pages/router'
import pagesData from './pages/page-data'

import { useSelector } from 'react-redux'
import { RootState } from './redux/store'
import Loading from './components/loading'
import Toaster from './components/ui/toast'

function App() {
  const location = useLocation()
  const findPage = pagesData.find((route) => route.path === location.pathname)
  const isLoading = useSelector((state: RootState) => state.common.isLoading)
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
