import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import styles from '../../style/components/candidates/candidates.module.scss'
import { CandidateEntity, TestResponse } from '../../constant/common'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../redux/slices/common.slice'
import { getAllOwnTests } from '../../api/tests.api'
import { getAllTestAssignmentByCriteria } from '../../api/test-assignment.api'

const CandidatesComponent = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState<CandidateEntity[]>([])
  const [tests, setTests] = useState<TestResponse[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTest, setSelectedTest] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        dispatch(setIsLoadingTrue())

        const res = await getAllOwnTests()
        if (res?.status > 299) throw new Error('Failed to get tests')

        const tempTests: TestResponse[] = res?.data?.data || []
        setTests(tempTests)

        const allAssignments: CandidateEntity[] = []
        for (const t of tempTests) {
          const assignRes = await getAllTestAssignmentByCriteria({
            test_id: t.id
          })
          if (assignRes?.status > 299) continue

          const formatted = (assignRes?.data?.data || []).map((a: any) => ({
            id: a.id,
            candidate_email: a.candidate_email || '',
            testTitle: t.title || '',
            score: a.score,
            status: a.status,
            completed_time: a.completed_time
          }))
          allAssignments.push(...formatted)
        }
        setCandidates(allAssignments)
      } catch {
        setError('Failed to load candidates data')
        dispatch(
          setToasterAppear({
            message: 'Error loading candidates data',
            type: 'error'
          })
        )
      } finally {
        setIsLoading(false)
        dispatch(setIsLoadingFalse())
      }
    })()
  }, [dispatch])

  const filtered = candidates.filter(
    (c) =>
      c.candidate_email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!selectedTest || c.testTitle === selectedTest)
  )

  const changeStatus = (s: string) =>
    s === 'completed'
      ? 'Completed'
      : s === 'in_progress'
        ? 'In progress'
        : 'Not started'

  const handleClickRow = (c: CandidateEntity) => {
    if (c.status !== 'completed') {
      dispatch(
        setToasterAppear({
          message: 'Can not grade an uncompleted assessment',
          type: 'error'
        })
      )
      return
    }
    navigate(`/assessments/grade/${c.id * 300003 + 200003}`)
  }

  if (error)
    return (
      <div className={styles.candidates}>
        <div className={styles.candidates__container}>
          <p className={styles.candidates__error}>Error: {error}</p>
          <button
            className={styles.candidates__button}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    )

  return (
    <div className={styles.candidates}>
      <div className={styles.candidates__container}>
        {/* header */}
        <div className={styles.candidates__header}>
          <h1 className={styles.candidates__title}>Candidates</h1>
          <button
            className={styles.candidates__button}
            onClick={() => navigate('/assessments/new')}
            disabled={isLoading}
          >
            <span className={styles['candidates__button-icon']}>+</span>
            Create assessment
          </button>
        </div>

        <div className={styles.candidates__filters}>
          <div className={styles['candidates__search-container']}>
            <input
              type='text'
              className={styles['candidates__search-input']}
              placeholder='Search candidates by email'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.candidates__dropdowns}>
            <select
              className={styles.candidates__select}
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              disabled={isLoading || tests.length === 0}
            >
              <option value=''>All Tests</option>
              {tests.map((t) => (
                <option key={t.id} value={t.title}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles['candidates__table-container']}>
        {isLoading ? (
          <div className={styles.candidates__loading}>
            Loading candidates...
          </div>
        ) : filtered.length ? (
          <table className={styles.candidates__table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Test Title</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  className={styles.candidates__row}
                  onClick={() => handleClickRow(c)}
                >
                  <td>{i + 1}</td>
                  <td>{c.candidate_email}</td>
                  <td>{c.testTitle}</td>
                  <td>{c.score ?? 'N/A'}</td>
                  <td>{changeStatus(c.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.candidates__empty}>
            <p className={styles['candidates__empty--text']}>
              {candidates.length === 0
                ? "You don't have any candidates yet."
                : 'No candidates match your search criteria.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CandidatesComponent
