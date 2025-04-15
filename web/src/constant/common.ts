import { JSX } from 'react'

export type RouterType = {
  title: string
  path: string
  element: JSX.Element
  header: boolean | JSX.Element
  footer: boolean | JSX.Element
}

export const steps = [
  { id: 1, name: 'Add questions' },
  { id: 2, name: 'Finalize' }
]

export interface ContentProps {
  title: string
}

export interface AnswerType {
  option_text: string
  is_correct: boolean
}

// export interface ContentProps {
//   title: string
//   description: string
//   setDescription: (description: string) => void
//   isPublic: boolean
//   setIsPublic: (isPublic: boolean) => void
// }
export interface QuestionsType {
  question_type: string
  question_text: string
  title: string
  score: number
  answers: AnswerType[] | null
}

export interface QuestionTypeProps {
  questions: QuestionsType[]
  setQuestions: (questions: QuestionsType[]) => void
}

export interface QuestionDialogProps {
  onCancel: () => void
  setQuestions: (questions: QuestionsType[]) => void
  questions: QuestionsType[]
  rowIndex: number
}

export const sampleMulQuestion: QuestionsType = {
  question_text: '',
  answers: null,
  question_type: 'multiple_choice',
  score: 5,
  title: ''
}

export const sampleEssayQuestion: QuestionsType = {
  question_text: '',
  answers: null,
  question_type: 'essay',
  score: 5,
  title: ''
}

export const questionTypes = [
  { id: 'essay', name: 'Essay', icon: 'document' },
  {
    id: 'multiple_choice',
    name: 'Multiple-choice',
    icon: 'list'
  },
  { id: 'coding', name: 'Coding', icon: 'coding' }
]

export interface ToasterProps {
  message: string
  type: string // info / success / error
}

export interface CandidateProps {
  candidates: {
    id: number
    email: string
    completionTime: string
    score: number
  }[]
}

export interface QuestionProps {
  questions: {
    id: number
    type: string
    title: string
    score: number
  }[]
}

export interface Candidate {
  id: number
  email: string
  completionTime: string
  score: number
}

export interface Question {
  id: number
  type: string
  title: string
  score: number
}
