import pageDatas from './page-data'
import { RouterType } from '../constant/common'
import { Route, Routes } from 'react-router-dom'

const Router = () => {
  const pageRouter = pageDatas.map(({ title, path, element }: RouterType) => {
    return <Route key={title} path={path} element={element} />
  })

  return <Routes>{pageRouter}</Routes>
}

export default Router
