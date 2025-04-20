import { lazy, Suspense } from 'react'
import Loading from '../../../components/loading'

const AssessmentAttendance = lazy(
  () => import('../../../components/assessments/attendance')
)

function TakeAssessment() {
  return (
    <Suspense fallback={<Loading />}>
      <AssessmentAttendance />
    </Suspense>
  )
}

export default TakeAssessment
