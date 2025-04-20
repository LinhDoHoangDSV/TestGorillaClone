import type { FC } from 'react'
import styles from '../../../style/components/assessments/attendance/test-header.module.scss'
import logoUrl from '../../../assets/logo.svg'

interface TestHeaderProps {
  seconds: number
  onNext: () => void
}

const TestHeader: FC<TestHeaderProps> = ({ seconds, onNext }) => {
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60

    const pad = (num: number) => num.toString().padStart(2, '0')

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }

  return (
    <header className={styles.header}>
      <div className={styles.header__logo}>
        <img
          src={logoUrl || '/placeholder.svg'}
          alt='TestGorilla'
          className={styles.header__logoImage}
        />
      </div>
      <div className={styles.header__right}>
        <div className={styles.header__timer}>{formatTime(seconds)}</div>
        <button className={styles.header__nextButton} onClick={onNext}>
          Next <span className={styles.header__nextIcon}>→</span>
        </button>
      </div>
    </header>
  )
}

export default TestHeader
