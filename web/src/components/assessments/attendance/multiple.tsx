import { FC } from 'react'
import type { QuestionResponse } from '../../../constant/common'
import styles from '../../../style/components/assessments/attendance/multiple-question.module.scss'

interface MultipleChoiceQuestionProps {
  answer: string
  setAnswer: (answer: string) => void
  setScore: (score: number) => void
  question: QuestionResponse
}

const MultipleChoiceQuestion: FC<MultipleChoiceQuestionProps> = ({
  answer,
  setAnswer,
  setScore,
  question
}) => {
  const handleOptionSelect = (answer: string, isCorrect: boolean) => {
    setScore(isCorrect ? question.score : 0)
    setAnswer(answer)
  }

  return (
    <div className={styles.question}>
      <div className={styles.question__content}>
        {question.title && (
          <div className={styles.question__description}>{question.title}</div>
        )}
        <h2 className={styles.question__text}>{question.question_text}</h2>
      </div>

      <div className={styles.question__options}>
        <h3 className={styles.question__optionsTitle}>SELECT ONLY ONE</h3>

        {question.answers?.map((thisAnswer) => (
          <div
            key={thisAnswer.id}
            className={styles.question__optionItem}
            onClick={() =>
              handleOptionSelect(thisAnswer.option_text, thisAnswer.is_correct)
            }
          >
            <div className={styles.question__optionRadio}>
              <div
                className={`${styles.question__optionRadioCircle} ${
                  answer === thisAnswer.option_text
                    ? styles['question__optionRadioCircle--selected']
                    : ''
                }`}
              />
            </div>
            <div className={styles.question__optionText}>
              {thisAnswer.option_text}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MultipleChoiceQuestion
