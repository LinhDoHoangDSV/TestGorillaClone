import { type FC, useState } from 'react'
import styles from '../../../style/components/assessments/new/question-type.module.scss'
import QuestionDialogManager from './dialog-manager'
import { QuestionTypeProps, questionTypes } from '../../../constant/common'

const QuestionType: FC<QuestionTypeProps> = ({ questions, setQuestions }) => {
  const [activeQuestionType, setActiveQuestionType] = useState<string | null>(
    null
  )
  const [rowIndex, setRowIndex] = useState<number>(-1)

  const getTypeName = (type: string) => {
    if (type === 'multiple_choice') return 'Multiple choice'
    else if (type === 'essay') return 'Essay'
    else if (type === 'coding') return 'Coding'
    else return 'Undifined'
  }

  const handleCancelDialog = () => {
    setActiveQuestionType(null)
  }

  const handleCancelDialogEdit = () => {
    setRowIndex(-1)
  }

  return (
    <div className={styles['question-type']}>
      <h2 className={styles['question-type__title']}>Add questions</h2>

      <div className={styles['question-type__table-container']}>
        <table className={styles['question-type__table']}>
          <thead>
            <tr>
              <th className={styles['question-type__type']}>Type</th>
              <th className={styles['question-type__text']}>Title</th>
              <th className={styles['question-type__score']}>Score</th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className={styles['question-type__empty-message']}
                >
                  Add questions to capture information critical to your
                  screening process. Dig deeper into motivation, skills, or
                  experience with additional questions.
                </td>
              </tr>
            )}
            {questions.map((question, index) => (
              <tr
                key={index}
                className={styles['question-type__question-row']}
                onClick={() => {
                  setRowIndex(index)
                }}
              >
                <td className={styles['question-type__type']}>
                  {getTypeName(question.question_type)}
                </td>
                <td className={styles['question-type__text']}>
                  {question.title}
                </td>
                <td className={styles['question-type__score']}>
                  {question.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles['question-type__section']}>
        <h3 className={styles['question-type__section-title']}>
          Create custom questions
        </h3>
        <div className={styles['question-type__question-types']}>
          {questionTypes.map((type) => (
            <div
              key={type.id}
              className={styles['question-type__card']}
              onClick={() => setActiveQuestionType(type.id)}
            >
              <div className={styles['question-type__icon-container']}>
                {type.icon === 'document' && (
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className={styles['question-type__icon']}
                  >
                    <path
                      d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z'
                      fill='currentColor'
                    />
                  </svg>
                )}
                {type.icon === 'list' && (
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className={styles['question-type__icon']}
                  >
                    <path
                      d='M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z'
                      fill='currentColor'
                    />
                  </svg>
                )}
                {type.icon === 'coding' && (
                  <svg
                    viewBox='0 0 576 512'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className={styles['question-type__icon']}
                  >
                    <path
                      d='M9.4 86.6C-3.1 74.1-3.1 53.9 9.4 41.4s32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 9.4 86.6zM256 416l288 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-288 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z'
                      fill='currentColor'
                    />
                  </svg>
                )}
              </div>
              <div className={styles['question-type__name']}>{type.name}</div>
            </div>
          ))}
        </div>
      </div>

      {rowIndex >= 0 && (
        <QuestionDialogManager
          questions={questions}
          setQuestions={setQuestions}
          questionType={questions[rowIndex].question_type}
          onCancel={handleCancelDialogEdit}
          actionType={null}
          rowIndex={rowIndex}
        />
      )}

      {activeQuestionType && (
        <QuestionDialogManager
          questions={questions}
          setQuestions={setQuestions}
          questionType={activeQuestionType}
          actionType={null}
          onCancel={handleCancelDialog}
          rowIndex={rowIndex}
        />
      )}
    </div>
  )
}

export default QuestionType
