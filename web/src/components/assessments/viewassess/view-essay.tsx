import { FC, useEffect, useState } from 'react'
import styles from '../../../style/components/assessments/new/create-question.module.scss'
import Button from '../../ui/button'
import {
  QuestionDialogProps,
  QuestionsType,
  sampleEssayQuestion,
  UpdateQuestionDto
} from '../../../constant/common'
import { useDispatch } from 'react-redux'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../../redux/slices/common.slice'
import { deleteQuestion, updateQuestion } from '../../../api/questions.api'
import { useLocation } from 'react-router-dom'

const EssayQuestionDialog: FC<QuestionDialogProps> = ({
  type,
  onCancel,
  setQuestions,
  questions,
  rowIndex
}) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [question, setQuestion] = useState<QuestionsType>(
    rowIndex >= 0 ? questions[rowIndex] : sampleEssayQuestion
  )
  const [score, setScore] = useState<string>('5')
  const [isViewPage, setIsViewPage] = useState<boolean>(false)

  useEffect(() => {
    if (location.pathname.includes('assessments/new')) setIsViewPage(false)
    else setIsViewPage(true)

    setScore(questions[rowIndex].score.toString())
  }, [location.pathname])

  // Update question
  const handleUpdate = async () => {
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

    dispatch(setIsLoadingTrue())
    dispatch(
      setToasterAppear({
        message: 'Question is updated',
        type: 'success'
      })
    )

    questions[rowIndex].title = question.title
    questions[rowIndex].score = parseInt(score)
    questions[rowIndex].question_text = question.question_text

    if (isViewPage) {
      const data: UpdateQuestionDto = {
        title: questions[rowIndex].title,
        score: questions[rowIndex].score,
        question_text: questions[rowIndex].question_text
      }

      await updateQuestion(questions[rowIndex].id, data)
      console.log('oke')
    }

    setQuestions(questions)
    setQuestion(sampleEssayQuestion)
    onCancel()
    dispatch(setIsLoadingFalse())
  }

  const handleDelete = async () => {
    dispatch(setIsLoadingTrue())
    dispatch(
      setToasterAppear({
        message: 'Question is deleted',
        type: 'success'
      })
    )

    if (isViewPage) {
      await deleteQuestion(questions[rowIndex].id)
    }

    const temp = questions.filter((item, index) => {
      return index !== rowIndex
    })

    setQuestions(temp)
    setQuestion(sampleEssayQuestion)
    onCancel()
    dispatch(setIsLoadingFalse())
  }

  return (
    <div className={styles['question-dialog__overlay']}>
      <div className={styles['question-dialog']}>
        <div className={styles['question-dialog__header']}>
          <h2 className={styles['question-dialog__title']}>Essay Question</h2>
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
                disabled={type === 'view'}
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
                disabled={type === 'view'}
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
                disabled={type === 'view'}
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

        {type === 'own' && (
          <div className={styles['question-dialog__footer']}>
            <Button variant='secondary' onClick={handleDelete}>
              Delete
            </Button>
            <Button variant='primary' onClick={handleUpdate}>
              Update
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EssayQuestionDialog
