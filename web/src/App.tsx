import { useLocation } from 'react-router-dom'
import Router from './pages/router'
import pagesData from './pages/page-data'

import { useSelector } from 'react-redux'
import { RootState } from './redux/store'
import Loading from './components/loading'

function App() {
  const location = useLocation()
  const findPage = pagesData.find((route) => route.path === location.pathname)
  const isLoading = useSelector((state: RootState) => state.common.isLoading)

  return (
    <>
      {findPage?.header}
      <Router />
      {findPage?.footer}
      {isLoading && <Loading />}
    </>
  )
}

export default App
