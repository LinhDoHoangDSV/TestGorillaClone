import type { FC } from 'react'
import styles from '../../../style/components/new-assessments/content.module.scss'
import QuestionType from './question-type'
import { QuestionsType } from '../../../constant/common'

interface ContentProps {
  totalTime: number
  setTotalTime: (time: number) => void
  questions: QuestionsType[]
  setQuestions: (questions: QuestionsType[]) => void
  onNext: () => void
  onBack: () => void
}

const Content: FC<ContentProps> = ({
  totalTime,
  setTotalTime,
  questions,
  setQuestions
  // onNext,
  // onBack
}) => {
  return (
    <div className={styles['content']}>
      <div className={styles['content__time']}>
        <div className={styles['content__time-title']}>Total time: </div>
        <input
          className={styles['content__time-input']}
          min={0}
          max={500}
          value={totalTime}
          onChange={(e) => setTotalTime(parseInt(e.target.value))}
          type='number'
          placeholder='Total time'
        />
      </div>

      <div className={styles['content__step']}>
        <QuestionType
          questions={questions}
          setQuestions={setQuestions}
          // onNext={onNext}
          // onBack={onBack}
        />
      </div>
    </div>
  )
}

export default Content
