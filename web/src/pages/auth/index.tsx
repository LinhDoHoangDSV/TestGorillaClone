import { lazy, Suspense } from 'react'
import Loading from '../../components/loading'

const LoginComp = lazy(() => import('../../components/auth/login'))

const LoginPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <LoginComp />
    </Suspense>
  )
}

export default LoginPage
