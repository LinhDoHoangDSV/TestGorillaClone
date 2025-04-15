import { lazy, Suspense, useState } from 'react'
import styles from '../../../style/pages/new-assessment.module.scss'
import Loading from '../../../components/loading'

const Header = lazy(() => import('../../../components/assessments/new/header'))
const Content = lazy(
  () => import('../../../components/assessments/new/content')
)

const AssessmentsNew = () => {
  const [title, setTitle] = useState<string>('Your new test')

  return (
    <Suspense fallback={<Loading />}>
      <div className={styles['assessments-new']}>
        <Header title={title} setTitle={setTitle} />
        <Content title={title} />
      </div>
    </Suspense>
  )
}

export default AssessmentsNew
