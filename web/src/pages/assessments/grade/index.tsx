import { lazy, Suspense } from 'react'
import Loading from '../../../components/loading'

const AssessmentsGrading = lazy(
  () => import('../../../components/assessments/grade/assess-grade')
)
const AssessmentGrade = () => {
  return (
    <Suspense fallback={<Loading />}>
      <AssessmentsGrading />
    </Suspense>
  )
}

export default AssessmentGrade
