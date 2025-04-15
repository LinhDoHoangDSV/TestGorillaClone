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

const TestCard: FC = () => {
  const [tests, setAllTests] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    async function firstFetch() {
      dispatch(setIsLoadingTrue())

      const criterias: TestCriteria = {
        is_publish: true
      }
      const result = await getAllTestsByCriteria(criterias)

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

  const handleView = () => {}
  const handleClone = () => {}

  return (
    <div className={style.wrapper}>
      {tests.map((test, index) => {
        return (
          <div className={style.card} key={index}>
            <div className={style.card__title}>{test?.title}</div>
            <div className={style.card__description}>{test?.description}</div>
            <div className={style.card__footer}>
              <Button variant='primary' onClick={handleView}>
                View test
              </Button>
              <Button variant='primary' onClick={handleClone}>
                Clone test
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TestCard
