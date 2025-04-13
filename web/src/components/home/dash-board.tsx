import styles from '../../style/components/home/dash-board.module.scss'
import StatCard from './start-card'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboard__container}>
        <div className={styles.dashboard__header}>
          <h1 className={styles.dashboard__greeting}>
            Hello, Linh. Find your next hire with skills-based assessments.
          </h1>
          <button
            className={styles.dashboard__createBtn}
            onClick={() => navigate('/assessments/new')}
          >
            <span className={styles.dashboard__plusIcon}>+</span>
            Create assessment
          </button>
        </div>

        <div className={styles.dashboard__statsContainer}>
          <StatCard title='Active assessments' value={0} />
          <StatCard title='Total invitations sent' value={0} />
          <StatCard title='Total assessments completed' value={0} />
          <StatCard title='Candidates hired' value={0} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
