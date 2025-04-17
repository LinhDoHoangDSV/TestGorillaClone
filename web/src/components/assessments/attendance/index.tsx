import { useEffect, useState } from 'react'
import TestTaker from './test-taker'
import CodeAuthentication from './code-authen'
import {
  sampleTest,
  TestAssignmentResponse,
  TestResponse
} from '../../../constant/common'
import styles from '../../../style/components/assessments/attendance/index.module.scss'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../../redux/slices/common.slice'
import { getTestAssignmentById } from '../../../api/test-assignment.api'
import { getTestById } from '../../../api/tests.api'
import { getAllQuestionsByCriteria } from '../../../api/questions.api'
import { getAllAnswerByCriteria } from '../../../api/answers.api'

function TakeAssessmentComp() {
  const location = useLocation()
  const dispatch = useDispatch()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [testAssessment, setTestAssessment] = useState<TestAssignmentResponse>()
  const [validPath, setValidPath] = useState<boolean>(true)
  const [testTitle, setTestTitle] = useState<string>('')
  const [test, setTest] = useState<TestResponse | null>(null)

  useEffect(() => {
    const firstFetch = async () => {
      const path = location.pathname.slice(24)

      if (!+path) {
        dispatch(setToasterAppear({ message: 'url is invalid', type: 'error' }))
        setValidPath(false)
        return
      }

      const id = +path - 200003

      if (id < 0 || id % 300003) {
        dispatch(setToasterAppear({ message: 'url is invalid', type: 'error' }))
        setValidPath(false)
        return
      }

      dispatch(setIsLoadingTrue())

      const result = await getTestAssignmentById(id / 300003)

      if (result?.status > 299) {
        dispatch(
          setToasterAppear({
            message: 'Error while getting test information',
            type: 'error'
          })
        )
        setValidPath(false)
        return
      }

      setTestAssessment(result?.data?.data)

      const existingTest = await getTestById(result?.data?.data?.test_id)

      if (existingTest?.status > 299) {
        dispatch(
          setToasterAppear({
            message: 'Error while getting test information',
            type: 'error'
          })
        )
        return
      }

      setTestTitle(existingTest?.data?.data?.title)

      dispatch(setIsLoadingFalse())

      const questionsByTest = await getAllQuestionsByCriteria({
        test_id: result?.data?.data?.test_id
      })

      if (questionsByTest?.status > 299) {
        dispatch(
          setToasterAppear({
            message: 'Error while getting test information',
            type: 'error'
          })
        )
        return
      }

      const questions = questionsByTest?.data?.data

      for (const index in questions) {
        if (questions[index].question_type === 'multiple_choice') {
          const answers = await getAllAnswerByCriteria({
            question_id: questions[index].id
          })

          if (answers?.status > 299) {
            dispatch(
              setToasterAppear({
                message: 'Error while getting test information',
                type: 'error'
              })
            )
            return
          }

          questions[index].answers = answers?.data?.data
        }
      }

      setTest({ ...existingTest?.data?.data, questions })
    }

    firstFetch()
  }, [location.pathname])

  const handleAuthenticated = (code: string) => {
    if (code !== testAssessment?.code) {
      dispatch(
        setToasterAppear({
          message: 'Invalid access code. Try again!',
          type: 'error'
        })
      )
      return
    }
    setIsAuthenticated(true)
  }

  const handleTestComplete = (testAnswers: Record<string, string>) => {
    setAnswers(testAnswers)
    setTestCompleted(true)
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.app}>
        <CodeAuthentication
          testTitle={testTitle}
          onAuthenticated={handleAuthenticated}
        />
      </div>
    )
  }

  if (!validPath) {
    return <div>Not Found</div>
  }

  if (testCompleted) {
    return (
      <div className={styles.app}>
        <div className={styles.app__completed}>
          <h1>Test Completed!</h1>
          <p>Thank you for completing the test.</p>
          <div className={styles.app__answers}>
            <h2>Your Answers:</h2>
            {Object.entries(answers).map(([questionId, answer]) => {
              const question = sampleTest.questions.find(
                (q) => q.id === questionId
              )
              return (
                <div key={questionId} className={styles.app__answer}>
                  <h3>{question?.text}</h3>
                  {question?.type === 'multiple_choice' ? (
                    <p>
                      Selected:{' '}
                      {question.options?.find((opt) => opt.id === answer)
                        ?.text || 'No answer'}
                    </p>
                  ) : (
                    <p className={styles.app__essayAnswer}>
                      {answer || 'No answer'}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <TestTaker
        test={test}
        onComplete={handleTestComplete}
        testAssignmentId={testAssessment?.id}
      />
    </div>
  )
}

export default TakeAssessmentComp
