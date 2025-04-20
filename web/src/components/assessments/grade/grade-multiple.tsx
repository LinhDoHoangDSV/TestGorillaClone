import styles from '../../../style/components/assessments/grade/grade-multiple.module.scss'

const GradeMultiple = ({ question }) => {
  return (
    <div className={styles.question}>
      <div className={styles.question__content}>
        {question.title && (
          <div className={styles.question__description}>{question.title}</div>
        )}
        {question.question_text.split('\n').map((text, index) => (
          <div className={styles.question__text} key={index}>
            {text}
          </div>
        ))}
      </div>

      <div className={styles.question__options}>
        <h3 className={styles.question__optionsTitle}>SELECT ONLY ONE</h3>

        {question.answers?.map((thisAnswer) => {
          const isCorrect = thisAnswer?.is_correct
          const isCandidateAnswer =
            question?.candidate_answer?.answer_text === thisAnswer?.option_text
          let optionItemClass = styles.question__optionItem
          let radioCircleClass = styles.question__optionRadioCircle

          if (isCorrect && !question?.candidate_answer?.answer_text) {
            optionItemClass = `${styles.question__optionItem} ${styles['question__optionItem--incorrect']}`
            radioCircleClass = `${styles.question__optionRadioCircle} ${styles['question__optionRadioCircle--incorrect']}`
          } else if (isCorrect) {
            optionItemClass = `${styles.question__optionItem} ${styles['question__optionItem--correct']}`
            radioCircleClass = `${styles.question__optionRadioCircle} ${styles['question__optionRadioCircle--correct']}`
          } else if (isCandidateAnswer && !isCorrect) {
            optionItemClass = `${styles.question__optionItem} ${styles['question__optionItem--incorrect']}`
            radioCircleClass = `${styles.question__optionRadioCircle} ${styles['question__optionRadioCircle--incorrect']}`
          }

          return (
            <div key={thisAnswer?.id} className={optionItemClass}>
              <div className={styles.question__optionRadio}>
                <div className={radioCircleClass} />
              </div>
              <div className={styles.question__optionText}>
                {thisAnswer.option_text}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GradeMultiple
