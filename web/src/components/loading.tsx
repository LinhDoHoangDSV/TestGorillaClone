import style from '../style/components/loading.module.scss'
import spinnerImage from '../assets/spinner-solid.svg'

const Loading = () => {
  return (
    <div className={style.app__imgContainer}>
      <img src={spinnerImage} className={style.app__img}></img>
    </div>
  )
}

export default Loading
