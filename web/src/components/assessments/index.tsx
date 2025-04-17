import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import type { TestEntity } from '../../constant/common'
import { getAllTests } from '../../api/tests.api'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../redux/slices/common.slice'
import styles from '../../style/components/assessments/assessment-comp.module.scss'

const AssessmentsComponent = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [tests, setTests] = useState<TestEntity[]>([])

  useEffect(() => {
    const firstFetch = async () => {
      dispatch(setIsLoadingTrue())
      const result = await getAllTests()

      if (result?.status > 299) {
        dispatch(
          setToasterAppear({
            message: 'Error while finding tests',
            type: 'error'
          })
        )
        return
      }

      setTests(result?.data?.data)
      dispatch(
        setToasterAppear({
          message: 'Get all tests successfully',
          type: 'success'
        })
      )
      dispatch(setIsLoadingFalse())
    }

    firstFetch()
  }, [])

  const handleNavigate = (id: number) => {
    navigate(`/assessments/${id * 300003 + 200003}`)
  }

  return (
    <div className={styles.assessments}>
      <div className={styles.assessments__container}>
        <div className={styles.assessments__header}>
          <h1 className={styles.assessments__title}>Assessments</h1>
          <button
            className={styles.assessments__button}
            onClick={() => navigate('/assessments/new')}
          >
            <span className={styles.assessments__buttonIcon}>+</span>
            Create assessment
          </button>
        </div>
      </div>

      <div className={styles['assessments__table-container']}>
        <table className={styles.assessments__table}>
          <thead>
            <tr>
              <th>Index</th>
              <th>Name</th>
              <th>Total Time</th>
              <th>Public</th>
            </tr>
          </thead>
          <tbody>
            {tests.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.assessments__emptyMessage}>
                  You have no test.
                </td>
              </tr>
            )}
            {tests.map((test, index) => (
              <tr
                key={index}
                className={styles.assessments__row}
                onClick={() => handleNavigate(test.id)}
              >
                <td>{index}</td>
                <td>{test.title}</td>
                <td>{test.test_time}</td>
                <td>{test.is_publish ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AssessmentsComponent
