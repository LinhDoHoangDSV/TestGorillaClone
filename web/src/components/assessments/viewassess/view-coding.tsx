import { FC, useState } from 'react'
import {
  InitialCode,
  LanguageID,
  QuestionDialogProps
} from '../../../constant/common'
import { useDispatch } from 'react-redux'
import { setToasterAppear } from '../../../redux/slices/common.slice'
import Button from '../../ui/button'
import styles from '../../../style/components/assessments/new/create-question.module.scss'

const CodingQuestionDialog: FC<QuestionDialogProps> = ({
  type,
  onCancel,
  setQuestions,
  questions,
  rowIndex
}) => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState<string>(
    rowIndex >= 0 ? questions[rowIndex]?.title : ''
  )
  const [description, setDescription] = useState<string>(
    rowIndex >= 0 ? questions[rowIndex]?.question_text : ''
  )
  const [score, setScore] = useState<string>(
    rowIndex >= 0 ? questions[rowIndex]?.score.toString() : '5'
  )
  const [counterTestCases, setCounterTestCases] = useState<number>(
    rowIndex >= 0 && questions[rowIndex]?.testcases?.length
      ? Math.max(...questions[rowIndex].testcases.map((item) => item.id)) + 1
      : 1
  )
  const [testCases, setTestCases] = useState(
    rowIndex >= 0
      ? questions[rowIndex]?.testcases
      : [{ id: 0, input: '', expected_output: '' }]
  )
  const [initialCodes, setInitialCodes] = useState<InitialCode>(
    rowIndex >= 0
      ? questions[rowIndex]?.initial_code
      : {
          description: '',
          initial_code: '',
          language_id: LanguageID.JS
        }
  )

  console.log(questions)

  console.log('title', title)
  console.log('description', description)
  console.log('initialCodes', initialCodes)
  console.log('testCases', testCases)

  const handleDelete = () => {
    if (rowIndex >= 0) {
      setQuestions(questions.filter((_, index) => index !== rowIndex))
      dispatch(
        setToasterAppear({ message: 'Question deleted', type: 'success' })
      )
      onCancel()
    }
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

    if (testCases?.length === 0) {
      dispatch(
        setToasterAppear({
          message: 'You must provide some testcases',
          type: 'error'
        })
      )
      return
    }

    const updatedQuestions = [...questions]
    updatedQuestions[rowIndex] = {
      question_type: 'coding',
      question_text: description,
      title,
      score: parseInt(score),
      testcases: testCases,
      initial_code: initialCodes
    }

    setQuestions(updatedQuestions)
    dispatch(setToasterAppear({ message: 'Question updated', type: 'success' }))
    onCancel()
  }

  const handleSave = () => {
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

    if (testCases?.length === 0) {
      dispatch(
        setToasterAppear({
          message: 'You must provide some testcases',
          type: 'error'
        })
      )
      return
    }

    setQuestions([
      ...questions,
      {
        question_type: 'coding',
        question_text: description,
        title,
        score: parseInt(score),
        testcases: testCases,
        initial_code: initialCodes
      }
    ])

    dispatch(setToasterAppear({ message: 'Question added', type: 'success' }))
    onCancel()
  }

  const handleStarterCodeChange = (code: string) => {
    setInitialCodes((prev) => ({
      ...prev,
      initial_code: code
    }))
  }

  const handleTestCaseChange = (
    id: number,
    field: 'input' | 'expected_output',
    value: string
  ) => {
    setTestCases((prev) =>
      prev.map((testCase) =>
        testCase.id === id ? { ...testCase, [field]: value } : testCase
      )
    )
  }

  const addTestCase = () => {
    setTestCases((prev) => [
      ...prev,
      { id: counterTestCases, input: '', expected_output: '' }
    ])
    setCounterTestCases((prev) => prev + 1)
  }

  const removeTestCase = (id: number) => {
    if (testCases.length <= 1) return
    setTestCases((prev) => prev.filter((testCase) => testCase.id !== id))
  }

  return (
    <div className={styles['question-dialog__overlay']}>
      <div className={styles['question-dialog']}>
        <div className={styles['question-dialog__header']}>
          <h2 className={styles['question-dialog__title']}>
            {rowIndex >= 0 ? 'Edit Coding Question' : 'New Coding Question'}
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
                disabled={type === 'view'}
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
                Problem description
              </label>
              <textarea
                id='description'
                disabled={type === 'view'}
                className={styles['question-dialog__textarea']}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Describe the coding problem in detail'
                rows={5}
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
                disabled={type === 'view'}
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
              JavaScript Starter Code
            </h3>
            <div className={styles['question-dialog__form-group']}>
              <textarea
                id={`starterCode`}
                className={`${styles['question-dialog__textarea']} ${styles['question-dialog__textarea--code']}`}
                value={initialCodes.initial_code}
                onChange={(e) => handleStarterCodeChange(e.target.value)}
                placeholder='// Provide JavaScript starter code for the candidate'
                disabled={type === 'view'}
                rows={6}
              />
            </div>
          </div>

          <div className={styles['question-dialog__section']}>
            <h3 className={styles['question-dialog__section-title']}>
              Test Cases
            </h3>
            <p className={styles['question-dialog__hint']}>
              Define test cases to validate the candidate's solution.
            </p>

            {testCases.map((testCase, index) => (
              <div
                key={testCase.id}
                className={styles['question-dialog__test-case']}
              >
                <div className={styles['question-dialog__test-case-header']}>
                  <h4 className={styles['question-dialog__test-case-title']}>
                    Test Case {index + 1}
                  </h4>
                  <button
                    type='button'
                    onClick={() => removeTestCase(testCase.id)}
                    className={styles['question-dialog__remove-button']}
                    disabled={testCases.length <= 1 || type === 'view'}
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

                <div className={styles['question-dialog__test-case-content']}>
                  <div className={styles['question-dialog__form-group']}>
                    <label
                      className={styles['question-dialog__label']}
                      htmlFor={`input-${testCase.id}`}
                    >
                      Input
                    </label>
                    <textarea
                      disabled={type === 'view'}
                      id={`input-${testCase.id}`}
                      className={styles['question-dialog__textarea']}
                      value={testCase.input}
                      onChange={(e) =>
                        handleTestCaseChange(
                          testCase.id,
                          'input',
                          e.target.value
                        )
                      }
                      placeholder='Enter test case input'
                      rows={2}
                    />
                  </div>

                  <div className={styles['question-dialog__form-group']}>
                    <label
                      className={styles['question-dialog__label']}
                      htmlFor={`output-${testCase.id}`}
                    >
                      Expected output
                    </label>
                    <textarea
                      id={`output-${testCase.id}`}
                      disabled={type === 'view'}
                      className={styles['question-dialog__textarea']}
                      value={testCase.expected_output}
                      onChange={(e) =>
                        handleTestCaseChange(
                          testCase.id,
                          'expected_output',
                          e.target.value
                        )
                      }
                      placeholder='Enter expected output'
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type='button'
              onClick={addTestCase}
              disabled={type === 'view'}
              className={styles['question-dialog__add-button']}
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
              Add test case
            </button>
          </div>
        </div>

        <div className={styles['question-dialog__footer']}>
          <Button
            disabled={type === 'view'}
            variant='secondary'
            onClick={rowIndex >= 0 ? handleDelete : onCancel}
          >
            {rowIndex >= 0 ? 'Delete' : 'Cancel'}
          </Button>
          <Button
            variant='primary'
            disabled={!title.trim() || type === 'view'}
            onClick={rowIndex >= 0 ? handleUpdate : handleSave}
          >
            {rowIndex >= 0 ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CodingQuestionDialog
