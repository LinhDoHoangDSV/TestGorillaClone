import { type FC, useState } from 'react'
import styles from '../../../style/components/assessments/attendance/code-authen.module.scss'
import logoUrl from '../../../assets/logo.svg'

interface CodeAuthenticationProps {
  testTitle: string
  correctCode: string
  onAuthenticated: () => void
}

const CodeAuthentication: FC<CodeAuthenticationProps> = ({
  testTitle,
  correctCode,
  onAuthenticated
}) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Simulate a slight delay for better UX
    setTimeout(() => {
      // if (code.trim().toUpperCase() === correctCode.toUpperCase()) {
      //   onAuthenticated()
      // } else {
      //   setError('Invalid access code. Please try again.')
      // }
      onAuthenticated()
      setIsSubmitting(false)
    }, 500)
  }

  return (
    <div className={styles.auth}>
      <div className={styles.auth__header}>
        <img
          src={logoUrl || '/placeholder.svg'}
          alt='TestGorilla'
          className={styles.auth__logo}
        />
      </div>

      <div className={styles.auth__container}>
        <div className={styles.auth__card}>
          <h1 className={styles.auth__title}>Enter Access Code</h1>
          <p className={styles.auth__description}>
            Please enter the access code to begin the test:{' '}
            <strong>{testTitle}</strong>
          </p>

          <form onSubmit={handleSubmit} className={styles.auth__form}>
            <div className={styles.auth__formGroup}>
              <label htmlFor='accessCode' className={styles.auth__label}>
                Access Code
              </label>
              <input
                id='accessCode'
                type='text'
                className={styles.auth__input}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder='Enter your access code'
                autoComplete='off'
                required
              />
              {error && <div className={styles.auth__error}>{error}</div>}
            </div>

            <button
              type='submit'
              className={styles.auth__button}
              disabled={isSubmitting || !code.trim()}
            >
              {isSubmitting ? 'Verifying...' : 'Start Test'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CodeAuthentication
