import type { FC } from 'react'
import EssayQuestionDialog from './view-essay'
import MultipleChoiceDialog from './view-multiple'
import { Question } from '../../../constant/common'

interface QuestionDialogManagerProps {
  type: string
  onCancel: () => void
  questionType: string | null
  setQuestions: (questions: Question[]) => void
  questions: Question[]
  rowIndex: number
}

const ViewDialogManager: FC<QuestionDialogManagerProps> = ({
  type,
  onCancel,
  questionType,
  setQuestions,
  questions,
  rowIndex
}) => {
  switch (questionType) {
    case 'essay':
      return (
        <EssayQuestionDialog
          type={type}
          onCancel={onCancel}
          setQuestions={setQuestions}
          questions={questions}
          rowIndex={rowIndex}
        />
      )
    case 'multiple_choice':
      return (
        <MultipleChoiceDialog
          type={type}
          onCancel={onCancel}
          setQuestions={setQuestions}
          questions={questions}
          rowIndex={rowIndex}
        />
      )
    default:
      return null
  }
}

export default ViewDialogManager
