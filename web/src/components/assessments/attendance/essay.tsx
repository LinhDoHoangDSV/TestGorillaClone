import { FC } from 'react'
import { QuestionResponse } from '../../../constant/common'
import styles from '../../../style/components/assessments/attendance/esssay-question.module.scss'

interface EssayQuestionProps {
  answer: string
  setAnswer: (answer: string) => void
  question: QuestionResponse
}

const EssayQuestion: FC<EssayQuestionProps> = ({
  answer,
  setAnswer,
  question
}) => {
  return (
    <div className={styles.question}>
      <div className={styles.question__content}>
        {question.title && (
          <div className={styles.question__description}>{question.title}</div>
        )}
        <h2 className={styles.question__text}>{question.question_text}</h2>
      </div>

      <div className={styles.question__answer}>
        <h3 className={styles.question__answerTitle}>YOUR ANSWER</h3>
        <textarea
          className={styles.question__answerTextarea}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder='Type your answer here...'
          rows={10}
        />
      </div>
    </div>
  )
}

export default EssayQuestion
