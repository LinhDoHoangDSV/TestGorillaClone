import { lazy, Suspense, useEffect, useState } from 'react'
import Loading from '../../components/loading'
import { useLocation } from 'react-router-dom'

const TestInfo = lazy(() => import('../../components/assessments/test-info'))

const Assessment = () => {
  const location = useLocation()
  const [idAssess, setIdAssess] = useState<number>(0)
  const [type, setType] = useState<string>('')

  useEffect(() => {
    let index = ''
    if (location.pathname.includes('/view/')) {
      index = location.pathname.slice(18)
      setType('view')
    } else {
      index = location.pathname.slice(13)
      setType('own')
    }

    if (!+index) return
    const exactId = +index - 200003
    if (exactId <= 0 || exactId % 300003 !== 0) return

    setIdAssess(exactId / 300003)
  }, [location.pathname])

  if (!idAssess) {
    return <div>Page not Found</div>
  }

  return (
    <Suspense fallback={<Loading />}>
      <TestInfo testId={idAssess} type={type} />
    </Suspense>
  )
}

export default Assessment
