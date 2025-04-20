import { lazy, Suspense } from 'react'
import Loading from '../../components/loading'

const CandidatesComp = lazy(
  () => import('../../components/candidates/candidates')
)

const Candidates = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CandidatesComp />
    </Suspense>
  )
}

export default Candidates
