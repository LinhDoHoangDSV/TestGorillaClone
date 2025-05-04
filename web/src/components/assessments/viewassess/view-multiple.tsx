import { type FC, useEffect, useState } from 'react'
import styles from '../../../style/components/assessments/new/create-question.module.scss'
import Button from '../../ui/button'
import {
  QuestionDialogProps,
  UpdateQuestionDto
} from '../../../constant/common'
import { useDispatch } from 'react-redux'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../../redux/slices/common.slice'
import { useLocation } from 'react-router-dom'
import { deleteQuestion, updateQuestion } from '../../../api/questions.api'
import {
  createAnswer,
  deleteAnswer,
  updateAnswer
} from '../../../api/answers.api'

interface TempType {
  id: string
  text: string
  isCorrect: boolean
}

const MultipleChoiceDialog: FC<QuestionDialogProps> = ({
  type,
  onCancel,
  setQuestions,
  questions,
  rowIndex
}) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [isViewPage, setIsViewPage] = useState<boolean>(false)
  const [title, setTitle] = useState(
    rowIndex >= 0 ? questions[rowIndex].title : ''
  )
  const [description, setDescription] = useState(
    rowIndex >= 0 ? questions[rowIndex].question_text : ''
  )
  const [counter, setCounter] = useState<number>(
    rowIndex >= 0 ? questions[rowIndex].answers.length + 1 : 3
  )
  const [options, setOptions] = useState<TempType[]>(
    rowIndex >= 0 && questions[rowIndex]?.answers && !isViewPage
      ? questions[rowIndex]?.answers.map((item, index) => {
          return {
            id: (item?.id || index + 1).toString(),
            text: item.option_text,
            isCorrect: item.is_correct
          }
        })
      : [
          { id: '1', text: '', isCorrect: false },
          { id: '2', text: '', isCorrect: false }
        ]
  )
  const [allowMultipleCorrect, setAllowMultipleCorrect] = useState(false)
  const [shuffleOptions, setShuffleOptions] = useState(false)
  const [score, setScore] = useState<string>(
    rowIndex >= 0 ? questions[rowIndex].score.toString() : '5'
  )

  useEffect(() => {
    if (location.pathname.includes('assessments/new')) setIsViewPage(false)
    else setIsViewPage(true)
  }, [location.pathname])

  const handleOptionChange = (id: string, text: string) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, text } : option))
    )
  }

  const handleCorrectChange = async (id: string) => {
    if (isViewPage) {
      dispatch(setIsLoadingTrue())
      const trueOldAnswer = options.find((option) => option.isCorrect)
      await updateAnswer(+trueOldAnswer?.id, { is_correct: false })
      await updateAnswer(+id, { is_correct: true })
      for (const index in options) {
        if (options[index].id === id) {
          options[index].isCorrect = true
        } else if (options[index].id === trueOldAnswer?.id) {
          options[index].isCorrect = false
        }
      }
      setQuestions(
        questions.map((question, index) => {
          if (index === rowIndex) {
            return {
              ...question,
              answers: options.map((item) => ({
                id: +item.id,
                option_text: item.text,
                is_correct: item.isCorrect
              }))
            }
          }
          return question
        })
      )
      dispatch(setIsLoadingFalse())
      setOptions(options)
    } else {
      setOptions(
        options.map((option) => ({
          ...option,
          isCorrect: option.id === id
        }))
      )
    }
  }

  const addOption = async () => {
    if (isViewPage) {
      dispatch(setIsLoadingTrue())
      const newOption = await createAnswer({
        is_correct: false,
        option_text: 'new answer',
        question_id: questions[rowIndex].id
      })

      if (newOption?.status > 299) {
        dispatch(
          setToasterAppear({ message: 'Failed to add option', type: 'error' })
        )
        return
      }

      const optionData = newOption?.data?.data

      setQuestions(
        questions.map((question, index) => {
          if (index === rowIndex) {
            return {
              ...question,
              answers: [...question.answers, optionData]
            }
          }
          return question
        })
      )

      setOptions([
        ...options,
        {
          id: optionData?.id.toString(),
          isCorrect: optionData?.is_correct,
          text: optionData?.option_text
        }
      ])
      dispatch(setIsLoadingFalse())
    } else {
      const newId = counter.toString()
      setOptions([...options, { id: newId, text: '', isCorrect: false }])
      setCounter(counter + 1)
    }
  }

  const removeOption = async (id: string) => {
    if (options.length <= 2) return

    if (isViewPage) {
      dispatch(setIsLoadingTrue())
      const result = await deleteAnswer(+id)

      if (result?.status > 299) {
        dispatch(
          setToasterAppear({
            message: 'Failed to delete option',
            type: 'error'
          })
        )
        return
      }
      const listAnswer = questions[rowIndex].answers.filter(
        (answer) => answer.id !== +id
      )
      setQuestions(
        questions.map((question, index) => {
          if (index === rowIndex) {
            return {
              ...question,
              answers: listAnswer
            }
          }
          return question
        })
      )
      dispatch(setIsLoadingFalse())
    }
    setOptions(options.filter((option) => option.id !== id))
  }

  const handleDelete = async () => {
    if (isViewPage) {
      dispatch(setIsLoadingTrue())
      for (const option of options) {
        await deleteAnswer(+option.id)
      }

      const result = await deleteQuestion(questions[rowIndex].id)

      if (result?.status > 299) {
        dispatch(
          setToasterAppear({
            message: 'Failed to delete question',
            type: 'error'
          })
        )
        return
      }
      setQuestions(questions.filter((_, index) => index !== rowIndex))
      dispatch(setIsLoadingFalse())
    } else {
      dispatch(
        setToasterAppear({
          message: 'Question is deleted',
          type: 'success'
        })
      )
    }
    const temp = questions.filter((_, index) => {
      return index !== rowIndex
    })

    setQuestions(temp)
    onCancel()
  }

  const handleBlurInput = async (id: string) => {
    if (isViewPage) {
      const option = options.find((item) => item.id === id)
      await updateAnswer(+id, { option_text: option?.text })
      setQuestions(
        questions.map((question, index) => {
          if (index === rowIndex) {
            return {
              ...question,
              answers: question.answers.map((item) => {
                if (item.id === +id) {
                  return { ...item, option_text: option?.text }
                }
                return item
              })
            }
          }
          return question
        })
      )
    }
  }

  const handleUpdate = async () => {
    if (!title.trim()) {
      dispatch(
        setToasterAppear({ message: 'Title must not be blank', type: 'error' })
      )
      return
    }

    if (!description.trim()) {
      dispatch(
        setToasterAppear({
          message: 'Description must not be blank',
          type: 'error'
        })
      )
      return
    }

    if (!+score) {
      dispatch(
        setToasterAppear({ message: 'Score must be a number', type: 'error' })
      )
      return
    }

    if (!options.some((option) => option.isCorrect)) {
      dispatch(
        setToasterAppear({
          message: 'Must provide correct answer',
          type: 'error'
        })
      )
      return
    }

    if (!options.every((option) => option.text.trim())) {
      dispatch(
        setToasterAppear({
          message: 'Answer mus not be blank',
          type: 'error'
        })
      )
      return
    }

    dispatch(setIsLoadingTrue())

    const answers = options.map((item) => {
      return {
        option_text: item.text,
        is_correct: item.isCorrect
      }
    })

    questions[rowIndex].title = title
    questions[rowIndex].answers = answers
    questions[rowIndex].question_text = description
    questions[rowIndex].score = parseInt(score)

    if (isViewPage) {
      const data: UpdateQuestionDto = {
        title: questions[rowIndex].title,
        score: questions[rowIndex].score,
        question_text: questions[rowIndex].question_text
      }

      await updateQuestion(questions[rowIndex].id, data)
    }

    setQuestions(questions)

    dispatch(setToasterAppear({ message: 'Question updated', type: 'success' }))
    dispatch(setIsLoadingFalse())
    onCancel()
  }

  return (
    <div className={styles['question-dialog__overlay']}>
      <div className={styles['question-dialog']}>
        <div className={styles['question-dialog__header']}>
          <h2 className={styles['question-dialog__title']}>
            Multiple Choice Question
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
                disabled={type === 'view'}
                type='text'
                className={styles['question-dialog__input']}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter question title'
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter detailed instructions for the candidate'
                rows={3}
              />
            </div>

            <div className={styles['question-dialog__form-group']}>
              <label
                className={styles['question-dialog__label']}
                htmlFor='title'
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
          </div>

          <div className={styles['question-dialog__section']}>
            <h3 className={styles['question-dialog__section-title']}>
              Answer options{' '}
              <span className={styles['question-dialog__required']}>*</span>
            </h3>
            <p className={styles['question-dialog__hint']}>
              Add at least 2 options and select the correct answer(s).
            </p>

            <div className={styles['question-dialog__options-container']}>
              {options.map((option) => (
                <div
                  key={option.id}
                  className={styles['question-dialog__option-row']}
                >
                  <div className={styles['question-dialog__option-select']}>
                    <input
                      disabled={type === 'view'}
                      type={allowMultipleCorrect ? 'checkbox' : 'radio'}
                      id={`option-${option.id}`}
                      name='correctOption'
                      checked={option.isCorrect}
                      onChange={() => handleCorrectChange(option.id)}
                      className={styles['question-dialog__option-input']}
                    />
                  </div>
                  <div className={styles['question-dialog__option-content']}>
                    <input
                      disabled={type === 'view'}
                      type='text'
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(option.id, e.target.value)
                      }
                      onBlur={() => handleBlurInput(option.id)}
                      placeholder='Enter option text'
                      className={styles['question-dialog__input']}
                    />
                  </div>
                  <button
                    type='button'
                    onClick={() => removeOption(option.id)}
                    className={styles['question-dialog__remove-button']}
                    disabled={options.length <= 2 || type === 'view'}
                  >
                    {type === 'own' && (
                      <svg
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className={styles['question-dialog__remove-icon']}
                      >
                        <path
                          d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'
                          fill='currentColor'
                        />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {type === 'own' && (
              <button
                type='button'
                onClick={addOption}
                className={styles['question-dialog__add-option-button']}
              >
                <svg
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className={styles['question-dialog__add-icon']}
                >
                  <path
                    d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'
                    fill='currentColor'
                  />
                </svg>
                Add option
              </button>
            )}

            {type === 'own' && (
              <div className={styles['question-dialog__option-settings']}>
                <div className={styles['question-dialog__checkbox-group']}>
                  <input
                    type='checkbox'
                    id='allowMultiple'
                    checked={allowMultipleCorrect}
                    onChange={(e) => setAllowMultipleCorrect(e.target.checked)}
                    className={styles['question-dialog__checkbox']}
                    disabled
                  />
                  <label
                    htmlFor='allowMultiple'
                    className={styles['question-dialog__checkbox-label']}
                  >
                    Allow multiple correct answers
                  </label>
                </div>

                <div className={styles['question-dialog__checkbox-group']}>
                  <input
                    type='checkbox'
                    id='shuffleOptions'
                    checked={shuffleOptions}
                    onChange={(e) => setShuffleOptions(e.target.checked)}
                    className={styles['question-dialog__checkbox']}
                    disabled
                  />
                  <label
                    htmlFor='shuffleOptions'
                    className={styles['question-dialog__checkbox-label']}
                  >
                    Shuffle options for each candidate
                  </label>
                </div>
              </div>
            )}
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

export default MultipleChoiceDialog
