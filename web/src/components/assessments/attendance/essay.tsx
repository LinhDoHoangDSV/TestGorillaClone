import React from 'react'

import { type FC, useState } from 'react'
import type { Questionn } from '../../../constant/common'
import styles from '../../../style/components/assessments/attendance/esssay-question.module.scss'

interface EssayQuestionProps {
  question: Questionn
  onAnswerChange: (questionId: string, answer: string) => void
}

const EssayQuestion: FC<EssayQuestionProps> = ({
  question,
  onAnswerChange
}) => {
  const [answer, setAnswer] = useState('')

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswer = e.target.value
    setAnswer(newAnswer)
    onAnswerChange(question.id, newAnswer)
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

      <div className={styles.question__answer}>
        <h3 className={styles.question__answerTitle}>YOUR ANSWER</h3>
        <textarea
          className={styles.question__answerTextarea}
          value={answer}
          onChange={handleAnswerChange}
          placeholder='Type your answer here...'
          rows={10}
        />
      </div>
    </div>
  )
}

export default EssayQuestion
