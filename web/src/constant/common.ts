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

export interface QuestionsType {
  type: string
  title: string
  description: string
  id: number
}

export interface QuestionTypeProps {
  questions: QuestionsType[]
  setQuestions: (questions: QuestionsType[]) => void
}

export const questionTypes = [
  { id: 'essay', name: 'Essay', icon: 'document' },
  {
    id: 'multiple-choice',
    name: 'Multiple-choice',
    icon: 'list'
  },
  { id: 'coding', name: 'Coding', icon: 'coding' }
]
