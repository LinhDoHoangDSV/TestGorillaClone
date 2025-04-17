import { FC, useState } from 'react'
import { QuestionResponse, TestResponse } from '../../../constant/common'
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
import { updateTestAssignment } from '../../../api/test-assignment.api'

interface TestTakerProps {
  test: TestResponse | null
  testAssignmentId: number
  onComplete: (answers: Record<string, string>) => void
}

const TestTaker: FC<TestTakerProps> = ({
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
      await updateTestAssignment({ score: data.score }, testAssignmentId)
    }
    setAnswer('')
    setScore(0)

    if (currentQuestionIndex < test?.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      onComplete(answers)
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
      default:
        return null
    }
  }

  return (
    <div className={styles.testTaker}>
      <TestHeader onNext={handleNext} />

      <div className={styles.testTaker__content}>
        <div className={styles.testTaker__progress}>
          <div className={styles.testTaker__progressText}>
            Question {currentQuestionIndex + 1} of {test.questions.length}
          </div>
          {/* <div className={styles.testTaker__progressBar}>
            <div
              className={styles.testTaker__progressFill}
              style={{
                width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%`
              }}
            />
          </div> */}
        </div>

        <div className={styles.testTaker__question}>
          {renderQuestion(currentQuestion)}
        </div>
      </div>
    </div>
  )
}

export default TestTaker
