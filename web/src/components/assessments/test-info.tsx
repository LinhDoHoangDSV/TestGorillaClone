import { FC, useEffect, useState } from 'react'
import styles from '../../style/components/assessments/test-info.module.scss'
import QuestionTable from './questions-table'
import {
  Question,
  questionTypes,
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
import {
  createInitialCode,
  findInitialCodeByCriteria
} from '../../api/initial-code.api'
import { createTestCase, findTestCaseByCriteria } from '../../api/test-case.api'
import QuestionDialogManager from './new/dialog-manager'
import Button from '../ui/button'

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
  const [activeQuestionType, setActiveQuestionType] = useState<string | null>(
    null
  )
  const [actionType, setActionType] = useState<string | null>(null)

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
        } else if (questionsData[i].question_type === 'coding') {
          const initialCode = await findInitialCodeByCriteria({
            question_id: questionsData[i].id
          })

          questionsData[i].initial_code = initialCode?.data?.data[0]

          const testCases = await findTestCaseByCriteria({
            question_id: questionsData[i].id
          })
          questionsData[i].testcases = testCases?.data?.data
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

  const handleCancelDialog = () => {
    setActiveQuestionType(null)
    setActionType(null)
  }

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
      const {
        id,
        answers = null,
        testcases = null,
        initial_code = null,
        ...questionData
      } = question
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
      } else if (question?.question_type === 'coding') {
        await createInitialCode({
          initial_code: initial_code?.initial_code,
          language_id: initial_code?.language_id,
          question_id: newQuestion?.data?.data?.id
        })

        for (const testcase of testcases) {
          await createTestCase({
            expected_output: testcase.expected_output,
            input: testcase.input,
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
    dispatch(
      setToasterAppear({
        message: 'Updating test successfully',
        type: 'success'
      })
    )
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

      {type === 'own' && (
        <div className={styles['question-type__question-types']}>
          {questionTypes.map((type) => (
            <div
              key={type.id}
              className={styles['question-type__card']}
              onClick={() => {
                setActiveQuestionType(type.id)
                setActionType('add')
              }}
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
      )}

      {type === 'view' && (
        <div className={styles.test_info__clone}>
          <Button onClick={handleCloneTest} variant='primary'>
            Clone test
          </Button>
        </div>
      )}

      {type === 'own' && (
        <div className={styles.test_info__clone}>
          <InviteDialog testId={testId} />
          <Button variant='primary' onClick={handleUpdateTest}>
            Update test
          </Button>
        </div>
      )}

      {activeQuestionType && (
        <QuestionDialogManager
          questions={questions}
          setQuestions={setQuestions}
          questionType={activeQuestionType}
          onCancel={handleCancelDialog}
          actionType={actionType}
          testId={testId}
          rowIndex={-1}
        />
      )}
    </div>
  )
}

export default TestInfo
