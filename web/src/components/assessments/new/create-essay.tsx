import { type FC, useState } from 'react'
import styles from '../../../style/components/assessments/new/create-question.module.scss'
import Button from '../../ui/button'
import {
  QuestionDialogProps,
  QuestionsType,
  sampleEssayQuestion
} from '../../../constant/common'
import { useDispatch } from 'react-redux'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../../redux/slices/common.slice'
import { createQuestion } from '../../../api/questions.api'

const EssayQuestionDialog: FC<QuestionDialogProps> = ({
  onCancel,
  setQuestions,
  questions,
  rowIndex,
  actionType,
  testId
}) => {
  const [question, setQuestion] = useState<QuestionsType>(
    rowIndex >= 0 ? questions[rowIndex] : sampleEssayQuestion
  )
  const [score, setScore] = useState<string>('5')
  const dispatch = useDispatch()

  // Add new question
  const handleSubmit = () => {
    if (!question?.title) {
      dispatch(
        setToasterAppear({ message: 'Title must not be blank', type: 'error' })
      )
      return
    } else if (!question?.question_text) {
      dispatch(
        setToasterAppear({
          message: "Quenstion's description must not be blank",
          type: 'error'
        })
      )
      return
    } else if (!+score) {
      dispatch(
        setToasterAppear({
          message: 'Score must be a number',
          type: 'error'
        })
      )
      return
    }

    dispatch(
      setToasterAppear({
        message: 'Question is added',
        type: 'success'
      })
    )
    setQuestions([...questions, { ...question, score: parseInt(score) }])
    setQuestion(sampleEssayQuestion)
    onCancel()
  }

  const handleUpdate = () => {
    if (!question?.title) {
      dispatch(
        setToasterAppear({ message: 'Title must not be blank', type: 'error' })
      )
      return
    } else if (!question?.question_text) {
      dispatch(
        setToasterAppear({
          message: "Quenstion's description must not be blank",
          type: 'error'
        })
      )
      return
    } else if (!+score) {
      dispatch(
        setToasterAppear({
          message: 'Score must be a number',
          type: 'error'
        })
      )
      return
    }

    dispatch(
      setToasterAppear({
        message: 'Question is updated',
        type: 'success'
      })
    )

    questions[rowIndex].title = question.title
    questions[rowIndex].score = parseInt(score)
    questions[rowIndex].question_text = question.question_text

    setQuestions(questions)
    setQuestion(sampleEssayQuestion)
    onCancel()
  }

  const handleAdd = async () => {
    if (!question?.title) {
      dispatch(
        setToasterAppear({ message: 'Title must not be blank', type: 'error' })
      )
      return
    } else if (!question?.question_text) {
      dispatch(
        setToasterAppear({
          message: "Quenstion's description must not be blank",
          type: 'error'
        })
      )
      return
    } else if (!+score) {
      dispatch(
        setToasterAppear({
          message: 'Score must be a number',
          type: 'error'
        })
      )
      return
    }

    const newQuestion = await createQuestion({
      question_text: question.question_text,
      question_type: question.question_type,
      title: question.title,
      score: parseInt(score),
      test_id: testId
    })

    dispatch(setIsLoadingTrue())

    if (newQuestion?.status > 299) {
      dispatch(
        setToasterAppear({
          message: 'Failed to add question',
          type: 'error'
        })
      )
      return
    }

    dispatch(
      setToasterAppear({
        message: 'Question is added',
        type: 'success'
      })
    )
    setQuestions([
      ...questions,
      { ...question, score: parseInt(score), test_id: testId }
    ])
    setQuestion(sampleEssayQuestion)
    dispatch(setIsLoadingFalse())
    onCancel()
  }

  const handleUpdateExisting = async () => {}

  const handleDelete = () => {
    dispatch(
      setToasterAppear({
        message: 'Question is deleted',
        type: 'success'
      })
    )

    const temp = questions.filter((item, index) => {
      console.log(item)

      return index !== rowIndex
    })

    setQuestions(temp)
    setQuestion(sampleEssayQuestion)
    onCancel()
  }

  return (
    <div className={styles['question-dialog__overlay']}>
      <div className={styles['question-dialog']}>
        <div className={styles['question-dialog__header']}>
          <h2 className={styles['question-dialog__title']}>
            New Essay Question
          </h2>
          <button
            className={styles['question-dialog__close-button']}
            onClick={onCancel}
          >
            <svg
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className={styles['question-dialog__close-icon']}
            >
              <path
                d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                fill='currentColor'
              />
            </svg>
          </button>
        </div>

        <div className={styles['question-dialog__content']}>
          <div className={styles['question-dialog__section']}>
            <div className={styles['question-dialog__form-group']}>
              <label
                className={styles['question-dialog__label']}
                htmlFor='title'
              >
                Question title{' '}
                <span className={styles['question-dialog__required']}>*</span>
              </label>
              <input
                id='title'
                type='text'
                className={styles['question-dialog__input']}
                value={question.title}
                onChange={(e) =>
                  setQuestion({ ...question, title: e.target.value })
                }
                placeholder='Enter question title'
                required
              />
            </div>

            <div className={styles['question-dialog__form-group']}>
              <label
                className={styles['question-dialog__label']}
                htmlFor='score'
              >
                Score{' '}
                <span className={styles['question-dialog__required']}>*</span>
              </label>
              <input
                id='score'
                type='text'
                className={styles['question-dialog__input']}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder='Enter question score'
                required
              />
            </div>

            <div className={styles['question-dialog__form-group']}>
              <label
                className={styles['question-dialog__label']}
                htmlFor='description'
              >
                Question description
              </label>
              <textarea
                id='description'
                className={styles['question-dialog__textarea']}
                value={question.question_text}
                onChange={(e) =>
                  setQuestion({ ...question, question_text: e.target.value })
                }
                placeholder='Enter detailed instructions for the candidate'
                rows={4}
              />
            </div>
          </div>
        </div>

        <div className={styles['question-dialog__footer']}>
          <Button
            variant='secondary'
            onClick={rowIndex >= 0 ? handleDelete : onCancel}
          >
            {rowIndex >= 0 ? 'Delete' : 'Cancel'}
          </Button>
          <Button
            variant='primary'
            onClick={
              rowIndex >= 0
                ? handleUpdate
                : actionType === null
                  ? handleSubmit
                  : actionType === 'add'
                    ? handleAdd
                    : handleUpdateExisting
            }
          >
            {rowIndex >= 0 ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EssayQuestionDialog
