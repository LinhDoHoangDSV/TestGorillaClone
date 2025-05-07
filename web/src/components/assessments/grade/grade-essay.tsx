import styles from '../../../style/components/assessments/grade/grade-essay.module.scss'

const GradeEssay = ({ question, marks, setMarks }) => {
  const handleChangeGrade = (e) => {
    const newScore = parseInt(e.target.value)

    if (isNaN(newScore) || newScore < 0 || newScore > question.score) {
      return
    }

    setMarks((prevMarks) =>
      prevMarks.map((mark) =>
        mark?.id === question?.candidate_answer?.id
          ? { ...mark, score: newScore }
          : mark
      )
    )
  }

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
          // onChange={}
          placeholder='Type your answer here...'
          disabled={true}
          rows={10}
        />
        <div className={styles.question__givingGrade}>
          <p>Grading: </p>
          <input
            className={styles.question__pointInput}
            placeholder='Give your point'
            type='number'
            max={question?.score}
            min={0}
            value={
              marks.find((mark) => mark?.id === question?.candidate_answer?.id)
                ?.score || 0
            }
            disabled={!question?.candidate_answer}
            onChange={handleChangeGrade}
          ></input>
        </div>
      </div>
    </div>
  )
}

export default GradeEssay
