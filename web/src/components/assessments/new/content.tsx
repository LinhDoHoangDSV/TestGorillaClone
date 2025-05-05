import { useState, FC } from 'react'
import styles from '../../../style/components/assessments/new/content.module.scss'
import QuestionType from './question-type'
import {
  ContentProps,
  CreateInitialCodeDto,
  CreateTestCaseDto,
  Question
} from '../../../constant/common'
import Button from '../../ui/button'
import { createTest } from '../../../api/tests.api'
import { useDispatch } from 'react-redux'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../../redux/slices/common.slice'
import {
  CreateAnswerDto,
  CreateQuestionDto,
  CreateTestDto
} from '../../../constant/api'
import { createQuestion } from '../../../api/questions.api'
import { createAnswer } from '../../../api/answers.api'
import { useNavigate } from 'react-router-dom'
import { createTestCase } from '../../../api/test-case.api'
import { createInitialCode } from '../../../api/initial-code.api'

const Content: FC<ContentProps> = ({ title }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [totalTime, setTotalTime] = useState('10')
  const [questions, setQuestions] = useState<Question[]>([])
  const [isPublish, setIsPublish] = useState(false)
  const [description, setDescription] = useState('')

  /* ---------------- handle create ---------------- */
  const handleCreate = async () => {
    if (!+totalTime) {
      dispatch(
        setToasterAppear({
          message: 'Total time must be a number',
          type: 'error'
        })
      )
      return
    }

    if (!description.trim()) {
      dispatch(
        setToasterAppear({
          message: 'Description must not be empty',
          type: 'error'
        })
      )
      return
    }

    dispatch(setIsLoadingTrue())

    const payload: CreateTestDto = {
      description,
      is_publish: isPublish,
      test_time: parseInt(totalTime),
      title
    }

    try {
      const testRes: any = await createTest(payload)

      for (const q of questions) {
        const qDto: CreateQuestionDto = {
          question_text: q.question_text,
          question_type: q.question_type,
          score: q.score,
          test_id: testRes?.data?.data?.id,
          title: q.title
        }

        const newQ: any = await createQuestion(qDto)

        /* MCQ / True‑False answers */
        if (q.question_type !== 'coding' && q.answers) {
          for (const ans of q.answers) {
            const aDto: CreateAnswerDto = {
              is_correct: ans.is_correct,
              option_text: ans.option_text,
              question_id: newQ?.data?.data?.id
            }
            await createAnswer(aDto)
          }
        }

        /* Coding question extras */
        if (q.question_type === 'coding') {
          for (const tc of q.testcases) {
            const tcDto: CreateTestCaseDto = {
              expected_output: tc.expected_output,
              input: tc.input,
              question_id: newQ?.data?.data?.id
            }
            await createTestCase(tcDto)
          }

          const icDto: CreateInitialCodeDto = {
            description: q.initial_code?.description,
            initial_code: q.initial_code?.initial_code,
            language_id: q.initial_code?.language_id,
            question_id: newQ?.data?.data?.id
          }
          await createInitialCode(icDto)
        }
      }

      dispatch(
        setToasterAppear({
          message: 'Create test successfully',
          type: 'success'
        })
      )
      navigate(`/assessments/${300003 * testRes?.data?.data?.id + 200003}`)
    } catch {
      dispatch(
        setToasterAppear({ message: 'Failed to create test', type: 'error' })
      )
    } finally {
      dispatch(setIsLoadingFalse())
    }
  }

  return (
    <div className={styles.content}>
      {/* time */}
      <div className={styles.content__field}>
        <div className={styles.content__label}>Minutes:</div>
        <input
          className={styles.content__input}
          type='number'
          placeholder='Total time'
          value={totalTime}
          onChange={(e) => setTotalTime(e.target.value)}
        />
      </div>

      <div className={styles.content__field}>
        <div className={styles.content__label}>Description:</div>
        <input
          className={styles.content__input}
          type='text'
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className={styles.content__publish}>
        <div className={styles.content__ptitle}>
          Do you want to publish this test?
        </div>
        <div className={styles['content__radio--group']}>
          <label className={styles.content__radio}>
            <input
              type='radio'
              name='publish'
              checked={isPublish}
              onChange={() => setIsPublish(true)}
            />
            Yes
          </label>
          <label className={styles.content__radio}>
            <input
              type='radio'
              name='publish'
              checked={!isPublish}
              onChange={() => setIsPublish(false)}
            />
            No
          </label>
        </div>
      </div>

      <div className={styles.content__step}>
        <QuestionType questions={questions} setQuestions={setQuestions} />
      </div>

      <div className={styles.content__button}>
        <Button variant='primary' onClick={handleCreate}>
          Finish
          <svg
            viewBox='0 0 24 24'
            className={styles['content__button-icon']}
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
          >
            <path
              d='M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12l-4.58 4.59z'
              fill='currentColor'
            />
          </svg>
        </Button>
      </div>
    </div>
  )
}

export default Content
