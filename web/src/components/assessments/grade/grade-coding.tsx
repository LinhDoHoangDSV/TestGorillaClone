import styles from '../../../style/components/assessments/grade/grade-essay.module.scss'

const GradeCoding = ({ question }) => {
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

      <div className={styles.question__answer}>
        <h3 className={styles.question__answerTitle}>CANDIDATE'S ANSWER</h3>
        <textarea
          className={styles.question__answerTextarea}
          value={question?.candidate_answer?.answer_text || 'No answer'}
          placeholder='Type your answer here...'
          disabled={true}
          rows={10}
        />
      </div>
    </div>
  )
}

export default GradeCoding
