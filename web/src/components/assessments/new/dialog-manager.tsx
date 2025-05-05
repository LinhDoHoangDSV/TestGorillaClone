import type { FC } from 'react'
import EssayQuestionDialog from './create-essay'
import MultipleChoiceDialog from './create-multiple-choice'
import CodingQuestionDialog from './create-coding'
import { QuestionDialogManagerProps } from '../../../constant/common'

const QuestionDialogManager: FC<QuestionDialogManagerProps> = ({
  onCancel,
  questionType,
  setQuestions,
  questions,
  rowIndex,
  actionType,
  testId
}) => {
  switch (questionType) {
    case 'essay':
      return (
        <EssayQuestionDialog
          onCancel={onCancel}
          setQuestions={setQuestions}
          questions={questions}
          rowIndex={rowIndex}
          actionType={actionType}
          testId={testId}
        />
      )
    case 'multiple_choice':
      return (
        <MultipleChoiceDialog
          onCancel={onCancel}
          setQuestions={setQuestions}
          questions={questions}
          rowIndex={rowIndex}
          actionType={actionType}
          testId={testId}
        />
      )
    case 'coding':
      return (
        <CodingQuestionDialog
          onCancel={onCancel}
          setQuestions={setQuestions}
          questions={questions}
          rowIndex={rowIndex}
          actionType={actionType}
          testId={testId}
        />
      )
    default:
      return null
  }
}

export default QuestionDialogManager
