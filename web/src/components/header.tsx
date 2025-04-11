import styles from '../style/components/header.module.scss'
import logoImage from '../assets/logo.svg'
import sidebarImage from '../assets/bars-solid.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AppSidebar } from './sidebar'

const Header = () => {
  const [activeState, setActiveState] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <header className={styles.header}>
        <div className={styles.header__container}>
          <div className={styles.header__logo}>
            <img
              src={logoImage}
              alt='TestGorilla'
              className={styles['header__logo--img']}
              onClick={() => navigate('/')}
            />
          </div>

          <nav className={styles.header__nav}>
            <ul className={styles.header__navList}>
              <li
                className={`${styles.header__navItem} ${
                  activeState === 0 ? styles['header__navItem--active'] : ''
                }`}
              >
                <Link to='/' onClick={() => setActiveState(0)}>
                  Home
                </Link>
              </li>
              <li
                className={`${styles.header__navItem} ${
                  activeState === 1 ? styles['header__navItem--active'] : ''
                }`}
              >
                <Link to='/assessments' onClick={() => setActiveState(1)}>
                  Assessments
                </Link>
              </li>
              <li
                className={`${styles.header__navItem} ${
                  activeState === 2 ? styles['header__navItem--active'] : ''
                }`}
              >
                <Link to='/candidates' onClick={() => setActiveState(2)}>
                  Candidates
                </Link>
              </li>
            </ul>
          </nav>

          <span className={styles.header__userInitials}>LH</span>

          <img
            src={sidebarImage}
            className={styles.header__bar}
            onClick={() => setSidebarOpen(true)}
            height={30}
          ></img>
        </div>
      </header>
      <AppSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeState={activeState}
        setActiveState={setActiveState}
      />
    </>
  )
}

export default Header
