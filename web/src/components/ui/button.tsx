import type { FC, ReactNode, ButtonHTMLAttributes } from 'react'
import styles from '../../style/ui/button.module.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant: 'primary' | 'secondary'
}

const Button: FC<ButtonProps> = ({ children, variant, ...props }) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`} {...props}>
      {children}
    </button>
  )
}

export default Button
