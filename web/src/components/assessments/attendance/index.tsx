import { useEffect, useState } from 'react'
import TestTaker from './test-taker'
import CodeAuthentication from './code-authen'
import { TestAssignmentResponse, TestResponse } from '../../../constant/common'
import styles from '../../../style/components/assessments/attendance/index.module.scss'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../../redux/slices/common.slice'
import {
  completeAssessment,
  getTestAssignmentById,
  startAssessment,
  updateTestAssignment
} from '../../../api/test-assignment.api'
import { getTestById } from '../../../api/tests.api'
import { getAllQuestionsByCriteria } from '../../../api/questions.api'
import { getAllAnswerByCriteria } from '../../../api/answers.api'
import { findInitialCodeByCriteria } from '../../../api/initial-code.api'
import { findTestCaseByCriteria } from '../../../api/test-case.api'

function TakeAssessmentComp() {
  const location = useLocation()
  const dispatch = useDispatch()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [testAssessment, setTestAssessment] = useState<TestAssignmentResponse>()
  const [validPath, setValidPath] = useState<boolean>(true)
  const [testTitle, setTestTitle] = useState<string>('')
  const [test, setTest] = useState<TestResponse | null>(null)
  const [seconds, setSeconds] = useState<number>(2)
  const [startTime, setStartTime] = useState<Date>()

  // Effect to get data
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
        } else if (questions[index].question_type === 'coding') {
          const initialCode = await findInitialCodeByCriteria({
            question_id: questions[index].id
          })
          questions[index].initial_code = initialCode?.data?.data[0]
          const testcases = await findTestCaseByCriteria({
            question_id: questions[index].id
          })
          questions[index].testcases = testcases?.data?.data
        }
      }

      setTest({ ...existingTest?.data?.data, questions })
      dispatch(setIsLoadingFalse())
    }

    firstFetch()
  }, [location.pathname, dispatch])

  // Timer
  useEffect(() => {
    if (
      !isAuthenticated ||
      testCompleted ||
      testAssessment?.status === 'completed'
    ) {
      return
    }

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleTestComplete('timeout')
          return 0
        }
        return (
          test?.test_time * 60 -
          (new Date() - new Date(startTime)) / 1000
        ).toFixed()
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isAuthenticated, testCompleted, testAssessment?.status])

  // Screen
  useEffect(() => {
    if (
      !isAuthenticated ||
      testCompleted ||
      testAssessment?.status === 'completed'
    ) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
      return
    }

    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen()
        }
      } catch (err) {
        dispatch(
          setToasterAppear({
            message: 'Can not open fullscreen',
            type: 'error'
          })
        )
      }
    }

    enterFullscreen()

    const handleFullscreenChange = async () => {
      if (
        !document.fullscreenElement &&
        !testCompleted &&
        testAssessment?.status !== 'completed'
      ) {
        dispatch(
          setToasterAppear({
            message: 'Thank you for taking the test',
            type: 'info'
          })
        )
        await handleTestComplete()
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [isAuthenticated, testCompleted, testAssessment?.status, dispatch])

  const handleAuthenticated = async (code: string) => {
    if (code !== testAssessment?.code) {
      dispatch(
        setToasterAppear({
          message: 'Invalid access code. Try again!',
          type: 'error'
        })
      )
      return
    }

    if (testAssessment?.status === 'completed') {
      dispatch(
        setToasterAppear({
          message: 'You have completed the test',
          type: 'error'
        })
      )
      return
    }

    const secondsTime = test?.test_time * 60

    if (
      testAssessment?.status === 'in_progress' &&
      new Date() - testAssessment?.started_at > secondsTime * 1000
    ) {
      dispatch(
        setToasterAppear({
          message: 'No time left to do the test',
          type: 'error'
        })
      )
      return
    }

    dispatch(setIsLoadingTrue())

    setSeconds(
      testAssessment?.status === 'not_started'
        ? secondsTime
        : secondsTime - (new Date() - testAssessment?.started_at) / 1000
    )

    if (testAssessment?.status === 'not_started') {
      await updateTestAssignment(
        { status: 'in_progress', started_at: new Date(), is_online: true },
        testAssessment?.id
      )
    }

    setStartTime(testAssessment?.started_at ?? new Date())
    await startAssessment(testAssessment?.id)

    dispatch(setIsLoadingFalse())
    setIsAuthenticated(true)
  }

  const handleTestComplete = async (status?: string) => {
    dispatch(setIsLoadingTrue())
    if (status !== 'timeout') {
      await completeAssessment(testAssessment?.id)
    }
    setTestCompleted(true)
    dispatch(setIsLoadingFalse())
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

  if (testCompleted || testAssessment?.status === 'completed') {
    return (
      <div className={styles.app}>
        <div className={styles.app__completed}>
          <h1>Test Completed!</h1>
          <p>Thank you for completing the test.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <TestTaker
        seconds={seconds}
        test={test}
        onComplete={handleTestComplete}
        testAssignmentId={testAssessment?.id}
      />
    </div>
  )
}

export default TakeAssessmentComp
