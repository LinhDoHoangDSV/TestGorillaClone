import { lazy, Suspense, useState } from 'react'
import Loading from '../../../components/loading'

const Header = lazy(() => import('../../../components/assessments/new/header'))
const Content = lazy(
  () => import('../../../components/assessments/new/content')
)

const AssessmentsNew = () => {
  const [title, setTitle] = useState<string>('Your new test')

  return (
    <Suspense fallback={<Loading />}>
      <div>
        <Header title={title} setTitle={setTitle} />
        <Content title={title} />
      </div>
    </Suspense>
  )
}

export default AssessmentsNew
