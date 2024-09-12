export interface GetInterviewsResponse {
  status: boolean
  data: InterviewItem[]
}

export interface InterviewItem {
  interview_id: string
  interview_name: string
  invite_url: string
  employer_email_id: string | null
  skills: Skill[]
  custom_questions: string[]
  interview_language: string
  can_change_interview_language: boolean
  only_coding_round: boolean
  is_coding_round_required: boolean
  is_proctoring_required: boolean
  selected_coding_language: string
  date_created: string
  date_modified: string | null
  status: string
}

export interface Skill {
  name: string
  description: string
}

export interface CreateInterviewRequest {
  interview_name: string
  employer_email_id: string
  skills: Skill[]
  custom_questions: string[]
  interview_language: string
  can_change_interview_language: boolean
  only_coding_round: boolean
  is_coding_round_required: boolean
  selected_coding_language: string
  is_proctoring_required: boolean
}

export interface CreateInterviewResponse {
  status: boolean
  message: string
  data: {
    interview_id: string
    invite_url: string
  }
}

export interface InviteCandidateRequest {
  interview_id: string
  candidates: Candidate[]
}

export interface Candidate {
  name: string
  email: string
}

export interface InviteCandidateResponse {
  status: boolean
  message: string
  data: {
    charge: {
      currency: string
      amount_paid: number
      transaction_id: string
    }
    invitations: Invitation[]
  }
}

export interface Invitation {
  candidate_id: string
  candidate_email: string
  invite_url: string
}

export interface GetInterviewReportResponse {
  status: boolean
  data: InterviewReport[]
}

export interface InterviewReport {
  report_id: string
  candidate_id: string
  candidate_name: string
  candidate_email_id: string
  report_date: string
  report_url: string
  interview_recording_url: string
  proctoring_score: number
  interview_transcript: InterviewTranscript[]
  technical_skills_evaluation: Evaluation[]
  soft_skills_evaluation: Evaluation[]
  coding_skills_evaluation: Evaluation[] | null
  custom_question_evaluation: Evaluation[]
  date_created: string
  date_modified: string
  status: string
}

export interface InterviewTranscript {
  role: string
  content: string
}

export interface Evaluation {
  skill: string
  ai_evaluation: AiEvaluation
}

export interface AiEvaluation {
  feedback: string
  rating: string
}
