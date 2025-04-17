import { useState } from 'react'
import TestTaker from './test-taker'
import CodeAuthentication from './code-authen'
import { sampleTest } from '../../../constant/common'
import styles from '../../../style/components/assessments/attendance/index.module.scss'

function TakeAssessmentComp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleAuthenticated = () => {
    setIsAuthenticated(true)
  }

  const handleTestComplete = (testAnswers: Record<string, string>) => {
    setAnswers(testAnswers)
    setTestCompleted(true)
  }

  const handleRestart = () => {
    setTestCompleted(false)
    setAnswers({})
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.app}>
        <CodeAuthentication
          testTitle={sampleTest.title}
          correctCode={sampleTest.accessCode}
          onAuthenticated={handleAuthenticated}
        />
      </div>
    )
  }

  if (testCompleted) {
    return (
      <div className={styles.app}>
        <div className={styles.app__completed}>
          <h1>Test Completed!</h1>
          <p>Thank you for completing the test.</p>
          <div className={styles.app__answers}>
            <h2>Your Answers:</h2>
            {Object.entries(answers).map(([questionId, answer]) => {
              const question = sampleTest.questions.find(
                (q) => q.id === questionId
              )
              return (
                <div key={questionId} className={styles.app__answer}>
                  <h3>{question?.text}</h3>
                  {question?.type === 'multiple_choice' ? (
                    <p>
                      Selected:{' '}
                      {question.options?.find((opt) => opt.id === answer)
                        ?.text || 'No answer'}
                    </p>
                  ) : (
                    <p className={styles.app__essayAnswer}>
                      {answer || 'No answer'}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
          <button className={styles.app__restartButton} onClick={handleRestart}>
            Restart Test
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <TestTaker test={sampleTest} onComplete={handleTestComplete} />
    </div>
  )
}

export default TakeAssessmentComp
