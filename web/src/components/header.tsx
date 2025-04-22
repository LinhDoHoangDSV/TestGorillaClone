import styles from '../style/components/header.module.scss'
import logoImage from '../assets/logo.svg'
import sidebarImage from '../assets/bars-solid.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AppSidebar } from './sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { setActiveState } from '../redux/slices/common.slice'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const activeState = useSelector(
    (state: RootState) => state.common.activeState
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
                <Link
                  to='/'
                  onClick={() => dispatch(setActiveState({ value: 0 }))}
                >
                  Home
                </Link>
              </li>
              <li
                className={`${styles.header__navItem} ${
                  activeState === 1 ? styles['header__navItem--active'] : ''
                }`}
              >
                <Link
                  to='/assessments'
                  onClick={() => dispatch(setActiveState({ value: 1 }))}
                >
                  Assessments
                </Link>
              </li>
              <li
                className={`${styles.header__navItem} ${
                  activeState === 2 ? styles['header__navItem--active'] : ''
                }`}
              >
                <Link
                  to='/candidates'
                  onClick={() => dispatch(setActiveState({ value: 2 }))}
                >
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
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}

export default Header
