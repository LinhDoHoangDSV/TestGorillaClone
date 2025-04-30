import { type FC, useState } from 'react'
import styles from '../../../style/components/assessments/new/create-question.module.scss'
import Button from '../../ui/button'
import { QuestionDialogProps } from '../../../constant/common'
import { useDispatch } from 'react-redux'
import {
  setIsLoadingFalse,
  setIsLoadingTrue,
  setToasterAppear
} from '../../../redux/slices/common.slice'
import { CreateAnswerDto, CreateQuestionDto } from '../../../constant/api'
import { createQuestion } from '../../../api/questions.api'
import { createAnswer, getAllAnswerByCriteria } from '../../../api/answers.api'

interface TempType {
  id: string
  text: string
  isCorrect: boolean
}

const MultipleChoiceDialog: FC<QuestionDialogProps> = ({
  onCancel,
  setQuestions,
  questions,
  rowIndex,
  actionType,
  testId
}) => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState(
    rowIndex >= 0 ? questions[rowIndex].title : ''
  )
  const [description, setDescription] = useState(
    rowIndex >= 0 ? questions[rowIndex].question_text : ''
  )
  const [counter, setCounter] = useState<number>(
    rowIndex >= 0 ? questions.length + 1 : 3
  )
  const [options, setOptions] = useState<TempType[]>(
    rowIndex >= 0 && questions[rowIndex]?.answers
      ? questions[rowIndex]?.answers.map((item, index) => {
          return {
            id: (index + 1).toString(),
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

  const handleOptionChange = (id: string, text: string) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, text } : option))
    )
  }

  const handleCorrectChange = (id: string) => {
    if (allowMultipleCorrect) {
      setOptions(
        options.map((option) =>
          option.id === id
            ? { ...option, isCorrect: !option.isCorrect }
            : option
        )
      )
    } else {
      setOptions(
        options.map((option) => ({
          ...option,
          isCorrect: option.id === id
        }))
      )
    }
  }

  const addOption = () => {
    const newId = counter.toString()
    setOptions([...options, { id: newId, text: '', isCorrect: false }])
    setCounter(counter + 1)
  }

  const removeOption = (id: string) => {
    if (options.length <= 2) return
    setOptions(options.filter((option) => option.id !== id))
  }

  // Add question
  const handleSave = () => {
    if (!title.trim()) {
      dispatch(
        setToasterAppear({ message: 'Title must not be blank', type: 'error' })
      )
      return
    }

    if (!+score) {
      dispatch(
        setToasterAppear({ message: 'Score must be a number', type: 'error' })
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

    const answers = options.map((item) => {
      return {
        option_text: item.text,
        is_correct: item.isCorrect
      }
    })

    setQuestions([
      ...questions,
      {
        question_type: 'multiple_choice',
        question_text: description,
        title,
        score: parseInt(score),
        answers
      }
    ])

    dispatch(setToasterAppear({ message: 'Question added', type: 'success' }))
    onCancel()
  }

  const handleAdd = async () => {
    if (!title.trim()) {
      dispatch(
        setToasterAppear({ message: 'Title must not be blank', type: 'error' })
      )
      return
    }

    if (!+score) {
      dispatch(
        setToasterAppear({ message: 'Score must be a number', type: 'error' })
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

    const createQuestionDto: CreateQuestionDto = {
      question_text: description,
      question_type: 'multiple_choice',
      score: +score,
      test_id: testId,
      title: title
    }

    const newQuestion = await createQuestion(createQuestionDto)

    if (newQuestion?.status > 299) {
      dispatch(
        setToasterAppear({
          message: 'Error while creating question',
          type: 'error'
        })
      )
      return
    }

    for (const answer of answers) {
      const createAnserDto: CreateAnswerDto = {
        is_correct: answer.is_correct,
        option_text: answer.option_text,
        question_id: newQuestion?.data?.data?.id
      }

      await createAnswer(createAnserDto)
    }

    const listAnswers = await getAllAnswerByCriteria({
      question_id: newQuestion?.data?.data?.id
    })

    setQuestions([
      ...questions,
      {
        ...newQuestion?.data?.data,
        answers: listAnswers?.data?.data
      }
    ])

    dispatch(setToasterAppear({ message: 'Question added', type: 'success' }))
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
    onCancel()
  }

  const handleUpdate = () => {
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

    setQuestions(questions)

    dispatch(setToasterAppear({ message: 'Question updated', type: 'success' }))
    onCancel()
  }

  return (
    <div className={styles['question-dialog__overlay']}>
      <div className={styles['question-dialog']}>
        <div className={styles['question-dialog__header']}>
          <h2 className={styles['question-dialog__title']}>
            New Multiple-Choice Question
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
                      type='text'
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(option.id, e.target.value)
                      }
                      placeholder='Enter option text'
                      className={styles['question-dialog__input']}
                    />
                  </div>
                  <button
                    type='button'
                    onClick={() => removeOption(option.id)}
                    className={styles['question-dialog__remove-button']}
                    disabled={options.length <= 2}
                  >
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
                  </button>
                </div>
              ))}
            </div>

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
                  ? handleSave
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

export default MultipleChoiceDialog
