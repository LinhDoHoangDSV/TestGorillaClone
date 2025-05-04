import style from '../style/components/loading.module.scss'
import spinnerImage from '../assets/spinner-solid.svg'

const Loading = () => {
  return (
    <div className={style.loader__container}>
      <img src={spinnerImage} className={style.loader__img}></img>
    </div>
  )
}

export default Loading
