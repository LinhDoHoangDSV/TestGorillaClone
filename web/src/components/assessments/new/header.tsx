import { useEffect, useRef, useState, type FC } from 'react'
import Pencil from '../../../assets/pencil-solid.svg'
import styles from '../../../style/components/new-assessments/header.module.scss'

interface HeaderProps {
  title: string
  setTitle: (title: string) => void
}

const Header: FC<HeaderProps> = ({ title, setTitle }) => {
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false)
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
      <button className={styles['header__save-button']}>Save and exit</button>
    </div>
  )
}

export default Header
