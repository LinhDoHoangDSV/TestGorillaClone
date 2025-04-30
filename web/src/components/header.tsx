import styles from '../style/components/header.module.scss'
import logoImage from '../assets/logo.svg'
import sidebarImage from '../assets/bars-solid.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { AppSidebar } from './sidebar'
import { UserDropdown } from './drop-down'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { setActiveState } from '../redux/slices/common.slice'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const activeState = useSelector(
    (state: RootState) => state.common.activeState
  )
  const user = useSelector((state: RootState) => state.user)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        !event.target.classList.contains(styles.header__userInitials)
      ) {
        setUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen)
  }

  const formatAvatar = () => {
    return `${user.first_name.slice(0, 1)}${user.last_name.slice(0, 1)}`
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.header__container}>
          <div className={styles.header__logo}>
            <img
              src={logoImage || '/placeholder.svg'}
              alt='TestGorilla'
              className={styles['header__logo--img']}
              onClick={() => navigate('/')}
            />
          </div>

          <nav className={styles.header__nav}>
            <ul className={styles.header__navList}>
              <li
                className={`${styles.header__navItem} ${activeState === 0 ? styles['header__navItem--active'] : ''}`}
              >
                <Link
                  to='/'
                  onClick={() => dispatch(setActiveState({ value: 0 }))}
                >
                  Home
                </Link>
              </li>
              <li
                className={`${styles.header__navItem} ${activeState === 1 ? styles['header__navItem--active'] : ''}`}
              >
                <Link
                  to='/assessments'
                  onClick={() => dispatch(setActiveState({ value: 1 }))}
                >
                  Assessments
                </Link>
              </li>
              <li
                className={`${styles.header__navItem} ${activeState === 2 ? styles['header__navItem--active'] : ''}`}
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

          <div className={styles.header__userContainer} ref={userDropdownRef}>
            <span
              className={styles.header__userInitials}
              onClick={toggleUserDropdown}
            >
              {formatAvatar()}
            </span>
            <UserDropdown
              isOpen={userDropdownOpen}
              onClose={() => setUserDropdownOpen(false)}
            />
          </div>

          <img
            src={sidebarImage || '/placeholder.svg'}
            className={styles.header__bar}
            onClick={() => setSidebarOpen(true)}
            height={30}
            alt='Menu'
          />
        </div>
      </header>
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}

export default Header
