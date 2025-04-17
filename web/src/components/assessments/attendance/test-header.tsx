import type { FC } from 'react'
import styles from '../../../style/components/assessments/attendance/test-header.module.scss'
import logoUrl from '../../../assets/logo.svg'

interface TestHeaderProps {
  onNext: () => void
}

const TestHeader: FC<TestHeaderProps> = ({ onNext }) => {
  return (
    <header className={styles.header}>
      <div className={styles.header__logo}>
        <img
          src={logoUrl || '/placeholder.svg'}
          alt='TestGorilla'
          className={styles.header__logoImage}
        />
      </div>
      <button className={styles.header__nextButton} onClick={onNext}>
        Next <span className={styles.header__nextIcon}>→</span>
      </button>
    </header>
  )
}

export default TestHeader
