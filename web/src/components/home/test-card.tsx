import { FC } from 'react'
import style from '../../style/components/test-card.module.scss'
import { TestCardProps } from '../../constant/common'
import Button from '../ui/button'

const TestCard: FC<TestCardProps> = ({
  id,
  title,
  description
}: TestCardProps) => {
  console.log(id)

  return (
    <div className={style.card}>
      <div className={style.card__title}>{title}</div>
      <div className={style.card__description}>{description}</div>
      <div className={style.card__footer}>
        <Button variant='primary'>View test</Button>
        <Button variant='primary'>Clone test</Button>
      </div>
    </div>
  )
}

export default TestCard
