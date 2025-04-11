import { lazy, Suspense } from 'react'
import Loading from '../components/loading'

const Dashboard = lazy(() => import('../components/home/dash-board'))

const Home = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  )
}

export default Home
