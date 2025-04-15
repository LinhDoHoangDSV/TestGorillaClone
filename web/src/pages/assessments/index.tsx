import { lazy, Suspense } from 'react'
import Loading from '../../components/loading'

const TestInfo = lazy(() => import('../../components/assessments/test-info'))

const Assessments = () => {
  return (
    <Suspense fallback={<Loading />}>
      <TestInfo />
    </Suspense>
  )
}

export default Assessments
