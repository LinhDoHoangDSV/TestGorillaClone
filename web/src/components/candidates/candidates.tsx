import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../style/components/candidates/candidates.module.scss'
import { TestResponse } from '../../constant/common'
import { useDispatch } from 'react-redux'
import {
  setActiveState,
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../redux/slices/common.slice'
import { getAllOwnTests } from '../../api/tests.api'
import { getAllTestAssignmentByCriteria } from '../../api/test-assignment.api'

interface CandidateEntity {
  id: number
  candidate_email: string
  testTitle: string
  score: number | null
  status: string
  completed_time?: string
}

const CandidatesComponent = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState<CandidateEntity[]>([])
  const [tests, setTests] = useState<TestResponse[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedTest, setSelectedTest] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        dispatch(setIsLoadingTrue())

        const testResponse = await getAllOwnTests()

        if (testResponse?.status > 299) {
          throw new Error('Failed to get tests')
        }

        const tempTests = testResponse?.data?.data || []
        setTests(tempTests)

        const allTestAssignments: CandidateEntity[] = []

        for (const test of tempTests) {
          const assignmentsResponse = await getAllTestAssignmentByCriteria({
            test_id: test?.id
          })

          if (assignmentsResponse?.status > 299) {
            continue
          }

          const assignments = assignmentsResponse?.data?.data || []
          const formattedAssignments = assignments.map((assignment: any) => ({
            id: assignment.id,
            candidate_email: assignment.candidate_email || '',
            testTitle: test.title || '',
            score: assignment.score,
            status: assignment.status,
            completed_time: assignment.completed_time
          }))

          allTestAssignments.push(...formattedAssignments)
        }

        setCandidates(allTestAssignments)
      } catch (err) {
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
    }

    fetchData()
  }, [dispatch])

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.candidate_email
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      (!selectedTest || candidate.testTitle === selectedTest)
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCreateAssessment = () => {
    dispatch(setActiveState({ Value: 1 }))
    navigate('/assessments/new')
  }

  if (error) {
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
  }

  const handleClickRow = (candidate) => {
    if (candidate?.status !== 'completed') {
      dispatch(
        setToasterAppear({
          message: 'Can not grade an uncompleted assessment',
          type: 'error'
        })
      )
      return
    }
    dispatch(setActiveState({ value: 1 }))
    navigate(`/assessments/grade/${candidate.id * 300003 + 200003}`)
  }

  const changeStatus = (assessStatus: string) => {
    if (assessStatus === 'completed') return 'Completed'
    else if (assessStatus === 'in_progress') return 'In progress'
    else return 'Not started'
  }

  return (
    <div className={styles.candidates}>
      <div className={styles.candidates__container}>
        <div className={styles.candidates__header}>
          <h1 className={styles.candidates__title}>Candidates</h1>
          <button
            className={styles.candidates__button}
            onClick={handleCreateAssessment}
            disabled={isLoading}
          >
            <span className={styles.candidates__buttonIcon}>+</span>
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
              onChange={handleSearchChange}
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
              {tests.map((test) => (
                <option key={test.id} value={test.title}>
                  {test.title}
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
        ) : filteredCandidates.length > 0 ? (
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
              {filteredCandidates.map((candidate, index) => (
                <tr
                  key={candidate.id}
                  className={styles.candidates__row}
                  onClick={() => handleClickRow(candidate)}
                >
                  <td>{index + 1}</td>
                  <td>{candidate.candidate_email}</td>
                  <td>{candidate.testTitle}</td>
                  <td>{candidate.score ?? 'N/A'}</td>
                  <td>{changeStatus(candidate.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.candidates__empty}>
            <p className={styles.candidates__emptyText}>
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
