import { useState, type FC } from 'react'
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
  const [totalTime, setTotalTime] = useState<string>('10')
  const [questions, setQuestions] = useState<Question[]>([])
  const [isPublish, setIsPublish] = useState<boolean>(false)
  const [description, setDescription] = useState<string>('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log(questions)

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

    if (!description || description === '') {
      dispatch(
        setToasterAppear({
          message: 'Description must not be empty',
          type: 'error'
        })
      )
      return
    }

    dispatch(setIsLoadingTrue())

    const data: CreateTestDto = {
      description,
      is_publish: isPublish,
      test_time: parseInt(totalTime),
      title
    }

    const newTest: any = await createTest(data)

    for (const i of questions) {
      const createQuestionDto: CreateQuestionDto = {
        question_text: i.question_text,
        question_type: i.question_type,
        score: i.score,
        test_id: newTest?.data?.data?.id,
        title: i.title
      }

      const newQuestion: any = await createQuestion(createQuestionDto)

      if (i.question_type !== 'coding' && i.answers) {
        for (const j of i.answers) {
          const createAnserDto: CreateAnswerDto = {
            is_correct: j.is_correct,
            option_text: j.option_text,
            question_id: newQuestion?.data?.data?.id
          }

          await createAnswer(createAnserDto)
        }
      }

      if (i.question_type === 'coding') {
        for (const testcase of i.testcases) {
          const createTestCaseDto: CreateTestCaseDto = {
            expected_output: testcase.expected_output,
            input: testcase.input,
            question_id: newQuestion?.data?.data?.id
          }

          await createTestCase(createTestCaseDto)
        }

        const createInitialCodeDto: CreateInitialCodeDto = {
          description: i.initial_code?.description,
          initial_code: i.initial_code?.initial_code,
          language_id: i.initial_code?.language_id,
          question_id: newQuestion?.data?.data?.id
        }

        await createInitialCode(createInitialCodeDto)
      }
    }

    dispatch(
      setToasterAppear({ message: 'Create test successfully', type: 'success' })
    )
    dispatch(setIsLoadingFalse())
    navigate(`/assessments/${300003 * newTest?.data?.data?.id + 200003}`)
  }

  return (
    <div className={styles['content']}>
      <div className={styles['content__field']}>
        <div className={styles['content__label']}>Total time:</div>
        <input
          className={styles['content__input']}
          value={totalTime}
          onChange={(e) => setTotalTime(e.target.value)}
          type='number'
          placeholder='Total time'
        />
      </div>

      <div className={styles['content__field']}>
        <div className={styles['content__label']}>Description:</div>
        <input
          className={styles['content__input']}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type='text'
          placeholder='Description'
        />
      </div>

      <div className={styles['content__publish']}>
        <div className={styles['content__ptitle']}>
          Do you want to publish this test?
        </div>
        <div className={styles['content__radio-group']}>
          <label className={styles['content__radio']}>
            <input
              type='radio'
              name='publish'
              value='yes'
              checked={isPublish === true}
              onChange={() => setIsPublish(true)}
            />
            Yes
          </label>
          <label className={styles['content__radio']}>
            <input
              type='radio'
              name='publish'
              value='no'
              checked={isPublish === false}
              onChange={() => setIsPublish(false)}
            />
            No
          </label>
        </div>
      </div>

      <div className={styles['content__step']}>
        <QuestionType questions={questions} setQuestions={setQuestions} />
      </div>

      <div className={styles['content__button']}>
        <Button variant='primary' onClick={handleCreate}>
          Finish
          <svg
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={styles['question-type__button-icon']}
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
