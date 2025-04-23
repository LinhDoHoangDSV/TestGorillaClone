import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../style/components/drop-down.module.scss'
import { logout } from '../api/auth.api'
import { useDispatch } from 'react-redux'
import { clearAuth } from '../redux/slices/user.slice'

interface UserDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export const UserDropdown: FC<UserDropdownProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleProfileClick = () => {
    navigate('/profile')
    onClose()
  }

  const handleLogout = async () => {
    await logout()
    dispatch(clearAuth())
    navigate('/login')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdown__arrow}></div>
      <ul className={styles.dropdown__list}>
        <li className={styles.dropdown__item} onClick={handleProfileClick}>
          <span className={styles.dropdown__text}>My Profile</span>
        </li>
        <li className={styles.dropdown__item} onClick={handleLogout}>
          <span className={styles.dropdown__text}>Logout</span>
        </li>
      </ul>
    </div>
  )
}
