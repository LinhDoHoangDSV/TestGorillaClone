import { FC } from 'react'
import { MultipleChoiceQuestionProps } from '../../../constant/common'
import styles from '../../../style/components/assessments/attendance/multiple-question.module.scss'

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
        {question.question_text.split('\n').map((text, index) => (
          <div className={styles.question__text} key={index}>
            {text}
          </div>
        ))}
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
