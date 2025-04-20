import { FC, useEffect, useState } from 'react'
import style from '../../style/components/test-card.module.scss'
import Button from '../ui/button'
import { getAllTestsByCriteria } from '../../api/tests.api'
import { useDispatch } from 'react-redux'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../redux/slices/common.slice'
import { TestCriteria } from '../../constant/api'
import { useNavigate } from 'react-router-dom'
import { TestEntity } from '../../constant/common'

const TestCard: FC = () => {
  const [tests, setAllTests] = useState<TestEntity[]>([])
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    async function firstFetch() {
      dispatch(setIsLoadingTrue())

      const criterias: TestCriteria = {
        is_publish: true,
        limit: 9
      }
      const result: any = await getAllTestsByCriteria(criterias)

      if (result?.status > 299) {
        dispatch(
          setToasterAppear({
            message: 'Error while getting all the public tests',
            type: 'error'
          })
        )
        return
      }

      setAllTests(result?.data?.data)

      dispatch(
        setToasterAppear({
          message: 'Getting public tests successfully',
          type: 'success'
        })
      )
      dispatch(setIsLoadingFalse())
    }

    firstFetch()
  }, [])

  const handleView = (test) => {
    navigate(`/assessments/view/${300003 * test.id + 200003}`)
  }

  return (
    <div className={style.wrapper}>
      {tests.map((test: TestEntity, index) => {
        return (
          <div className={style.card} key={index}>
            <div className={style.card__title}>{test?.title}</div>
            <div className={style.card__description}>{test?.description}</div>
            <div className={style.card__footer}>
              <Button variant='primary' onClick={() => handleView(test)}>
                View test
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TestCard
