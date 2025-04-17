import { FC, useEffect, useState } from 'react'
import styles from '../../style/components/assessments/test-info.module.scss'
import CandidateTable from './candidates-table'
import QuestionTable from './questions-table'
import { Question, TestAssignment, TestInfoProps } from '../../constant/common'
import { getTestById } from '../../api/tests.api'
import { useDispatch } from 'react-redux'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../redux/slices/common.slice'
import { getAllQuestionsByCriteria } from '../../api/questions.api'
import { getAllTestAssignmentByCriteria } from '../../api/test-assignment.api'
import { getAllAnswerByCriteria } from '../../api/answers.api'

const TestInfo: FC<TestInfoProps> = ({ testId, type }) => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState<string>('title')
  const [totalTime, setTotalTime] = useState<string>('time')
  const [description, setDescription] = useState<string>('description')
  const [isPublished, setIsPublished] = useState<boolean>(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [testAssignments, setTestAssignments] = useState<TestAssignment[]>([])

  useEffect(() => {
    const firstFetch = async () => {
      dispatch(setIsLoadingTrue())

      const result = await getTestById(testId)

      if (result?.status > 299) {
        dispatch(
          setToasterAppear({
            message: 'Error while getting test information',
            type: 'error'
          })
        )
        return
      }

      setTitle(result?.data?.data?.title)
      setDescription(result?.data?.data?.description)
      setTotalTime(result?.data?.data?.test_time)
      setIsPublished(result?.data?.data?.is_publish)

      const questions = await getAllQuestionsByCriteria({ test_id: testId })
      questions?.data?.data?.map(async (question) => {
        if (question.question_type === 'multiple_choice') {
          const answers = await getAllAnswerByCriteria({
            question_id: question.id
          })
          question.answers = answers?.data?.data
        }

        return question
      })

      setQuestions(questions?.data?.data)

      if (type === 'owner') {
        const testAssignments = await getAllTestAssignmentByCriteria({
          test_id: testId
        })
        setTestAssignments(testAssignments?.data?.data)
      }

      dispatch(setIsLoadingFalse())
    }

    firstFetch()
  }, [testId])

  return (
    <div className={styles.test_info}>
      <div className={styles.test_info__section}>
        <div className={styles.test_info__field}>
          <label className={styles.test_info__label}>Title:</label>
          <input
            type='text'
            className={styles.test_info__input}
            value={title}
            placeholder='Title'
            onChange={(e) => setTitle(e.target.value)}
            disabled={type !== 'own'}
          />
        </div>

        <div className={styles.test_info__field}>
          <label className={styles.test_info__label}>Total time:</label>
          <input
            type='text'
            className={styles.test_info__input}
            value={totalTime}
            onChange={(e) => setTotalTime(e.target.value)}
            disabled={type !== 'own'}
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
            disabled={type !== 'own'}
          />
        </div>

        <div className={styles.test_info__field}>
          <label className={styles.test_info__label}>Public:</label>
          <div className={styles.test_info__radio_group}>
            <div className={styles.test_info__radio_option}>
              <input
                type='radio'
                id='publish-yes'
                name='publish'
                className={styles.test_info__radio}
                checked={isPublished}
                onChange={() => setIsPublished(true)}
                disabled={type !== 'own'}
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
                disabled={type !== 'own'}
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

      {type === 'own' && (
        <div className={styles.test_info__section}>
          <h2 className={styles.test_info__section_title}>Candidates</h2>
          <CandidateTable testAssignments={testAssignments} />
        </div>
      )}

      <div className={styles.test_info__section}>
        <h2 className={styles.test_info__section_title}>Questions</h2>
        <QuestionTable
          type={type}
          questions={questions}
          setQuestions={setQuestions}
        />
      </div>
    </div>
  )
}

export default TestInfo
