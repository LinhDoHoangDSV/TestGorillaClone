import { type FC, useState } from 'react'
import type { Questionn } from '../../../constant/common'
import styles from '../../../style/components/assessments/attendance/multiple-question.module.scss'

interface MultipleChoiceQuestionProps {
  question: Questionn
  onAnswerChange: (questionId: string, answer: string) => void
}

const MultipleChoiceQuestion: FC<MultipleChoiceQuestionProps> = ({
  question,
  onAnswerChange
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
    onAnswerChange(question.id, optionId)
  }

  return (
    <div className={styles.question}>
      <div className={styles.question__content}>
        {question.description && (
          <div className={styles.question__description}>
            {question.description}
          </div>
        )}
        <h2 className={styles.question__text}>{question.text}</h2>
      </div>

      <div className={styles.question__options}>
        <h3 className={styles.question__optionsTitle}>SELECT ONLY ONE</h3>

        {question.options?.map((option) => (
          <div
            key={option.id}
            className={styles.question__optionItem}
            onClick={() => handleOptionSelect(option.id)}
          >
            <div className={styles.question__optionRadio}>
              <div
                className={`${styles.question__optionRadioCircle} ${
                  selectedOption === option.id
                    ? styles['question__optionRadioCircle--selected']
                    : ''
                }`}
              />
            </div>
            <div className={styles.question__optionText}>{option.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MultipleChoiceQuestion
