import { StatCardProps } from '../../constant/common'
import styles from '../../style/components/home/start-card.module.scss'

const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <div className={styles['stat-card']}>
      <h2 className={styles['stat-card__value']}>{value}</h2>
      <p className={styles['stat-card__title']}>{title}</p>
    </div>
  )
}

export default StatCard
