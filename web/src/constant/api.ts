export const serverBaseUrl = 'VITE_SERVER_URL'

export interface CreateTestDto {
  owner_id: number
  title: string
  description: string
  test_time: number
  is_publish: boolean
}

export interface CreateQuestionDto {
  test_id: number
  question_text: string
  question_type: string
  score: number
}

export interface CreateAnswerDto {
  question_id: number
  option_text: string
  is_correct: boolean
}
