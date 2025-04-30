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
  actionType: string | null
  testId?: number
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

export interface CreateTestCaseDto {
  question_id: number
  input: string
  expected_output: string
}

export interface FindTestCaseByCriterias {
  id?: number
  question_id?: number
  input?: string
  expected_output?: string
}

export interface CreateInitialCodeDto {
  question_id: number
  language_id: number
  description: string
  initial_code: string
}

export interface FindInitialCodeCriteriasDto {
  question_id?: number
  language_id?: number
  description?: string
  initial_code?: string
}

export interface TestCase {
  id?: number
  input?: string
  expected_output?: string
}

export enum LanguageID {
  JS = 102,
  PY = 109
}

export interface InitialCode {
  id?: number
  language_id?: number
  description?: string
  initial_code?: string
}

export interface Question {
  id: number
  test_id: number
  question_text: string
  question_type: string
  score: number
  title: string
  answers?: AnswerType[]
  testcases?: TestCase[]
  initial_code?: InitialCode
}

export interface UpdateQuestionDto {
  id?: number
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
  testcases?: TestCase[]
  initial_code?: InitialCode
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

export const sampleTest: TestResponse = {
  deleted_at: null,
  id: 0,
  owner_id: 0,
  title: '',
  description: '',
  is_publish: true,
  test_time: 0
}

export interface UpdateScoreTestAssignment {
  score: number
}

export interface UpdateTestAssignment {
  id?: number
  test_id?: number
  candidate_email?: string
  expired_invitation?: Date | null
  started_at?: Date | null
  is_online?: boolean
  score?: number
  code?: string
  status?: string
}

export interface StatisticsResponse {
  id?: number
  user_id?: number
  total_invitation?: number
  active_assess?: number
  total_assess_complete?: number
}
