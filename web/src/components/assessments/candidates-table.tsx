import { FC } from 'react'
import styles from '../../style/components/assessments/candidates-table.module.scss'
import { CandidateProps } from '../../constant/common'

const CandidateTable: FC<CandidateProps> = ({ testAssignments }) => {
  return (
    <div className={styles['question-type__table-container']}>
      <table className={styles['question-type__table']}>
        <thead>
          <tr>
            <th className={styles['question-type__type']}>Index</th>
            <th className={styles['question-type__text']}>Email</th>
            <th className={styles['question-type__text']}>Compeletion Time</th>
            <th className={styles['question-type__score']}>Score</th>
          </tr>
        </thead>
        <tbody>
          {testAssignments.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className={styles['question-type__empty-message']}
              >
                No candidates for this test. Invite now!
              </td>
            </tr>
          )}
          {testAssignments.map((testAssignment, index) => (
            <tr
              key={index}
              className={styles['question-type__question-row']}
              // onClick={() => {
              //   setRowIndex(index)
              // }}
            >
              <td className={styles['question-type__type']}>{index + 1}</td>
              <td className={styles['question-type__text']}>
                {testAssignment.candidate_email}
              </td>
              <td className={styles['question-type__text']}>
                {testAssignment.started_at}
              </td>
              <td className={styles['question-type__score']}>
                {testAssignment.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CandidateTable
