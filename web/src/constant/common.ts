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
  id?: number
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
  questions: Question[]
  setQuestions: (questions: Question[]) => void
}

export interface QuestionDialogProps {
  type: string
  onCancel: () => void
  setQuestions: (questions: Question[]) => void
  questions: Question[]
  rowIndex: number
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
  testAssignments: TestAssignment[]
}

export interface QuestionProps {
  type: string
  questions: Question[]
  setQuestions: (questions: Question[]) => void
}

export interface TestAssignment {
  id: number
  test_id: number
  candidate_email: string
  expired_invitation: Date
  started_at: Date
  is_online: boolean
  score: number
  code: string
  status: string
}

export interface Question {
  id: number
  test_id: number
  question_text: string
  question_type: string
  score: number
  title: string
  answers?: AnswerType[]
}

export interface UpdateQuestionDto {
  id: number
  test_id?: number
  question_text?: string
  question_type?: string
  score?: number
  title?: string
}

export const sampleQuestion: Partial<Question> = {}

export interface TestEntity {
  id?: number
  owner_id?: number
  title?: string
  description?: string
  test_time?: number
  deleted_at?: Date | null
  is_publish?: boolean
}

export interface TestInfoProps {
  testId: number
  type: string
}
//from here
export type QuestionType = 'multiple_choice' | 'essay'

export interface Option {
  id: string
  text: string
}

export interface Questionn {
  id: string
  type: QuestionType
  text: string
  description?: string
  options?: Option[]
  answer?: string
}

export interface Test {
  id: string
  title: string
  accessCode: string
  questions: Questionn[]
}

export const sampleTest: Test = {
  id: '1',
  title: 'Sample Test',
  accessCode: 'TEST123',
  questions: [
    {
      id: '1',
      type: 'multiple_choice',
      text: 'On which day did Madhu see Jo and Bryn playing basketball while wearing white shoes?',
      description:
        'Madhu saw Jo and Bryn, who are both taller than 6 feet, playing basketball while wearing white shoes. Jo invited their friend Carey, who weighs 193 pounds and is about 5½ feet tall, to join them for tennis the next morning. After playing tennis, all had to finish homework that was due the next day, a Tuesday.',
      options: [
        { id: '1a', text: 'Saturday' },
        { id: '1b', text: 'Sunday' },
        { id: '1c', text: 'Monday' },
        { id: '1d', text: 'Tuesday' }
      ]
    },
    {
      id: '2',
      type: 'essay',
      text: 'Explain the importance of critical thinking in problem-solving.',
      description:
        'Consider real-world examples and how critical thinking skills can be applied in different contexts.'
    },
    {
      id: '3',
      type: 'multiple_choice',
      text: 'What is the capital of France?',
      options: [
        { id: '3a', text: 'London' },
        { id: '3b', text: 'Berlin' },
        { id: '3c', text: 'Paris' },
        { id: '3d', text: 'Madrid' }
      ]
    }
  ]
}

export interface TestAssignmentResponse {
  id: number
  test_id: number
  candidate_email: string
  expired_invitation: Date | null
  started_at: Date | null
  is_online: boolean
  score: number
  code: string
  status: string
}

export interface AnswerResponse {
  id: number
  question_id: number
  option_text: string
  is_correct: boolean
}

export interface QuestionResponse {
  id: number
  test_id: number
  question_text: string
  question_type: string
  score: number
  title: string
  answers?: AnswerResponse[]
}

export interface TestResponse {
  id: number
  owner_id: number
  title: string
  description: string
  test_time: number
  deleted_at: Date | null
  is_publish: boolean
  questions?: QuestionResponse[]
}

export interface UpdateScoreTestAssignment {
  score: number
}
