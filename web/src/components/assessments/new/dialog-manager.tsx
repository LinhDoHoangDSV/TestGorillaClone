import type { FC } from 'react'
import EssayQuestionDialog from './create-essay'
import MultipleChoiceDialog from './create-multiple-choice'
import CodingQuestionDialog from './create-coding'
import { Question } from '../../../constant/common'

interface QuestionDialogManagerProps {
  onCancel: () => void
  questionType: string | null
  setQuestions: (questions: Question[]) => void
  questions: Question[]
  rowIndex: number
}

const QuestionDialogManager: FC<QuestionDialogManagerProps> = ({
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
          onCancel={onCancel}
          setQuestions={setQuestions}
          questions={questions}
          rowIndex={rowIndex}
        />
      )
    case 'multiple_choice':
      return (
        <MultipleChoiceDialog
          onCancel={onCancel}
          setQuestions={setQuestions}
          questions={questions}
          rowIndex={rowIndex}
        />
      )
    case 'coding':
      return (
        <CodingQuestionDialog
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

export default QuestionDialogManager
