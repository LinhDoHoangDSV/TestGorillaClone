import { FC, useEffect, useState } from 'react'
import styles from '../../../style/components/assessments/attendance/coding.module.scss'
import {
  CodingQuestionProps,
  LanguageID,
  TestCaseProps
} from '../../../constant/common'
import { getCodeResult, submitCode } from '../../../api/user-answers.api'
import { useDispatch } from 'react-redux'
import { setToasterAppear } from '../../../redux/slices/common.slice'

const CodingQuestion: FC<CodingQuestionProps> = ({
  answer,
  setAnswer,
  question,
  setScore
}) => {
  const dispatch = useDispatch()
  const [initialCode, setInitialCode] = useState<string>(
    question.initial_code?.initial_code
  )
  const [userCode, setUserCode] = useState<string>(initialCode)
  const [runningTests, setRunningTests] = useState<boolean>(false)
  const [testResults, setTestResults] = useState<TestCaseProps[]>([
    ...question.testcases
  ])

  useEffect(() => {
    setInitialCode(question.initial_code?.initial_code)
    setUserCode(question.initial_code?.initial_code)
    setTestResults([...question.testcases])
  }, [question])

  const runTests = async () => {
    setRunningTests(true)

    const tempTestResults = [...testResults]
    const listToken: string[] = []

    for (const index in tempTestResults) {
      const listParams = tempTestResults[index].input?.split(';') || []
      const listName: string[] = listParams.map((param) =>
        param.split('=')[0].trim()
      )

      let declareVariables = ''
      listParams.forEach((param) => {
        declareVariables += `const ${param};`
      })

      const newCode = `
        ${declareVariables}
        ${userCode}
        console.log(main(${listName.join(',')}))
      `

      const result = await submitCode({
        code: newCode,
        languageId: LanguageID.JS
      })

      const token = result?.data?.data?.token
      if (token) {
        tempTestResults[index].token = token
        listToken.push(token)
      } else {
        console.error(`Failed to get token for test case ${index}`)
        tempTestResults[index].output = 'Error: No token received'
      }
    }

    const delay = (time: number) =>
      new Promise((resolve) => setTimeout(resolve, time))

    let counter = 0
    const size = listToken.length
    const maxAttempts = size * 10

    while (listToken.length > 0) {
      if (counter >= maxAttempts) {
        dispatch(
          setToasterAppear({ message: 'Time limit exceed', type: 'error' })
        )
        break
      }

      if (counter % size === 0) {
        await delay(1500)
      }

      counter++
      const token = listToken[0]
      const codeResult = await getCodeResult(token)

      if (codeResult?.data?.data?.status?.description.includes('Runtime')) {
        dispatch(setToasterAppear({ message: 'Runtime error', type: 'error' }))
        listToken.shift()
        continue
      } else if (codeResult?.data?.data?.status?.description !== 'Accepted') {
        listToken.push(token)
        listToken.shift()
        continue
      }

      const stdout = codeResult?.data?.data?.stdout
      if (stdout) {
        const output = atob(stdout).trim()
        tempTestResults.forEach((testResult, index) => {
          if (testResult.token === token) {
            tempTestResults[index].output = output
          }
        })
      } else {
        tempTestResults.forEach((testResult, index) => {
          if (testResult.token === token) {
            tempTestResults[index].output = 'Error: No output received'
          }
        })
      }

      listToken.shift()
    }

    const testLength: number = tempTestResults.length
    let countRight: number = 0

    tempTestResults.forEach((temp) => {
      if (temp.output === temp.expected_output) countRight++
    })

    setScore(Math.floor((question.score * countRight) / testLength))
    setAnswer(userCode)

    setTestResults(tempTestResults)
    setRunningTests(false)
  }

  const handleRollback = () => {
    setUserCode(initialCode)
  }

  return (
    <div className={styles.question}>
      <div className={styles.question__content}>
        {question.title && (
          <div className={styles.question__title}>{question.title}</div>
        )}
        {question.question_text.split('\n').map((text, index) => (
          <div className={styles.question__text} key={index}>
            {text}
          </div>
        ))}
      </div>

      <div className={styles.question__editor}>
        <div className={styles.question__editorHeader}>
          <h3 className={styles.question__editorTitle}>YOUR CODE</h3>
          <svg
            className={styles.question__editorIcon}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 512 512'
            onClick={handleRollback}
          >
            <path d='M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z' />
          </svg>
        </div>
        <textarea
          className={styles.question__editorTextarea}
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          placeholder='Write your code here...'
          rows={15}
          spellCheck={false}
        />
      </div>

      <div className={styles.question__actions}>
        <button
          className={styles.question__runButton}
          onClick={runTests}
          disabled={runningTests}
        >
          {runningTests ? 'Running Tests...' : 'Run Tests'}
        </button>
      </div>

      <div className={styles.question__testCases}>
        <h3 className={styles.question__testCasesTitle}>TEST CASES</h3>

        {testResults.map((testCase, index) => (
          <div
            key={testCase.id}
            className={`${styles.question__testCase} ${
              testCase.output !== undefined &&
              testCase.output === testCase.expected_output
                ? styles['question__testCase--passed']
                : styles['question__testCase--failed']
            }`}
          >
            <div className={styles.question__testCaseHeader}>
              <span className={styles.question__testCaseTitle}>
                Test Case #{index + 1}
              </span>
              {testCase.output !== undefined && (
                <span className={styles.question__testCaseResult}>
                  {testCase.output === testCase.expected_output
                    ? 'Passed'
                    : 'Failed'}
                </span>
              )}
            </div>

            <div className={styles.question__testCaseDetails}>
              <div className={styles.question__testCaseInput}>
                <span className={styles.question__testCaseLabel}>Input:</span>
                <pre className={styles.question__testCaseCode}>
                  {testCase.input}
                </pre>
              </div>

              <div className={styles.question__testCaseExpected}>
                <span className={styles.question__testCaseLabel}>
                  Expected Output:
                </span>
                <span className={styles.question__testCaseCode}>
                  {testCase.expected_output}
                </span>
              </div>

              {testCase.output !== undefined && (
                <div className={styles.question__testCaseActual}>
                  <span className={styles.question__testCaseLabel}>
                    Your Output:
                  </span>
                  <span className={styles.question__testCaseCode}>
                    {testCase?.output}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CodingQuestion
