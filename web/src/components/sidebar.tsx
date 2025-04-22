import { Link } from 'react-router-dom'
import styles from '../style/components/sidebar.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { setActiveState } from '../redux/slices/common.slice'

type SidebarProps = {
  open: boolean
  onClose: () => void
}

export const AppSidebar = ({ open, onClose }: SidebarProps) => {
  const dispatch = useDispatch()
  const activeState = useSelector(
    (state: RootState) => state.common.activeState
  )
  const userState = useSelector((state: RootState) => state.user)
  const navItems = [
    { title: 'Home', path: '/', id: 0 },
    { title: 'Assessments', path: '/assessments', id: 1 },
    { title: 'Candidates', path: '/candidates', id: 2 }
  ]

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayVisible : ''}`}
        onClick={onClose}
      ></div>

      <aside
        className={`${styles.sidebar} ${open ? styles['sidebar--open'] : ''}`}
      >
        <div className={styles.sidebar__header}>
          <button className={styles.sidebar__closeBtn} onClick={onClose}>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M18 6L6 18'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M6 6L18 18'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>

        <nav className={styles.sidebar__nav}>
          <ul className={styles.sidebar__navList}>
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`${styles.sidebar__navItem} ${activeState === item.id ? styles['sidebar__navItem--active'] : ''}`}
              >
                <Link
                  to={item.path}
                  onClick={() => {
                    dispatch(setActiveState({ value: item.id }))
                    onClose()
                  }}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.sidebar__settings}>
            <Link to='/settings' onClick={onClose}>
              Settings
            </Link>
          </div>
        </nav>

        <div className={styles.sidebar__footer}>
          <div className={styles.sidebar__user}>
            <div
              className={styles.sidebar__userInitials}
            >{`${userState.last_name.slice(0, 1)}${userState.first_name.slice(0, 1)}`}</div>
            <div className={styles.sidebar__userInfo}>
              <p
                className={styles.sidebar__userName}
              >{`${userState.last_name} ${userState.first_name}`}</p>
              <p className={styles.sidebar__userEmail}>{userState.email}</p>
            </div>
            <button className={styles.sidebar__signOutBtn}>
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M18 8L22 12L18 16'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M12 12H22'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M12 4V12C12 14.2091 10.2091 16 8 16H4'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
