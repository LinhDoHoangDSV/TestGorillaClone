import { FC, useState } from 'react'
import styles from '../../style/components/assessments/test-info.module.scss'
import CandidateTable from './candidates-table'
import QuestionTable from './questions-table'
import { Candidate, Question } from '../../constant/common'

const TestInfo: FC = () => {
  const [totalTime, setTotalTime] = useState<string>('10')
  const [description, setDescription] = useState<string>('')
  const [isPublished, setIsPublished] = useState<boolean>(false)

  const candidates: Candidate[] = [
    {
      id: 1,
      email: 'candidate1@example.com',
      completionTime: '45 minutes',
      score: 85
    },
    {
      id: 2,
      email: 'candidate2@example.com',
      completionTime: '38 minutes',
      score: 92
    },
    {
      id: 3,
      email: 'candidate3@example.com',
      completionTime: '52 minutes',
      score: 78
    }
  ]

  const questions: Question[] = [
    {
      id: 1,
      type: 'Multiple Choice',
      title: 'Basic JavaScript knowledge',
      score: 10
    },
    {
      id: 2,
      type: 'Coding',
      title: 'React component implementation',
      score: 20
    },
    {
      id: 3,
      type: 'Essay',
      title: 'Describe your development workflow',
      score: 15
    }
  ]

  return (
    <div className={styles.test_info}>
      <div className={styles.test_info__section}>
        <div className={styles.test_info__field}>
          <label className={styles.test_info__label}>Total time:</label>
          <input
            type='text'
            className={styles.test_info__input}
            value={totalTime}
            onChange={(e) => setTotalTime(e.target.value)}
          />
        </div>

        <div className={styles.test_info__field}>
          <label className={styles.test_info__label}>Description:</label>
          <input
            type='text'
            className={styles.test_info__input}
            value={description}
            placeholder='Description'
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.test_info__field}>
          <label className={styles.test_info__label}>
            Do you want to publish this test?
          </label>
          <div className={styles.test_info__radio_group}>
            <div className={styles.test_info__radio_option}>
              <input
                type='radio'
                id='publish-yes'
                name='publish'
                className={styles.test_info__radio}
                checked={isPublished}
                onChange={() => setIsPublished(true)}
              />
              <label
                htmlFor='publish-yes'
                className={styles.test_info__radio_label}
              >
                Yes
              </label>
            </div>
            <div className={styles.test_info__radio_option}>
              <input
                type='radio'
                id='publish-no'
                name='publish'
                className={styles.test_info__radio}
                checked={!isPublished}
                onChange={() => setIsPublished(false)}
              />
              <label
                htmlFor='publish-no'
                className={styles.test_info__radio_label}
              >
                No
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.test_info__section}>
        <h2 className={styles.test_info__section_title}>Candidates</h2>
        <CandidateTable candidates={candidates} />
      </div>

      <div className={styles.test_info__section}>
        <h2 className={styles.test_info__section_title}>Custom questions</h2>
        <QuestionTable questions={questions} />
      </div>
    </div>
  )
}

export default TestInfo
