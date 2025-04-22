import { useDispatch, useSelector } from 'react-redux'
import styles from '../../style/components/home/dash-board.module.scss'
import StatCard from './start-card'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../redux/store'
import {
  setActiveState,
  setToasterAppear
} from '../../redux/slices/common.slice'
import { useEffect, useState } from 'react'
import { StatisticsResponse } from '../../constant/common'
import { getUserStatistics } from '../../api/statistic.api'
import { logout } from '../../api/auth.api'

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [statistics, setStatistics] = useState<StatisticsResponse>()
  const name = useSelector((state: RootState) => state.user.first_name)

  useEffect(() => {
    const firstFetch = async () => {
      const result = await getUserStatistics()

      if (result?.status > 299) {
        dispatch(
          setToasterAppear({
            message: 'Error while getting statistics',
            type: 'error'
          })
        )
        return
      }

      setStatistics(result?.data?.data)
    }

    firstFetch()
  }, [])

  console.log(statistics)

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboard__container}>
        <div className={styles.dashboard__header}>
          <h1 className={styles.dashboard__greeting}>
            Hello, {name}. Find your next hire with skills-based assessments.
          </h1>
          <button
            className={styles.dashboard__createBtn}
            onClick={async () => {
              await logout()
              // dispatch(setActiveState({ value: 1 }))
              // navigate('/assessments/new')
            }}
          >
            <span className={styles.dashboard__plusIcon}>+</span>
            Create assessment
          </button>
        </div>

        <div className={styles.dashboard__statsContainer}>
          <StatCard
            title='Active assessments'
            value={statistics?.active_assess}
          />
          <StatCard
            title='Total invitations sent'
            value={statistics?.total_invitation}
          />
          <StatCard
            title='Total assessments completed'
            value={statistics?.total_assess_complete}
          />
          <StatCard title='Candidates hired' value={0} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
