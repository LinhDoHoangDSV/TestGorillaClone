import { type FC, useState } from 'react'
import styles from '../../../style/components/assessments/attendance/code-authen.module.scss'
import logoUrl from '../../../assets/logo.svg'
import { CodeAuthenticationProps } from '../../../constant/common'

const CodeAuthentication: FC<CodeAuthenticationProps> = ({
  testTitle,
  onAuthenticated
}) => {
  const [code, setCode] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAuthenticated(code.toString())
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
            </div>

            <button
              type='submit'
              className={styles.auth__button}
              disabled={!code.trim()}
            >
              Start Test
            </button>
          </form>
          <p className={styles.auth__note}>
            Note*: Your test will finish if you try to exit from fullscreen mode
          </p>
        </div>
      </div>
    </div>
  )
}

export default CodeAuthentication
