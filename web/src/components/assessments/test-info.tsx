import { FC, useEffect, useState } from 'react'
import styles from '../../style/components/assessments/test-info.module.scss'
import QuestionTable from './questions-table'
import {
  Question,
  sampleTest,
  TestAssignment,
  TestInfoProps,
  TestResponse
} from '../../constant/common'
import { createTest, getTestById, updateTest } from '../../api/tests.api'
import { useDispatch } from 'react-redux'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../redux/slices/common.slice'
import {
  createQuestion,
  getAllQuestionsByCriteria
} from '../../api/questions.api'
import { getAllTestAssignmentByCriteria } from '../../api/test-assignment.api'
import { createAnswer, getAllAnswerByCriteria } from '../../api/answers.api'
import InviteDialog from './attendance/invite-dialog'
import { useNavigate } from 'react-router-dom'

const TestInfo: FC<TestInfoProps> = ({ testId, type }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [testAssignments, setTestAssignments] = useState<TestAssignment[]>([])
  const [test, setTest] = useState<TestResponse>(sampleTest)
  const [title, setTitle] = useState<string>('')
  const [time, setTime] = useState<string>('0')
  const [description, setDescription] = useState<string>('')
  const [isPublish, setIsPublish] = useState<boolean>(false)

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

      const tempTest = result?.data?.data
      setTest(tempTest)
      setTitle(tempTest?.title)
      setIsPublish(tempTest?.is_publish)
      setDescription(tempTest?.description)
      setTime((tempTest?.test_time).toString())

      const questions = await getAllQuestionsByCriteria({ test_id: testId })
      const questionsData = questions?.data?.data

      for (const i in questionsData) {
        if (questionsData[i].question_type === 'multiple_choice') {
          const answers = await getAllAnswerByCriteria({
            question_id: questionsData[i].id
          })
          questionsData[i].answers = answers?.data?.data
        }
      }

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

  const handleCloneTest = async () => {
    dispatch(setIsLoadingTrue())

    const { id, owner_id, ...testData } = test
    const newTest = await createTest({
      ...testData,
      title: `${testData?.title} clone`
    })

    if (newTest?.status > 299) {
      dispatch(
        setToasterAppear({
          message: 'Error when creating new test',
          type: 'error'
        })
      )
      return
    }

    for (const question of questions) {
      const { id, answers = null, ...questionData } = question
      const newQuestion = await createQuestion({
        ...questionData,
        test_id: newTest?.data?.data?.id
      })

      if (question?.question_type === 'multiple_choice') {
        for (const answer of question.answers) {
          await createAnswer({
            is_correct: answer?.is_correct,
            option_text: answer?.option_text,
            question_id: newQuestion?.data?.data?.id
          })
        }
      }
    }

    dispatch(
      setToasterAppear({ message: 'Clone test successfully', type: 'success' })
    )
    navigate(`/assessments/${newTest?.data?.data?.id * 300003 + 200003}`)
    dispatch(setIsLoadingFalse())
  }

  const handleUpdateTest = async () => {
    if (title.trim() === '') {
      dispatch(
        setToasterAppear({ message: 'title must not be blank', type: 'error' })
      )
      return
    }

    if (time.trim() === '' || !+time) {
      dispatch(
        setToasterAppear({ message: 'time must be a number', type: 'error' })
      )
      return
    }

    if (description.trim() === '') {
      dispatch(
        setToasterAppear({
          message: 'description must not be blank',
          type: 'error'
        })
      )
      return
    }

    dispatch(setIsLoadingTrue())

    const result = await updateTest(test?.id, {
      title,
      description,
      is_publish: isPublish,
      test_time: +time
    })

    if (result?.status > 299) {
      dispatch(
        setToasterAppear({
          message: 'Error while updating test',
          type: 'error'
        })
      )
      return
    }

    setTest(result?.data?.data)

    dispatch(setIsLoadingFalse())
  }

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
            value={time}
            onChange={(e) => setTime(e.target.value)}
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
                checked={isPublish}
                onChange={() => setIsPublish(true)}
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
                checked={!isPublish}
                onChange={() => setIsPublish(false)}
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

      <div className={styles.test_info__section}>
        <h2 className={styles.test_info__section_title}>Questions</h2>
        <QuestionTable
          type={type}
          questions={questions}
          setQuestions={setQuestions}
        />
      </div>

      {type === 'view' && (
        <div className={styles.test_info__clone}>
          <button
            onClick={handleCloneTest}
            className={styles.test_info__clone_button}
          >
            Clone test
          </button>
        </div>
      )}

      {type === 'own' && (
        <div className={styles.test_info__clone}>
          <InviteDialog testId={testId} />
          <button
            onClick={handleUpdateTest}
            className={styles.test_info__clone_button}
          >
            Update test
          </button>
        </div>
      )}
    </div>
  )
}

export default TestInfo
