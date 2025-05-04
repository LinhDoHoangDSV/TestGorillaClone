import { FC, useEffect, useState } from 'react'
import styles from '../../style/ui/toast.module.scss'
import { ToasterProps } from '../../constant/common'
import { useDispatch } from 'react-redux'
import { setToasterDissappear } from '../../redux/slices/common.slice'

const Toaster: FC<ToasterProps> = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setToasterDissappear())
      setIsVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className={`${styles.toaster} ${styles[`toaster--${type}`]}`}>
      <div className={styles['toaster__content']}>
        <span className={styles['toaster__message']}>{message}</span>
      </div>
    </div>
  )
}

export default Toaster
