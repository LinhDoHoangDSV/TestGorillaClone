import { lazy, Suspense } from 'react'
import Loading from '../components/loading'
import style from '../style/pages/home.module.scss'

const Dashboard = lazy(() => import('../components/home/dash-board'))
const TestCard = lazy(() => import('../components/home/test-card'))

const Home = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
      <div className={style['home__test-card']}>
        <div className={style['home__test-card-wrapper']}>
          <div className={style['home__test-card-title']}>
            Discover more tests
          </div>
          <div className={style['home__test-card-line']}></div>
        </div>

        <TestCard id={1} description='I dont know' title='hihi' />
      </div>
    </Suspense>
  )
}

export default Home
