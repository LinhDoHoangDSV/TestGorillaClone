import { FC, useState } from 'react'
import { Test, Questionn } from '../../../constant/common'
import TestHeader from './test-header'
import MultipleChoiceQuestion from './multiple'
import EssayQuestion from './essay'
import styles from '../../../style/components/assessments/attendance/test-taker.module.scss'

interface TestTakerProps {
  test: Test
  onComplete: (answers: Record<string, string>) => void
}

const TestTaker: FC<TestTakerProps> = ({ test, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const currentQuestion = test.questions[currentQuestionIndex]

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      onComplete(answers)
    }
  }

  const renderQuestion = (question: Questionn) => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            question={question}
            onAnswerChange={handleAnswerChange}
          />
        )
      case 'essay':
        return (
          <EssayQuestion
            question={question}
            onAnswerChange={handleAnswerChange}
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
            Questionn {currentQuestionIndex + 1} of {test.questions.length}
          </div>
          <div className={styles.testTaker__progressBar}>
            <div
              className={styles.testTaker__progressFill}
              style={{
                width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%`
              }}
            />
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
