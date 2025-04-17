import { lazy, Suspense } from 'react'
import Loading from '../../components/loading'

const AssessmentsComponent = lazy(
  () => import('../../components/assessments/index')
)

const Assessment = () => {
  return (
    <Suspense fallback={<Loading />}>
      <AssessmentsComponent />
    </Suspense>
  )
}

export default Assessment
