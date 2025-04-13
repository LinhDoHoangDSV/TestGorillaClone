import type { FC } from 'react'
import EssayQuestionDialog from './create-essay'
import MultipleChoiceDialog from './create-multiple-choice'
import CodingQuestionDialog from './create-coding'

interface QuestionDialogManagerProps {
  onSave: (question: any) => void
  onCancel: () => void
  questionType: string | null
}

const QuestionDialogManager: FC<QuestionDialogManagerProps> = ({
  onSave,
  onCancel,
  questionType
}) => {
  if (!questionType) return null

  switch (questionType) {
    case 'essay':
      return <EssayQuestionDialog onSave={onSave} onCancel={onCancel} />
    case 'multiple-choice':
      return <MultipleChoiceDialog onSave={onSave} onCancel={onCancel} />
    case 'coding':
      return <CodingQuestionDialog onSave={onSave} onCancel={onCancel} />
    default:
      return null
  }
}

export default QuestionDialogManager
