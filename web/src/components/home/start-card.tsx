import styles from '../../style/components/start-card.module.scss'

interface StatCardProps {
  title: string
  value: number
}

const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <div className={styles['stat-card']}>
      <h2 className={styles['stat-card__value']}>{value}</h2>
      <p className={styles['stat-card__title']}>{title}</p>
    </div>
  )
}

export default StatCard
