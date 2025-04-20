export const serverBaseUrl = 'VITE_SERVER_URL'

export interface CreateTestDto {
  owner_id: number
  title: string
  description: string
  test_time: number
  is_publish: boolean
}

export interface TestCriteria {
  owner_id?: number
  title?: string
  description?: string
  test_time?: number
  is_publish?: boolean
  deleted_at?: Date | null
  limit?: number
}

export interface UpdateTestDto {
  owner_id?: number
  title?: string
  description?: string
  test_time?: number
  is_publish?: boolean
  deleted_at?: Date | null
}

export interface CreateQuestionDto {
  test_id: number
  question_text: string
  question_type: string
  score: number
  title: string
}

export interface CreateAnswerDto {
  question_id: number
  option_text: string
  is_correct: boolean
}

export interface QuestionsCriteriaDto {
  id?: number
  test_id?: number
  question_text?: string
  question_type?: string
  score?: number
  title?: string
}

export interface SendTestRequestDto {
  test_id?: number
  candidate_email?: string
  expired_invitation?: Date
  started_at?: Date
  is_online?: boolean
  score?: number
  code?: string
  status?: string
  emails: string
}

export interface CreateUserAnser {
  test_assignment_id: number
  question_id: number
  answer_text: string
  score: number
}

export interface UserAnserCriterias {
  id?: number
  test_assignment_id?: number
  question_id?: number
  answer_text?: string
  score?: number
}

export interface UserAnswerUpdate {
  test_assignment_id?: number
  question_id?: number
  answer_text?: string
  score?: number
}
