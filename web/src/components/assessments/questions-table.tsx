import styles from '../../style/components/assessments/questions-table.module.scss'
import { QuestionProps } from '../../constant/common'
import { FC } from 'react'

const QuestionTable: FC<QuestionProps> = ({ questions }) => {
  return (
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
                Add questions to capture information critical to your screening
                process. Dig deeper into motivation, skills, or experience with
                additional questions.
              </td>
            </tr>
          )}
          {questions.map((question, index) => (
            <tr
              key={index}
              className={styles['question-type__question-row']}
              // onClick={() => {
              //   setRowIndex(index)
              // }}
            >
              <td className={styles['question-type__type']}>
                {/* {getTypeName(question.question_type)} */}
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
  )
}

export default QuestionTable
