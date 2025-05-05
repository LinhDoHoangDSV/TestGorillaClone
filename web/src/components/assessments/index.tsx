import { useNavigate } from 'react-router-dom'
import { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import type { TestEntity } from '../../constant/common'
import { getAllOwnTests } from '../../api/tests.api'
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
  const [filterTitle, setFilterTitle] = useState('')

  useEffect(() => {
    ;(async () => {
      dispatch(setIsLoadingTrue())
      const res = await getAllOwnTests()

      if (res?.status > 299) {
        dispatch(
          setToasterAppear({
            message: 'Error while finding tests',
            type: 'error'
          })
        )
        return
      }

      setTests(res?.data?.data)
      dispatch(
        setToasterAppear({
          message: 'Get all tests successfully',
          type: 'success'
        })
      )
      dispatch(setIsLoadingFalse())
    })()
  }, [])

  const handleNavigate = (id: number) => {
    navigate(`/assessments/${id * 300003 + 200003}`)
  }

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterTitle(e.target.value)
  }

  const filteredTests = tests.filter((t) =>
    t.title.toLowerCase().includes(filterTitle.toLowerCase())
  )

  return (
    <div className={styles.assessments}>
      <div className={styles.assessments__container}>
        {/* header */}
        <div className={styles.assessments__header}>
          <h1 className={styles.assessments__title}>Assessments</h1>
          <button
            className={styles.assessments__button}
            onClick={() => navigate('/assessments/new')}
          >
            <span className={styles['assessments__button-icon']}>+</span>
            Create assessment
          </button>
        </div>

        {/* search */}
        <div className={styles.assessments__filter}>
          <input
            type='text'
            className={styles['assessments__filter-input']}
            placeholder='Search by test title...'
            value={filterTitle}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* table */}
      <div className={styles['assessments__table-container']}>
        <table className={styles.assessments__table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Total Time</th>
              <th>Public</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className={styles['assessments__empty-message']}
                >
                  {tests.length === 0
                    ? 'You have no test.'
                    : 'No tests match your search.'}
                </td>
              </tr>
            )}

            {filteredTests.map((test, idx) => (
              <tr
                key={test.id}
                className={styles.assessments__row}
                onClick={() => handleNavigate(test.id)}
              >
                <td>{idx + 1}</td>
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
