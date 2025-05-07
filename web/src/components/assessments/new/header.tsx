import { useEffect, useRef, useState, type FC } from 'react'
import Pencil from '../../../assets/pencil-solid.svg'
import styles from '../../../style/components/assessments/new/header.module.scss'
import { useNavigate } from 'react-router-dom'
import { HeaderProps } from '../../../constant/common'
import Button from '../../ui/button'

const Header: FC<HeaderProps> = ({ title, setTitle }) => {
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditingTitle && inputRef.current) inputRef.current.focus()
  }, [isEditingTitle])

  const handleChangeTitle = () => {
    setIsEditingTitle(true)
  }

  const handleEnter = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') setIsEditingTitle(false)
  }

  const handleBlur = () => {
    setIsEditingTitle(false)
  }

  const handleExit = () => {
    navigate('/')
  }

  return (
    <div className={styles['header']}>
      <div className={styles['header__left']}>
        {!isEditingTitle && (
          <h1 className={styles['header__title']}>{title}</h1>
        )}
        {isEditingTitle && (
          <input
            value={title}
            className={styles['header__input']}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleEnter}
            onBlur={handleBlur}
            ref={inputRef}
          />
        )}
        <img
          src={Pencil}
          width={15}
          alt='Edit icon'
          className={styles['header__img']}
          onClick={handleChangeTitle}
        />
      </div>
      <Button variant='secondary' onClick={handleExit}>
        Exit
      </Button>
    </div>
  )
}

export default Header
