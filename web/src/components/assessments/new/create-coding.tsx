'use client'

import { type FC, useState } from 'react'
import styles from '../../../style/components/new-assessments/create-question.module.scss'
import Button from '../../ui/button'

interface CodingQuestionDialogProps {
  // onSave: (question: any) => void
  onCancel: () => void
}

const CodingQuestionDialog: FC<CodingQuestionDialogProps> = ({
  // onSave,
  onCancel
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timeLimit, setTimeLimit] = useState(30) // Default 30 minutes
  const [programmingLanguage, setProgrammingLanguage] = useState('javascript')
  const [starterCode, setStarterCode] = useState('')
  const [testCases, setTestCases] = useState([
    { id: '1', input: '', expectedOutput: '', isHidden: false }
  ])
  const [evaluationCriteria, setEvaluationCriteria] = useState('')

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'go', label: 'Go' }
  ]

  const handleTestCaseChange = (
    id: string,
    field: 'input' | 'expectedOutput' | 'isHidden',
    value: string | boolean
  ) => {
    setTestCases(
      testCases.map((testCase) =>
        testCase.id === id ? { ...testCase, [field]: value } : testCase
      )
    )
  }

  const addTestCase = () => {
    const newId = (testCases.length + 1).toString()
    setTestCases([
      ...testCases,
      { id: newId, input: '', expectedOutput: '', isHidden: false }
    ])
  }

  const removeTestCase = (id: string) => {
    if (testCases.length <= 1) return // Keep at least one test case
    setTestCases(testCases.filter((testCase) => testCase.id !== id))
  }

  // const handleSave = () => {
  //   if (!title.trim()) {
  //     return // Validate required fields
  //   }

  //   onSave({
  //     type: 'coding',
  //     title,
  //     description,
  //     timeLimit,
  //     programmingLanguage,
  //     starterCode,
  //     testCases,
  //     evaluationCriteria
  //   })
  // }

  return (
    <div className={styles['question-dialog__overlay']}>
      <div className={styles['question-dialog']}>
        <div className={styles['question-dialog__header']}>
          <h2 className={styles['question-dialog__title']}>
            New Coding Question
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
            <h3 className={styles['question-dialog__section-title']}>
              Question
            </h3>
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
                Problem description
              </label>
              <textarea
                id='description'
                className={styles['question-dialog__textarea']}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Describe the coding problem in detail'
                rows={5}
              />
            </div>
          </div>

          <div className={styles['question-dialog__section']}>
            <h3 className={styles['question-dialog__section-title']}>
              Settings
            </h3>
            <div className={styles['question-dialog__form-group']}>
              <label
                className={styles['question-dialog__label']}
                htmlFor='timeLimit'
              >
                Time limit (minutes)
              </label>
              <input
                id='timeLimit'
                type='number'
                className={styles['question-dialog__input']}
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                min={5}
              />
            </div>

            <div className={styles['question-dialog__form-group']}>
              <label
                className={styles['question-dialog__label']}
                htmlFor='programmingLanguage'
              >
                Programming language
              </label>
              <select
                id='programmingLanguage'
                className={styles['question-dialog__select']}
                value={programmingLanguage}
                onChange={(e) => setProgrammingLanguage(e.target.value)}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles['question-dialog__form-group']}>
              <label
                className={styles['question-dialog__label']}
                htmlFor='starterCode'
              >
                Starter code (optional)
              </label>
              <textarea
                id='starterCode'
                className={`${styles['question-dialog__textarea']} ${styles['question-dialog__textarea--code']}`}
                value={starterCode}
                onChange={(e) => setStarterCode(e.target.value)}
                placeholder='// Provide starter code for the candidate'
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
                    disabled={testCases.length <= 1}
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
                      className={styles['question-dialog__textarea']}
                      value={testCase.expectedOutput}
                      onChange={(e) =>
                        handleTestCaseChange(
                          testCase.id,
                          'expectedOutput',
                          e.target.value
                        )
                      }
                      placeholder='Enter expected output'
                      rows={2}
                    />
                  </div>

                  <div className={styles['question-dialog__checkbox-group']}>
                    <input
                      type='checkbox'
                      id={`hidden-${testCase.id}`}
                      checked={testCase.isHidden}
                      onChange={(e) =>
                        handleTestCaseChange(
                          testCase.id,
                          'isHidden',
                          e.target.checked
                        )
                      }
                      className={styles['question-dialog__checkbox']}
                    />
                    <label
                      htmlFor={`hidden-${testCase.id}`}
                      className={styles['question-dialog__checkbox-label']}
                    >
                      Hidden test case (not visible to candidate)
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <button
              type='button'
              onClick={addTestCase}
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

          <div className={styles['question-dialog__section']}>
            <h3 className={styles['question-dialog__section-title']}>
              Information for your team
            </h3>
            <div className={styles['question-dialog__form-group']}>
              <label
                className={styles['question-dialog__label']}
                htmlFor='evaluationCriteria'
              >
                What to look for in the solution?
              </label>
              <textarea
                id='evaluationCriteria'
                className={styles['question-dialog__textarea']}
                value={evaluationCriteria}
                onChange={(e) => setEvaluationCriteria(e.target.value)}
                placeholder='Enter evaluation criteria (not shown to candidates)'
                rows={4}
              />
              <p className={styles['question-dialog__hint']}>
                This information will not be shown to candidates.
              </p>
            </div>
          </div>
        </div>

        <div className={styles['question-dialog__footer']}>
          <Button variant='secondary' onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant='primary'
            // onClick={handleSave}
            disabled={!title.trim()}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CodingQuestionDialog
