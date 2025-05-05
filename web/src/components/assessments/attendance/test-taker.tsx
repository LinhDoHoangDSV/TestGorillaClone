import { FC, useState } from 'react'
import { QuestionResponse, TestTakerProps } from '../../../constant/common'
import TestHeader from './test-header'
import MultipleChoiceQuestion from './multiple'
import EssayQuestion from './essay'
import styles from '../../../style/components/assessments/attendance/test-taker.module.scss'
import { useDispatch } from 'react-redux'
import {
  setIsLoadingFalse,
  setIsLoadingTrue
} from '../../../redux/slices/common.slice'
import { createUserAnsers } from '../../../api/user-answers.api'
import { CreateUserAnser } from '../../../constant/api'
import { increaseScoreTestAssignment } from '../../../api/test-assignment.api'
import CodingQuestion from './coding'

const TestTaker: FC<TestTakerProps> = ({
  seconds,
  test,
  onComplete,
  testAssignmentId
}) => {
  const dispatch = useDispatch()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [answer, setAnswer] = useState<string>('')
  const [score, setScore] = useState<number>(0)

  const currentQuestion = test?.questions[currentQuestionIndex]

  const handleNext = async () => {
    dispatch(setIsLoadingTrue())

    const data: CreateUserAnser = {
      answer_text: answer,
      question_id: currentQuestion?.id,
      score,
      test_assignment_id: testAssignmentId
    }

    await createUserAnsers(data)
    if (data.score > 0) {
      await increaseScoreTestAssignment({ score: data.score }, testAssignmentId)
    }
    setAnswer('')
    setScore(0)

    if (currentQuestionIndex < test?.questions?.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      onComplete()
    }
    dispatch(setIsLoadingFalse())
  }

  const renderQuestion = (question: QuestionResponse) => {
    switch (question.question_type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            answer={answer}
            setAnswer={setAnswer}
            setScore={setScore}
            question={question}
          />
        )
      case 'essay':
        return (
          <EssayQuestion
            answer={answer}
            setAnswer={setAnswer}
            question={question}
          />
        )
      case 'coding':
        return (
          <CodingQuestion
            answer={answer}
            setAnswer={setAnswer}
            question={question}
            setScore={setScore}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={styles.testTaker}>
      <TestHeader onNext={handleNext} seconds={seconds} />

      <div className={styles.testTaker__content}>
        <div className={styles.testTaker__progress}>
          <div className={styles.testTaker__progressText}>
            Question {currentQuestionIndex + 1} of {test?.questions?.length}
          </div>
        </div>

        <div className={styles.testTaker__question}>
          {renderQuestion(currentQuestion)}
        </div>
      </div>
    </div>
  )
}

export default TestTaker
