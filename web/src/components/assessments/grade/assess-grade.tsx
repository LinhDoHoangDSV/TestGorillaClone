import { useState, useEffect } from 'react'
import styles from '../../../style/components/assessments/grade/assess-grade.module.scss'
import GradeMultiple from './grade-multiple'
import GradeEssay from './grade-essay'
import { useDispatch } from 'react-redux'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../../redux/slices/common.slice'
import {
  getTestAssignmentById,
  increaseScoreTestAssignment
} from '../../../api/test-assignment.api'
import { getAllQuestionsByCriteria } from '../../../api/questions.api'
import {
  getUserAnswerByCriterias,
  updateUserAnswer
} from '../../../api/user-answers.api'
import { getAllAnswerByCriteria } from '../../../api/answers.api'
import { useLocation, useNavigate } from 'react-router-dom'
import GradeCoding from './grade-coding'
import { CandidateAnswer, QuesionsInterface } from '../../../constant/common'
import Button from '../../ui/button'

const EssayGrading = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<QuesionsInterface[]>([])
  const [isCorrectId, setIsCorrectId] = useState<boolean>(true)
  const [marks, setMarks] = useState<CandidateAnswer>([])
  const [currentMarks, setCurrentMarks] = useState<CandidateAnswer>([])
  const [reloadTable, setReloadTable] = useState<boolean>(false)
  const [testAssignmentId, setTestAssignmentId] = useState<number>(0)

  useEffect(() => {
    const firstFetch = async () => {
      const path = location.pathname.slice(19)

      const id = +path

      if (!path) {
        setIsCorrectId(false)
        return
      }

      if (path - 200003 < 0 || (path - 200003) % 300003 !== 0) {
        setIsCorrectId(false)
        return
      }

      const testId = (id - 200003) / 300003

      dispatch(setIsLoadingTrue())
      setTestAssignmentId(testId)
      const testAssignment = await getTestAssignmentById(testId)

      if (testAssignment?.status > 299) {
        setIsCorrectId(false)
        dispatch(
          setToasterAppear({
            message: 'Error while getting test',
            type: 'error'
          })
        )
        return
      }

      const questionsByTestId = await getAllQuestionsByCriteria({
        test_id: testAssignment?.data?.data?.test_id
      })

      const allQuestions = questionsByTestId?.data?.data

      for (const oneQuestion of allQuestions) {
        const userAnswer = await getUserAnswerByCriterias({
          question_id: oneQuestion?.id,
          test_assignment_id: testAssignment?.data?.data?.id
        })

        oneQuestion.candidate_answer = userAnswer?.data?.data[0] ?? null

        if (oneQuestion.question_type === 'multiple_choice') {
          const questionAnswers = await getAllAnswerByCriteria({
            question_id: oneQuestion?.id
          })

          oneQuestion.answers = questionAnswers?.data?.data ?? null
        }
      }
      let tempArr = []

      for (const oneQuestion of allQuestions) {
        if (oneQuestion?.question_type === 'essay') {
          tempArr.push(oneQuestion?.candidate_answer)
        }
      }

      setMarks(tempArr)
      setCurrentMarks(tempArr)
      setQuestions(allQuestions)
      dispatch(setIsLoadingFalse())
    }

    firstFetch()
  }, [reloadTable])

  if (!isCorrectId) {
    return <div>404 Not Found</div>
  }

  const compareMarks = () => {
    const differences = marks.map((mark) => {
      const current = currentMarks.find((cm) => cm.id === mark.id)
      return {
        id: mark.id,
        question_id: mark.question_id,
        newScore: mark.score,
        oldScore: current?.score,
        changed: mark.score !== current?.score
      }
    })
    return differences
  }

  const handleExit = () => {
    navigate('/candidates')
  }

  const handleSubmit = async () => {
    dispatch(setIsLoadingTrue())
    const differences = compareMarks()
    let updateGrade: number = 0
    for (const userAnswer of differences) {
      if (!userAnswer?.changed) continue

      await updateUserAnswer(userAnswer?.id, { score: userAnswer?.newScore })
      updateGrade += userAnswer?.newScore - userAnswer?.oldScore
    }
    await increaseScoreTestAssignment({ score: updateGrade }, testAssignmentId)

    setReloadTable(!reloadTable)
    dispatch(setIsLoadingFalse())
  }

  const countGrade = () => {
    let totalGrade = questions.reduce((prevVal, question) => {
      return prevVal + question.score
    }, 0)
    let currentGrade = questions.reduce((prevVal, question) => {
      return prevVal + (question?.candidate_answer?.score || 0)
    }, 0)
    return `${currentGrade}/${totalGrade}`
  }

  return (
    <div className={styles.grading}>
      <div className={styles.grading__total}>
        <div className={styles.grading__totalGrade}>{countGrade()}</div>
      </div>
      {questions.map((thisQuestion, index) => (
        <div className={styles.grading__component} key={index}>
          <p className={styles.grading__title}>
            Question {index + 1} ({thisQuestion?.candidate_answer?.score || 0} /{' '}
            {thisQuestion.score}):{' '}
          </p>
          {thisQuestion.question_type === 'multiple_choice' ? (
            <GradeMultiple question={thisQuestion} />
          ) : thisQuestion.question_type === 'essay' ? (
            <GradeEssay
              question={thisQuestion}
              marks={marks}
              setMarks={setMarks}
            />
          ) : (
            <GradeCoding question={thisQuestion} />
          )}
        </div>
      ))}
      <div className={styles.grading__submit}>
        <Button variant='secondary' onClick={handleExit}>
          Exit
        </Button>
        <Button variant='primary' onClick={handleSubmit}>
          Done
        </Button>
      </div>
    </div>
  )
}

export default EssayGrading
