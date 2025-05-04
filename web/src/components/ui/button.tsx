import type { FC } from 'react'
import styles from '../../style/ui/button.module.scss'
import { ButtonProps } from '../../constant/common'

const Button: FC<ButtonProps> = ({ children, variant, ...props }) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`} {...props}>
      {children}
    </button>
  )
}

export default Button
