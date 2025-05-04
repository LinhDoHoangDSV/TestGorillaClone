import Lottie from 'lottie-react'
import notfoundAnimation from '../assets/not-found.json'
import styles from '../style/components/not-found.module.scss'

const NotFound = () => {
  return (
    <Lottie
      className={styles.notfound}
      animationData={notfoundAnimation}
      loop={true}
    />
  )
}

export default NotFound
