import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./index";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.career-sprint.com/api/v1";

// ─── Response shape ───────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  image: string | null;
  address1: string | null;
  phone1: string | null;
  candidate_profile?: number | { id?: number } | null;
  candidate_profiles?: Array<{ id?: number }>;
  company_profile?: number | { id?: number } | null;
  company_profiles?: Array<{ id?: number }>;
}

export interface LoginData {
  refresh: string;
  access: string;
  user: AuthUser;
}

export interface RegisterData {
  id: string;
  email: string;
  access: string;
  refresh: string;
}

interface ApiResponse<T> {
  success: boolean;
  details: string;
  code: string;
  status_code: number;
  data: T;
}

// ─── Request payload types ────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordPayload {
  password: string;
  new_password: string;
  confirm_password: string;
}

export interface AutoApplyTogglePayload {
  is_enabled: boolean;
}

// ─── Admin Candidate types ────────────────────────────────────────────────────

export interface AdminCandidateListItem {
  id: number;
  full_name: string;
  email: string;
  location: string | null;
  subscription: string;
  designations_plans: { designation: string; plan: string }[];
  ats_score: number;
  jobs_applied: number;
  is_suspended: boolean;
  registered: string;
}

export interface AdminCandidatesQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  name?: string;
  place?: string;
  age?: number;
  min_age?: number;
  max_age?: number;
  status?: string;
}

export interface AdminCandidateDetail {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  current_plan: string | null;
  joined: string;
  status: string;
  plan_badge: string;
  skills: string[];
  profile_summary: {
    ats_score: string;
    designations: number;
    active_plans: number;
    jobs_applied: number;
  };
  designation_plans: {
    id: number;
    designation: string;
    industry: string;
    status: string;
    plan: string;
    started_at: string;
    expires_at: string;
    price_text: string;
    jobs_applied_count: number;
    features: string[];
  }[];
  application_history: {
    designation: string;
    plan: string;
    applications_count: number;
    applications: {
      title?: string;
      company?: string;
      date?: string;
      status?: string;
      score?: string;
    }[];
  }[];
  age: string | null;
  gender: string | null;
  is_suspended: boolean;
  ats_score: number;
  registered: string;
}

export interface AdminCandidatePatchPayload {
  id: number;
  full_name?: string;
  email?: string;
  phone?: string;
  country?: string;
  plan_id?: string;
}

// ─── Company Candidate types ────────────────────────────────────────────────────

export interface CompanyCandidate {
  id: number;
  name: string;
  role_title: string;
  industry: string;
  location: string;
  years_experience: number;
  experience_level: string | null;
  skills: string[];
  match_score: number | null;
  is_unlocked: boolean;
  unlock_cost: number;
  age: number | null;
  gender: string | null;
}

export interface CompanyCandidatesFilters {
  role?: string;
  skills?: string;
  experience_level?: string;
  gender?: string;
  min_age?: number;
  max_age?: number;
}

export interface CompanyDashboardPipelineCandidate {
  key: string;
  label: string;
  count: number;
  candidates: string[];
}

export interface CompanyDashboardTopMatch {
  id: string;
  name: string;
  role_title: string;
  match_score: string;
}

export interface CompanyDashboardOpenRole {
  id: string;
  title: string;
  location: string;
  employment_type: string;
  open_to_remote: boolean;
  meta: string;
  applicants: number;
  status: string;
}

export interface CompanyDashboardStats {
  active_jobs: number;
  shortlisted: number;
  messaged: number;
  plan: string;
}

export interface CompanyDashboard {
  company_name: string;
  workspace_label: string;
  stats: CompanyDashboardStats;
  pipeline: CompanyDashboardPipelineCandidate[];
  top_ai_matches: CompanyDashboardTopMatch[];
  open_roles: CompanyDashboardOpenRole[];
}

export interface CandidateEducation {
  id: number;
  school: string;
  degree: string;
  field_of_study: string;
  start_year: string;
  end_year: string | null;
}

export interface CandidateExperience {
  id: number;
  company: string;
  job_title: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
}

export interface CandidateDetail {
  id: number;
  name: string;
  email: string;
  role_title: string;
  industry: string;
  about_me: string;
  phone_whatsapp: string;
  location: string;
  linkedin: string | null;
  website_portfolio: string | null;
  cv: string | null;
  years_experience: number;
  experience_level: string | null;
  skills: string[];
  match_score: number | null;
  educations: CandidateEducation[];
  experiences: CandidateExperience[];
  created_at: string;
}

// ─── Company Job types ─────────────────────────────────────────────────────────

export interface CompanyJob {
  id: string;
  company_name: string;
  title: string;
  description: string;
  requirements: string;
  requirements_list: string[];
  skills: string[];
  preferred_skills: string[];
  benefits: string[];
  location: string;
  employment_type: string;
  currency: string;
  salary_min: number;
  salary_max: number;
  salary_period: string;
  visa_sponsorship: boolean;
  emiratization: boolean;
  saudization: boolean;
  open_to_remote: boolean;
  custome: string;
  job_status: string;
  rejection_reason: string | null;
  ai_matches_count: number;
  applications_count: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  additional_questions: any[];
}

export interface CompanyJobPayload {
  title: string;
  description: string;
  requirements: string;
  skills: string[];
  preferred_skills: string[];
  benefits: string[];
  location: string;
  employment_type: string;
  currency: string;
  salary_min: number;
  salary_max: number;
  salary_period: string;
  visa_sponsorship: boolean;
  emiratization: boolean;
  saudization: boolean;
  open_to_remote: boolean;
  custome: string;
  additional_questions: any[];
}

export interface CompanyProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  industry: string;
  phone: string;
  work_email: string;
  address: string | null;
  about: string;
  image: string | null;
  logo: string | null;
  trade_licence: string | null;
  licence_number: string | null;
  is_licence_verified: boolean;
  ai_status: string;
}

export interface CompanyProfilePayload {
  company_name: string;
  industry: string;
  phone: string;
  work_email: string;
  address: string;
  about: string;
  logo: string | null;
  trade_licence: string | null;
  licence_number: string;
  first_name: string;
  last_name: string;
  image: string | null;
}

export interface CompanyInterviewQuestion {
  id: string;
  question_text: string;
  answer_text: string;
  order: number;
}

export interface CompanyInterviewQuestionPayload {
  question_text: string;
  answer_text: string;
  order: number;
}

export interface CompanyJobApplicationAnswer {
  question: string;
  answer: string;
}

export interface CompanyJobApplication {
  id: string;
  job: string;
  job_title: string;
  company_name: string;
  full_name: string;
  email: string;
  phone: string;
  answers: CompanyJobApplicationAnswer[];
  resume_url: string | null;
  application_status: string;
  status_reason: string;
  created_at: string;
  candidate_id: string;
  candidate_email: string;
}

export const APPLICATION_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "AI_INTERVIEW_INVITED",
  "AI_INTERVIEW_PASSED",
  "AI_INTERVIEW_FAILED",
  "PHYSICAL_INTERVIEW_INVITED",
  "HIRED",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface ChangeApplicationStatusPayload {
  id: string;
  status: ApplicationStatus;
  reason?: string;
}

export interface CompanyInterview {
  id: string;
  company: number;
  company_name: string;
  candidate_profile: number;
  job: string;
  role_context: string;
  duration_minutes: number;
  allow_voice_answers: boolean;
  notify_when_complete: boolean;
  status: string;
  questions: CompanyInterviewQuestion[];
  candidate_name: string;
  job_title: string;
  created_at: string;
  updated_at: string;
  hours_remaining: number | null;
  is_expired: boolean;
}

export interface InterviewReportQuestion {
  id: string;
  order: number;
  question_text: string;
  expected_answer: string;
  input_type: string;
  response: string;
  excerpt: string;
  audio_url: string | null;
  duration_seconds: number | null;
  score: number;
  score_100: number;
  feedback: string;
}

export interface InterviewReport {
  attempt_id: string;
  interview_id: string;
  candidate: {
    profile_id: number;
    name: string;
    email: string;
    role_title: string;
    headline: string;
  };
  job: {
    id: string;
    title: string;
    location: string;
  };
  overall: {
    score: number;
    score_out_of: number;
    raw_score: number;
    band: string;
    tone: string;
    headline: string;
    summary: string;
    top_percent: number | null;
    recommendation: string;
    recommendation_label: string;
  };
  progress: {
    total_questions: number;
    answered_count: number;
    scored_count: number;
    voice_answers: number;
    total_speaking_seconds: number;
  };
  timeline: {
    started_at: string;
    submitted_at: string;
    evaluated_at: string;
  };
  strengths: Array<{ question: string; score_100: number; feedback: string }>;
  concerns: Array<{ question: string; score_100: number; feedback: string }>;
  questions: InterviewReportQuestion[];
}

export interface CompanyInterviewPayload {
  candidate_profile_id: number;
  job_id: string;
  num_questions: number;
  allow_voice_answers: boolean;
  notify_when_complete: boolean;
  duration_minutes: number;
}

// ─── Admin Job types ──────────────────────────────────────────────────────────

export interface AdminJobListItem {
  id: string;
  title: string;
  company: string;
  location: string;
  matches: number;
  applications: number;
  posted: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  job_status: string;
}

export interface AdminJobsQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  title?: string;
  name?: string;
  place?: string;
  location?: string;
  company?: string;
  status?: string;
  employment_type?: string;
}

export interface AdminJobEditRequest {
  id: string;
  job: string;
  job_title: string;
  company: string;
  request_status: string;
  created_at: string;
  reviewed_at: string | null;
}

export interface AdminJobEditRequestDetail {
  id: string;
  job: string;
  job_title: string;
  company: string;
  request_status: string;
  proposed_changes: Record<string, any>;
  current_values: Record<string, any>;
  changes: Record<string, { from: any; to: any }>;
  review_reason: string;
  reviewed_at: string | null;
  created_at: string;
}

// ─── Candidate Job Detail types ──────────────────────────────────────────────

export interface CandidateJobDetail {
  id: string;
  company_name: string;
  company_logo: string | null;
  title: string;
  location: string;
  employment_type: string;
  employment_type_display: string;
  currency: string;
  salary_min: number;
  salary_max: number;
  salary_period: string;
  visa_sponsorship: boolean;
  emiratization: boolean;
  saudization: boolean;
  open_to_remote: boolean;
  description: string;
  requirements: string;
  requirements_list: string[];
  skills: string[];
  preferred_skills: string[];
  benefits: string[];
  additional_questions: { question: string; required: boolean }[];
  published_at: string;
  created_at: string;
  match_score: number | null;
  has_saved_cv: boolean;
  already_applied: boolean;
}

export interface TailoredCv {
  id: string;
  job: string;
  job_title: string;
  status: string;
  error: string | null;
  score_before: number | null;
  score_after: number | null;
  html_url: string | null;
  pdf_url: string | null;
  created_at: string;
}

export interface CandidateJobItem {
  id: string;
  company_name: string;
  company_logo: string | null;
  title: string;
  location: string;
  employment_type: string;
  employment_type_display: string;
  currency: string;
  salary_min: number;
  salary_max: number;
  salary_period: string;
  visa_sponsorship: boolean;
  emiratization: boolean;
  saudization: boolean;
  open_to_remote: boolean;
  description: string;
  requirements: string;
  requirements_list: string[];
  skills: string[];
  preferred_skills: string[];
  benefits: string[];
  additional_questions: { question: string; required: boolean }[];
  published_at: string;
  created_at: string;
  match_score: number | null;
  has_saved_cv: boolean;
  already_applied: boolean;
}

export interface CandidateJobsParams {
  search?: string;
  title?: string;
  name?: string;
  location?: string;
  place?: string;
  company?: string;
  company_name?: string;
  company_id?: number;
  employment_type?: string;
  industry?: string;
  min_salary?: number;
  max_salary?: number;
  visa_sponsorship?: boolean;
  emiratization?: boolean;
  saudization?: boolean;
  open_to_remote?: boolean;
  skills?: string;
}

// ─── Candidate Application types ─────────────────────────────────────────────

export interface CandidateApplicationAnswer {
  question: string;
  answer: string;
}

export interface CandidateApplicationItem {
  id: string;
  job: string;
  job_title: string;
  company_name: string;
  full_name: string;
  email: string;
  phone: string;
  answers: CandidateApplicationAnswer[];
  resume_url: string | null;
  application_status: string;
  status_reason: string | null;
  created_at: string;
}

export interface CandidateApplicationsData {
  counts: {
    applied: number;
    shortlisted: number;
    interview: number;
    offer: number;
    rejected: number;
    all: number;
  };
  applications: CandidateApplicationItem[];
}

// ─── Candidate Dashboard types ───────────────────────────────────────────────

export interface CandidateDashboardMetrics {
  profile_match_strength: string;
  active_applications: number;
  new_matches_today: number;
  plan_badge: string;
}

export interface CandidateAutoApply {
  enabled: boolean;
  sent_today: number;
  daily_cap: number;
}

export interface JobQuota {
  plan: string;
  base_limit: number;
  extra_slots: number;
  total_allowed: number;
  used: number;
  remaining: number;
  can_post: boolean;
}

export interface CandidateCvChecklist {
  text: string;
  completed: boolean;
}

export interface CandidateCvStrength {
  percentage: number;
  checklist: CandidateCvChecklist[];
}

export interface CandidatePreferences {
  role: string;
  salary: string;
  location: string;
}

export interface CandidateInterviewInvite {
  id: string;
  company_name: string;
  role_context: string;
  duration_minutes: number;
  message: string;
  job_title?: string;
  status?: string;
}

export interface InterviewAttemptQuestion {
  id: string;
  order: number;
  question_text: string;
  is_answered: boolean;
}

export interface InterviewAttemptAnswer {
  id: string;
  question: string;
  answer_text: string;
}

export interface InterviewAttempt {
  id: string;
  interview: string;
  job_title: string;
  company_name: string;
  duration_minutes: number;
  allow_voice_answers: boolean;
  deadline_at: string;
  hours_remaining: number;
  is_expired: boolean;
  attempt_status: string;
  started_at: string;
  submitted_at: string | null;
  evaluated_at: string | null;
  avg_score: number | null;
  total_questions: number;
  answered_count: number;
  questions: InterviewAttemptQuestion[];
  answers: InterviewAttemptAnswer[];
  created_at: string;
}

export interface InterviewAnswerResponse {
  id: string;
  question: string;
  input_type: string;
  response_text: string;
  audio_file?: string;
  duration_seconds?: number;
  created_at: string;
}

export interface CandidateRecommendation {
  id: string;
  company_name: string;
  match_score: string;
  title: string;
  posted_time: string;
  location: string;
  employment_type: string;
  salary: string;
  visa: string;
  tags: string[];
}

export interface CandidateRecentApplication {
  id: string;
  job_title: string;
  company_name: string;
  applied_date: string;
  ats_score: string;
  status: string;
  interview_id: string | null;
}

export interface CandidateDashboard {
  candidate_name: string;
  role_title: string;
  metrics: CandidateDashboardMetrics;
  auto_apply: CandidateAutoApply;
  cv_strength: CandidateCvStrength;
  preferences: CandidatePreferences;
  interview_invites: CandidateInterviewInvite[];
  recommendations: CandidateRecommendation[];
  recent_applications: CandidateRecentApplication[];
}

export interface CandidateCvData {
  cv_name: string;
  cv_url: string;
  updated_at: string;
  ai_status: string;
  ats_score: number;
  parsed_skills: string[];
}

export interface AutoSuggestTaskData {
  task_id: string;
  candidate_id: string;
  status: string;
  status_url: string;
}

export interface AutoSuggestResultData {
  ats_score: number;
  parsed_skills: string[];
  suggestions: string[];
}

export interface AutoSuggestStatusData {
  task_id: string;
  status: string;
  result: AutoSuggestResultData;
  error: string | null;
}

export interface ProfileEducation {
  id?: number;
  school: string;
  degree: string;
  field_of_study: string;
  start_year: string;
  end_year: string | null;
}

export interface ProfileExperience {
  id?: number;
  company: string;
  job_title: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
}

export interface ProfileSkill {
  id?: number;
  name: string;
}

export interface ProfileProject {
  id?: number;
  title: string;
  description: string;
  url: string;
  technologies: string;
  start_date: string;
  end_date: string | null;
}

export interface ProfileCertification {
  id?: number;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiration_date: string | null;
  credential_id: string;
  credential_url: string;
}

export interface CandidateProfile {
  is_ai_auto_apply: boolean;
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_title: string;
  industry: string;
  about_me: string | null;
  phone_whatsapp: string;
  location: string;
  linkedin: string | null;
  website_portfolio: string | null;
  cv: string;
  image: string | null;
  age: number | null;
  gender: string | null;
  ai_status: string;
  is_default: boolean;
  auto_apply: CandidateAutoApply;
  educations: ProfileEducation[];
  experiences: ProfileExperience[];
  skills: ProfileSkill[];
  projects: ProfileProject[];
  certifications: ProfileCertification[];
}

// ─── Admin Application types ─────────────────────────────────────────────────

export interface AdminApplicationItem {
  id: string;
  candidate_name: string;
  company_name: string;
  job_title: string;
  match_score: string;
  ats_score: number;
  applied_date: string;
  status: string;
}

export interface AdminApplicationCounts {
  applied: number;
  shortlisted: number;
  interview: number;
  offer: number;
  hired: number;
  all: number;
}

export interface AdminApplicationList {
  counts: AdminApplicationCounts;
  applications: AdminApplicationItem[];
}

// ─── Admin Subscription types ────────────────────────────────────────────────

export interface SubscriptionMetrics {
  premium_active_count: number;
  starter_active_count: number;
  monthly_revenue: number;
  conversion_rate_percentage: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  category: string;
  price: string;
  currency: string;
  description: string | null;
  is_active: boolean;
  subscribers_count: number;
  plan_title: string;
  plan_type: string;
  renewal: string;
  discount: string;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface ActivePremiumPlan {
  id: string;
  candidate: string;
  designation: string;
  billing: string;
  start: string;
  expires: string;
  jobs_applied: number;
}

export interface AdminSubscriptionDashboard {
  metrics: SubscriptionMetrics;
  plans: SubscriptionPlan[];
  active_premium_plans: ActivePremiumPlan[];
}

export interface SubscriptionPlanPayload {
  name: string;
  category: string;
  price: string;
  currency: string;
  description: string;
  is_active: boolean;
  plan_title: string;
  plan_type: string;
  renewal: string;
  discount: string;
  features: string[];
}

export interface SubscriptionHistoryItem {
  id: string;
  plan: string;
  plan_name: string;
  category: string;
  price: string;
  currency: string;
  sub_status: string;
  started_at: string;
  expires_at: string;
}

// ─── Admin Settings types ────────────────────────────────────────────────────

export interface AdminSettings {
  platform_name: string;
  support_email: string;
  currency: string;
  timezone: string;
  primary_language: string;
  rtl_support: boolean;
  email_notifications: boolean;
  ai_auto_matching: boolean;
}

export interface AdminSettingsPatchPayload {
  platform_name?: string;
  support_email?: string;
  currency?: string;
  timezone?: string;
  primary_language?: string;
  rtl_support?: boolean;
  email_notifications?: boolean;
  ai_auto_matching?: boolean;
}

// ─── Admin Dashboard types ────────────────────────────────────────────────────

export interface DashboardCard {
  value: number | string;
  change: string;
}

export interface DashboardDataset {
  label: string;
  data: number[];
}

export interface DashboardRevenueOverview {
  title: string;
  subtitle: string;
  period: string;
  labels: string[];
  datasets: DashboardDataset[];
}

export interface DashboardPlanItem {
  name: string;
  value: number;
}

export interface DashboardPlanDistribution {
  title: string;
  subtitle: string;
  data: DashboardPlanItem[];
}

export interface DashboardUserGrowth {
  title: string;
  labels: string[];
  data: number[];
}

export interface DashboardApplicationsTrend {
  title: string;
  labels: string[];
  data: number[];
}

export interface DashboardRecentCandidate {
  name: string;
  email: string;
  designations: string;
  plan: string;
  initials: string;
}

export interface DashboardPendingVerification {
  company_name: string;
  industry: string;
  location: string;
  status: string;
}

export interface DashboardRecentPayment {
  candidate_name: string;
  designation: string;
  amount: string;
  status: string;
}

export interface DashboardData {
  cards: {
    total_users: DashboardCard;
    total_candidates: DashboardCard;
    total_companies: DashboardCard;
    active_jobs: DashboardCard;
    applications_today: DashboardCard;
    yearly_revenue: DashboardCard;
    active_subscriptions: DashboardCard;
    premium_subscriptions: DashboardCard;
  };
  revenue_overview: DashboardRevenueOverview;
  plan_distribution: DashboardPlanDistribution;
  user_growth: DashboardUserGrowth;
  applications_trend: DashboardApplicationsTrend;
  recent_candidates: DashboardRecentCandidate[];
  pending_verifications: DashboardPendingVerification[];
  recent_payments: DashboardRecentPayment[];
}

// ─── Admin Company types ──────────────────────────────────────────────────────

export interface AdminCompanyListItem {
  id: number;
  company_name: string;
  email: string;
  country: string | null;
  active_jobs: number;
  credits: number;
  approval_status: string;
  is_suspended: boolean;
  since: string;
  subscription: string;
}

export interface AdminCompaniesQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  name?: string;
  place?: string;
  industry?: string;
  status?: string;
}

export interface AdminCompanyDetail {
  id: number;
  company_name: string;
  email: string;
  contact_person: string | null;
  phone: string | null;
  country: string | null;
  active_jobs: number;
  current_plan: string | null;
  subsription: string | null;
  approval_status: string;
  is_suspended: boolean;
  is_licence_verified: boolean;
  rejection_reason: string | null;
  logo: string | null;
  about: string | null;
  licence_number: string | null;
  since: string;
}

export interface AdminCompanyPatchPayload {
  id: number;
  company_name?: string;
  email?: string;
  contact_person?: string;
  phone?: string;
  country?: string;
}

export interface AdminCompanyRejectPayload {
  id: number;
  reason: string;
}

// ─── Chat types ───────────────────────────────────────────────────────────────

export interface ChatOtherParty {
  type: string;
  id: string;
  user_id: string;
  name: string;
  role_title: string;
}

export interface ChatLastMessage {
  id: string;
  content: string;
  sender: string;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  other_party: ChatOtherParty;
  last_message: ChatLastMessage | null;
  unread_count: number;
  last_message_at: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversation: string;
  sender: string;
  sender_name: string;
  is_mine: boolean;
  content: string;
  is_read: boolean;
  created_at: string;
}

// ─── Notification types ──────────────────────────────────────────────────────

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

// ─── RTK Query API ────────────────────────────────────────────────────────────

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    // Attach Bearer token from Redux state for authenticated endpoints
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["AdminCandidates", "AdminCompanies", "AdminDashboard", "AdminJobs", "AdminJobEditRequests", "AdminSettings", "AdminSubscriptions", "AdminApplications", "CandidateDashboard", "CandidateApplications", "CandidateJobDetail", "CandidateJobs", "CandidateCv", "CandidateProfiles", "CompanyCandidates", "CompanyJobs", "CompanyDashboard", "CompanyInterviews", "CompanyProfile", "Notifications", "ChatConversations", "Contacts"],
  endpoints: (builder) => ({
    // POST /auth/login/email/
    loginWithEmail: builder.mutation<ApiResponse<LoginData>, LoginPayload>({
      query: (body) => ({
        url: "auth/login/email/",
        method: "POST",
        body,
      }),
    }),

    // POST /auth/google/
    googleLogin: builder.mutation<ApiResponse<LoginData>, { credential: string }>({
      query: (body) => ({
        url: "auth/google/",
        method: "POST",
        body,
      }),
    }),

    // POST /auth/register/candidate/  (multipart/form-data)
    registerCandidate: builder.mutation<ApiResponse<RegisterData>, FormData>({
      query: (formData) => ({
        url: "auth/register/candidate/",
        method: "POST",
        body: formData,
        // Don't set Content-Type so the browser sets it with the boundary
        formData: true,
      }),
    }),

    // POST /auth/register/company/  (multipart/form-data)
    registerCompany: builder.mutation<ApiResponse<RegisterData>, FormData>({
      query: (formData) => ({
        url: "auth/register/company/",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),

    // POST /auth/password/forgot/
    forgotPassword: builder.mutation<ApiResponse<null>, ForgotPasswordPayload>({
      query: (body) => ({
        url: "auth/password/forgot/",
        method: "POST",
        body,
      }),
    }),

    // POST /auth/password/verify/
    verifyOtp: builder.mutation<ApiResponse<null>, VerifyOtpPayload>({
      query: (body) => ({
        url: "auth/password/verify/",
        method: "POST",
        body,
      }),
    }),

    // POST /auth/password/reset/
    resetPassword: builder.mutation<ApiResponse<null>, ResetPasswordPayload>({
      query: (body) => ({
        url: "auth/password/reset/",
        method: "POST",
        body,
      }),
    }),

    // POST /auth/password/change/old/  (requires auth)
    changePassword: builder.mutation<ApiResponse<null>, ChangePasswordPayload>({
      query: (body) => ({
        url: "auth/password/change/old/",
        method: "POST",
        body,
      }),
    }),

    // POST /candidate/auto-apply/toggle/  (requires auth)
    toggleAutoApply: builder.mutation<ApiResponse<null>, AutoApplyTogglePayload>({
      query: (body) => ({
        url: "candidate/auto-apply/toggle/",
        method: "POST",
        body,
      }),
    }),

    // GET /candidate/auto-apply/  (requires auth)
    getAutoApplyStatus: builder.query<ApiResponse<{ is_enabled: boolean }>, void>({
      query: () => "candidate/auto-apply/",
    }),

    // ── Admin Dashboard ─────────────────────────────────────────────────────

    // GET /admin/dashboard/
    getAdminDashboard: builder.query<ApiResponse<DashboardData>, void>({
      query: () => "admin/dashboard/",
      providesTags: ["AdminDashboard"],
    }),

    // ── Admin Candidate endpoints ─────────────────────────────────────────────

    // GET /admin/candidates/
    getAdminCandidates: builder.query<any, AdminCandidatesQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.set("page", String(params.page));
          if (params.page_size) queryParams.set("page_size", String(params.page_size));
          if (params.search) queryParams.set("search", params.search);
          if (params.name) queryParams.set("name", params.name);
          if (params.place) queryParams.set("place", params.place);
          if (params.age !== undefined && params.age !== null) queryParams.set("age", String(params.age));
          if (params.min_age !== undefined && params.min_age !== null) queryParams.set("min_age", String(params.min_age));
          if (params.max_age !== undefined && params.max_age !== null) queryParams.set("max_age", String(params.max_age));
          if (params.status && params.status !== "ALL") queryParams.set("status", params.status);
        }
        const queryString = queryParams.toString();
        return `admin/candidates/${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["AdminCandidates"],
    }),

    // GET /admin/candidates/{id}/
    getAdminCandidateById: builder.query<ApiResponse<AdminCandidateDetail>, number>({
      query: (id) => `admin/candidates/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "AdminCandidates", id }],
    }),

    // PATCH /admin/candidates/{id}/
    patchAdminCandidate: builder.mutation<
      ApiResponse<AdminCandidateDetail>,
      AdminCandidatePatchPayload
    >({
      query: ({ id, ...body }) => ({
        url: `admin/candidates/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "AdminCandidates",
        { type: "AdminCandidates", id },
      ],
    }),

    // DELETE /admin/candidates/{id}/
    deleteAdminCandidate: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `admin/candidates/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminCandidates"],
    }),

    // POST /admin/candidates/{id}/suspend/
    suspendAdminCandidate: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `admin/candidates/${id}/suspend/`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, id) => ["AdminCandidates", { type: "AdminCandidates", id }],
    }),

    // DELETE /admin/candidates/{id}/suspend/
    unsuspendAdminCandidate: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `admin/candidates/${id}/suspend/`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => ["AdminCandidates", { type: "AdminCandidates", id }],
    }),

    // POST /admin/candidates/{id}/reset-password/
    resetAdminCandidatePassword: builder.mutation<ApiResponse<{ new_password: string }>, { id: number; new_password: string }>({
      query: ({ id, new_password }) => ({
        url: `admin/candidates/${id}/reset-password/`,
        method: "POST",
        body: { new_password },
      }),
    }),

    // ── Company Dashboard endpoints ─────────────────────────────────────────────

    // GET /company/dashboard/
    getCompanyDashboard: builder.query<ApiResponse<CompanyDashboard>, void>({
      query: () => "auth/company/dashboard/",
      providesTags: ["CompanyDashboard"],
    }),

    // ── Company Candidate endpoints ────────────────────────────────────────────

    // GET /candidates/
    getCompanyCandidates: builder.query<ApiResponse<CompanyCandidate[]>, CompanyCandidatesFilters | void>({
      query: (filters) => {
        if (!filters) return "candidates/";
        const params = new URLSearchParams();
        if (filters.role) params.set("role", filters.role);
        if (filters.skills) params.set("skills", filters.skills);
        if (filters.experience_level) params.set("experience_level", filters.experience_level);
        if (filters.gender) params.set("gender", filters.gender);
        if (filters.min_age !== undefined) params.set("min_age", String(filters.min_age));
        if (filters.max_age !== undefined) params.set("max_age", String(filters.max_age));
        const qs = params.toString();
        return qs ? `candidates/?${qs}` : "candidates/";
      },
      providesTags: ["CompanyCandidates"],
    }),

    // GET /candidates/{id}/
    getCompanyCandidateDetail: builder.query<ApiResponse<CandidateDetail>, number>({
      query: (id) => `candidates/${id}/`,
      providesTags: (_r, _e, id) => [{ type: "CompanyCandidates", id }],
    }),

    // ── Company Job endpoints ───────────────────────────────────────────────────

    // GET /jobs/
    getCompanyJobs: builder.query<ApiResponse<CompanyJob[]>, void>({
      query: () => "jobs/",
      providesTags: ["CompanyJobs"],
    }),

    // GET /jobs/{id}/
    getCompanyJobDetail: builder.query<ApiResponse<CompanyJob>, string>({
      query: (id) => `jobs/${id}/`,
      providesTags: (_r, _e, id) => [{ type: "CompanyJobs", id }],
    }),

    // POST /jobs/
    createCompanyJob: builder.mutation<ApiResponse<CompanyJob>, CompanyJobPayload>({
      query: (body) => ({
        url: "jobs/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CompanyJobs"],
    }),

    // PATCH /jobs/{id}/
    updateCompanyJob: builder.mutation<ApiResponse<CompanyJob>, { id: string } & Partial<CompanyJobPayload>>({
      query: ({ id, ...body }) => ({
        url: `jobs/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => ["CompanyJobs", { type: "CompanyJobs", id }],
    }),

    // DELETE /jobs/{id}/
    deleteCompanyJob: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `jobs/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CompanyJobs"],
    }),

    // POST /jobs/{id}/edit-requests/
    requestCompanyJobEdit: builder.mutation<ApiResponse<any>, { id: string; proposed_changes: Partial<CompanyJobPayload> }>({
      query: ({ id, ...body }) => ({
        url: `jobs/${id}/edit-requests/`,
        method: "POST",
        body,
      }),
    }),

    // GET /jobs/quota/
    getJobQuota: builder.query<ApiResponse<JobQuota>, void>({
      query: () => "jobs/quota/",
    }),

    // POST /jobs/slots/purchase/
    purchaseJobSlots: builder.mutation<ApiResponse<{ checkout_url: string; session_id: string }>, { quantity: number }>({
      query: (body) => ({
        url: "jobs/slots/purchase/",
        method: "POST",
        body,
      }),
    }),

    // ── Company Profile endpoints ───────────────────────────────────────────────

    // GET /auth/company/profile/
    getCompanyProfile: builder.query<ApiResponse<CompanyProfile>, void>({
      query: () => "auth/company/profile/",
      providesTags: ["CompanyProfile"],
    }),

    // PUT /auth/company/profile/
    updateCompanyProfile: builder.mutation<ApiResponse<CompanyProfile>, FormData>({
      query: (formData) => ({
        url: "auth/company/profile/",
        method: "PUT",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["CompanyProfile"],
    }),

    // ── Company Interview endpoints ─────────────────────────────────────────────

    // GET /company/interviews/
    getCompanyInterviews: builder.query<ApiResponse<CompanyInterview[]>, void>({
      query: () => "company/interviews/",
      providesTags: ["CompanyInterviews"],
    }),

    // POST /company/interviews/
    createCompanyInterview: builder.mutation<ApiResponse<CompanyInterview>, CompanyInterviewPayload>({
      query: (body) => ({
        url: "company/interviews/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CompanyInterviews"],
    }),

    // GET /company/interviews/{id}/
    getCompanyInterviewDetail: builder.query<ApiResponse<CompanyInterview>, string>({
      query: (id) => `company/interviews/${id}/`,
      providesTags: (_r, _e, id) => [{ type: "CompanyInterviews", id }],
    }),

    // GET /company/interviews/{id}/report/
    getCompanyInterviewReport: builder.query<ApiResponse<InterviewReport>, string>({
      query: (id) => `company/interviews/${id}/report/`,
      providesTags: (_r, _e, id) => [{ type: "CompanyInterviews", id }],
    }),

    // GET /company/interviews/{id}/report/pdf/
    downloadCompanyInterviewReportPdf: builder.query<Blob, string>({
      query: (id) => ({
        url: `company/interviews/${id}/report/pdf/`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // POST /company/interviews/{id}/questions/
    createCompanyInterviewQuestion: builder.mutation<ApiResponse<CompanyInterviewQuestion>, { interviewId: string } & CompanyInterviewQuestionPayload>({
      query: ({ interviewId, ...body }) => ({
        url: `company/interviews/${interviewId}/questions/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { interviewId }) => [{ type: "CompanyInterviews", interviewId }],
    }),

    // DELETE /company/interviews/{id}/questions/{question_pk}/
    deleteCompanyInterviewQuestion: builder.mutation<ApiResponse<null>, { interviewId: string; questionId: string }>({
      query: ({ interviewId, questionId }) => ({
        url: `company/interviews/${interviewId}/questions/${questionId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { interviewId }) => [{ type: "CompanyInterviews", interviewId }],
    }),

    // POST /company/interviews/{id}/send/
    sendCompanyInterview: builder.mutation<ApiResponse<CompanyInterview>, { interview_id: string; deadline_at: string; valid_for_hours: number }>({
      query: ({ interview_id, deadline_at, valid_for_hours }) => ({
        url: `company/interviews/${interview_id}/send/`,
        method: "POST",
        body: { deadline_at },
      }),
      invalidatesTags: (_r, _e, { interview_id }) => [{ type: "CompanyInterviews", id: interview_id }],
    }),

    // POST /candidate/interview/generate-questions/
    generateCompanyInterviewQuestions: builder.mutation<ApiResponse<string[]>, { candidate_profile_id: number; job_id: string; job_description: string; num_questions: number }>({
      query: (body) => ({
        url: "candidate/interview/generate-questions/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CompanyInterviews"],
    }),

    // GET /company/jobs/{id}/applications/
    getCompanyJobApplications: builder.query<ApiResponse<CompanyJobApplication[]>, string>({
      query: (jobId) => `company/jobs/${jobId}/applications/`,
      providesTags: (_r, _e, jobId) => [{ type: "CompanyJobs", id: jobId }],
    }),

    // POST /company/applications/{id}/status/
    changeApplicationStatus: builder.mutation<ApiResponse<CompanyJobApplication>, ChangeApplicationStatusPayload>({
      query: ({ id, ...body }) => ({
        url: `company/applications/${id}/status/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "CompanyJobs", id }],
    }),

    // ── Admin Job endpoints ────────────────────────────────────────────────────

    // GET /admin/jobs/
    getAdminJobs: builder.query<any, AdminJobsQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.set("page", String(params.page));
          if (params.page_size) queryParams.set("page_size", String(params.page_size));
          if (params.search) queryParams.set("search", params.search);
          if (params.title) queryParams.set("title", params.title);
          if (params.name) queryParams.set("name", params.name);
          if (params.place) queryParams.set("place", params.place);
          if (params.location) queryParams.set("location", params.location);
          if (params.company) queryParams.set("company", params.company);
          if (params.status && params.status !== "ALL") queryParams.set("status", params.status);
          if (params.employment_type && params.employment_type !== "ALL") queryParams.set("employment_type", params.employment_type);
        }
        const queryString = queryParams.toString();
        return `admin/jobs/${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["AdminJobs"],
    }),

    // DELETE /admin/jobs/{id}/
    deleteAdminJob: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `admin/jobs/${id}/`, method: "DELETE" }),
      invalidatesTags: ["AdminJobs"],
    }),

    // ── Admin Job Edit Requests endpoints ─────────────────────────────────────

    // GET /admin/job-edit-requests/
    getAdminJobEditRequests: builder.query<ApiResponse<AdminJobEditRequest[]>, void>({
      query: () => "admin/job-edit-requests/",
      providesTags: ["AdminJobEditRequests"],
    }),

    // GET /admin/job-edit-requests/{id}/
    getAdminJobEditRequestDetail: builder.query<ApiResponse<AdminJobEditRequestDetail>, string>({
      query: (id) => `admin/job-edit-requests/${id}/`,
      providesTags: (_r, _e, id) => [{ type: "AdminJobEditRequests", id }],
    }),

    // POST /admin/job-edit-requests/{id}/approve/
    approveAdminJobEditRequest: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({ url: `admin/job-edit-requests/${id}/approve/`, method: "POST" }),
      invalidatesTags: ["AdminJobEditRequests"],
    }),

    // POST /admin/job-edit-requests/{id}/reject/
    rejectAdminJobEditRequest: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({ url: `admin/job-edit-requests/${id}/reject/`, method: "POST" }),
      invalidatesTags: ["AdminJobEditRequests"],
    }),

    // ── Admin Settings endpoints ──────────────────────────────────────────────

    // GET /admin/settings/
    getAdminSettings: builder.query<ApiResponse<AdminSettings>, void>({
      query: () => "admin/settings/",
      providesTags: ["AdminSettings"],
    }),

    // PATCH /admin/settings/
    patchAdminSettings: builder.mutation<ApiResponse<AdminSettings>, AdminSettingsPatchPayload>({
      query: (body) => ({
        url: "admin/settings/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AdminSettings"],
    }),

    // ── Admin Subscription endpoints ──────────────────────────────────────────

    // GET /admin/subscriptions/dashboard/
    getAdminSubscriptionDashboard: builder.query<ApiResponse<AdminSubscriptionDashboard>, void>({
      query: () => "admin/subscriptions/dashboard/",
      providesTags: ["AdminSubscriptions"],
    }),

    // POST /subscriptions/plans/
    createSubscriptionPlan: builder.mutation<ApiResponse<SubscriptionPlan>, SubscriptionPlanPayload>({
      query: (body) => ({
        url: "subscriptions/plans/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminSubscriptions"],
    }),

    // PATCH /subscriptions/plans/{id}/
    updateSubscriptionPlan: builder.mutation<ApiResponse<SubscriptionPlan>, { id: string } & Partial<SubscriptionPlanPayload>>({
      query: ({ id, ...body }) => ({
        url: `subscriptions/plans/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AdminSubscriptions"],
    }),

    // DELETE /subscriptions/plans/{id}/
    deleteSubscriptionPlan: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `subscriptions/plans/${id}/`, method: "DELETE" }),
      invalidatesTags: ["AdminSubscriptions"],
    }),

    // ── Admin Application endpoints ───────────────────────────────────────────

    // GET /admin/applications/
    getAdminApplications: builder.query<ApiResponse<AdminApplicationList>, void>({
      query: () => "admin/applications/",
      providesTags: ["AdminApplications"],
    }),

    // ── Admin Company endpoints ───────────────────────────────────────────────

    // GET /admin/companies/
    getAdminCompanies: builder.query<any, AdminCompaniesQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.set("page", String(params.page));
          if (params.page_size) queryParams.set("page_size", String(params.page_size));
          if (params.search) queryParams.set("search", params.search);
          if (params.name) queryParams.set("name", params.name);
          if (params.place) queryParams.set("place", params.place);
          if (params.industry) queryParams.set("industry", params.industry);
          if (params.status && params.status !== "ALL") queryParams.set("status", params.status);
        }
        const queryString = queryParams.toString();
        return `admin/companies/${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["AdminCompanies"],
    }),

    // GET /admin/companies/{id}/
    getAdminCompanyById: builder.query<ApiResponse<AdminCompanyDetail>, number>({
      query: (id) => `admin/companies/${id}/`,
      providesTags: (_r, _e, id) => [{ type: "AdminCompanies", id }],
    }),

    // PATCH /admin/companies/{id}/
    patchAdminCompany: builder.mutation<ApiResponse<AdminCompanyDetail>, AdminCompanyPatchPayload>({
      query: ({ id, ...body }) => ({
        url: `admin/companies/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => ["AdminCompanies", { type: "AdminCompanies", id }],
    }),

    // DELETE /admin/companies/{id}/
    deleteAdminCompany: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({ url: `admin/companies/${id}/`, method: "DELETE" }),
      invalidatesTags: ["AdminCompanies"],
    }),

    // POST /admin/companies/{id}/approve/
    approveAdminCompany: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({ url: `admin/companies/${id}/approve/`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => ["AdminCompanies", { type: "AdminCompanies", id }],
    }),

    // POST /admin/companies/{id}/reject/
    rejectAdminCompany: builder.mutation<ApiResponse<null>, AdminCompanyRejectPayload>({
      query: ({ id, reason }) => ({
        url: `admin/companies/${id}/reject/`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_r, _e, { id }) => ["AdminCompanies", { type: "AdminCompanies", id }],
    }),

    // POST /admin/companies/{id}/reset-password/
    resetAdminCompanyPassword: builder.mutation<ApiResponse<{ new_password: string }>, { id: number; new_password: string }>({
      query: ({ id, new_password }) => ({
        url: `admin/companies/${id}/reset-password/`,
        method: "POST",
        body: { new_password },
      }),
    }),

    // POST /admin/companies/{id}/suspend/
    suspendAdminCompany: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({ url: `admin/companies/${id}/suspend/`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => ["AdminCompanies", { type: "AdminCompanies", id }],
    }),

    // DELETE /admin/companies/{id}/suspend/
    unsuspendAdminCompany: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({ url: `admin/companies/${id}/suspend/`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => ["AdminCompanies", { type: "AdminCompanies", id }],
    }),

    // ── Candidate Dashboard endpoints ─────────────────────────────────────────

    // GET /api/v1/auth/candidate/dashboard/
    getCandidateDashboard: builder.query<ApiResponse<CandidateDashboard>, void>({
      query: () => "auth/candidate/dashboard/",
      providesTags: ["CandidateDashboard"],
    }),

    // GET /candidate/applications/
    getCandidateApplications: builder.query<ApiResponse<CandidateApplicationsData>, void>({
      query: () => "candidate/applications/",
      providesTags: ["CandidateApplications"],
    }),

    // GET /candidate/jobs/{id}/
    getCandidateJobDetail: builder.query<ApiResponse<CandidateJobDetail>, string>({
      query: (id) => `candidate/jobs/${id}/`,
      providesTags: (_r, _e, id) => [{ type: "CandidateJobDetail", id }],
    }),

    // POST /candidate/jobs/{id}/apply/
    applyToJob: builder.mutation<ApiResponse<null>, { id: string; full_name: string; email: string; phone: string; answers: { question: string; answer: string }[] }>({
      query: ({ id, ...body }) => ({
        url: `candidate/jobs/${id}/apply/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CandidateApplications"],
    }),

    // POST /candidate/jobs/{id}/tailor-cv/
    tailorCandidateCv: builder.mutation<ApiResponse<TailoredCv>, string>({
      query: (id) => ({
        url: `candidate/jobs/${id}/tailor-cv/`,
        method: "POST",
      }),
    }),

    // GET /candidate/tailored-cvs/{id}/
    getTailoredCv: builder.query<ApiResponse<TailoredCv>, string>({
      query: (id) => `candidate/tailored-cvs/${id}/`,
    }),

    // GET /candidate/jobs/ (browse active jobs with optional filtering)
    getCandidateJobs: builder.query<ApiResponse<CandidateJobItem[]>, CandidateJobsParams | void>({
      query: (params) => {
        if (!params) return "candidate/jobs/";
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
          }
        });
        const queryString = searchParams.toString();
        return `candidate/jobs/${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["CandidateJobs"],
    }),

    // ── Candidate CV endpoints ──────────────────────────────────────────────────

    // GET /auth/candidate/cv/
    getCandidateCv: builder.query<ApiResponse<CandidateCvData>, void>({
      query: () => "auth/candidate/cv/",
      providesTags: ["CandidateCv"],
    }),

    // POST /auth/candidate/cv/  (multipart/form-data)
    uploadCandidateCv: builder.mutation<ApiResponse<CandidateCvData>, FormData>({
      query: (formData) => ({
        url: "auth/candidate/cv/",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["CandidateCv"],
    }),

    // GET /auth/candidate/cv/download/ → triggers browser download
    downloadCandidateCv: builder.mutation<void, { filename?: string }>({
      queryFn: async (_arg, queryApi) => {
        const token = (queryApi.getState() as RootState).auth.accessToken;
        const response: Response = await fetch(`${BASE_URL}/auth/candidate/cv/download/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          return { error: { status: response.status, data: response.statusText } };
        }
        const blob: Blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = _arg?.filename || "cv.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return { data: undefined };
      },
    }),

    // POST /auth/candidate/cv/auto-suggest/
    autoSuggestCandidateCv: builder.mutation<ApiResponse<AutoSuggestTaskData>, void>({
      query: () => ({
        url: "auth/candidate/cv/auto-suggest/",
        method: "POST",
      }),
      invalidatesTags: ["CandidateCv"],
    }),

    // GET /auth/candidate/cv/auto-suggest/status/{task_id}/
    getAutoSuggestStatus: builder.query<ApiResponse<AutoSuggestStatusData>, string>({
      query: (taskId) => `auth/candidate/cv/auto-suggest/status/${taskId}/`,
    }),

    // ── Candidate Profile endpoints ────────────────────────────────────────────

    // GET /auth/candidate/profiles/
    getCandidateProfiles: builder.query<ApiResponse<CandidateProfile[]>, void>({
      query: () => "auth/candidate/profiles/",
      providesTags: ["CandidateProfiles"],
    }),

    // POST /auth/candidate/profiles/  (multipart/form-data)
    createCandidateProfile: builder.mutation<ApiResponse<CandidateProfile>, FormData>({
      query: (formData) => ({
        url: "auth/candidate/profiles/",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["CandidateProfiles"],
    }),

    // POST /auth/candidate/profiles/{id}/switch/
    switchCandidateProfile: builder.mutation<ApiResponse<CandidateProfile>, number>({
      query: (id) => ({
        url: `auth/candidate/profiles/${id}/switch/`,
        method: "POST",
      }),
      invalidatesTags: ["CandidateProfiles", "CandidateDashboard", "CandidateApplications", "CandidateCv"],
    }),

    // GET /auth/candidate/profiles/{id}/
    getCandidateProfileById: builder.query<ApiResponse<CandidateProfile>, number>({
      query: (id) => `auth/candidate/profiles/${id}/`,
      providesTags: (result, error, id) => [{ type: "CandidateProfiles", id }],
    }),

    // PATCH /auth/candidate/profiles/{id}/
    patchCandidateProfile: builder.mutation<
      ApiResponse<CandidateProfile>,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `auth/candidate/profiles/${id}/`,
        method: "PATCH",
        body,
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        "CandidateProfiles",
        { type: "CandidateProfiles", id },
      ],
    }),

    // DELETE /auth/candidate/profiles/{id}/
    deleteCandidateProfile: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `auth/candidate/profiles/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CandidateProfiles"],
    }),

    // POST /auth/candidate/profiles/{id}/set-default/
    setDefaultCandidateProfile: builder.mutation<ApiResponse<CandidateProfile>, number>({
      query: (id) => ({
        url: `auth/candidate/profiles/${id}/set-default/`,
        method: "POST",
      }),
      invalidatesTags: ["CandidateProfiles"],
    }),

    // POST /candidate/auto-apply/toggle/
    toggleCandidateAutoApply: builder.mutation<ApiResponse<null>, { is_enabled: boolean }>({
      query: (body) => ({
        url: "candidate/auto-apply/toggle/",
        method: "POST",
        body,
      }),
    }),

    // POST /auth/candidate/profiles/{id}/upload-image/ (multipart/form-data)
    uploadProfileImage: builder.mutation<ApiResponse<{ image: string }>, { id: number; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("image", file);
        return {
          url: `auth/candidate/profiles/${id}/upload-image/`,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (_r, _e, { id }) => [
        "CandidateProfiles",
        { type: "CandidateProfiles", id },
      ],
    }),

    // ── Subscription endpoints ──────────────────────────────────────────────

    // GET /subscriptions/history/
    getSubscriptionHistory: builder.query<ApiResponse<SubscriptionHistoryItem[]>, void>({
      query: () => "subscriptions/history/",
    }),

    // GET /subscriptions/plans/
    getSubscriptionPlans: builder.query<ApiResponse<SubscriptionPlan[]>, void>({
      query: () => "subscriptions/plans/",
    }),

    // POST /subscriptions/stripe/checkout-session/
    createStripeCheckoutSession: builder.mutation<
      ApiResponse<{ checkout_url: string; session_id: string }>,
      { plan_id: string; profile_id: number | string }
    >({
      query: (body) => ({
        url: "subscriptions/stripe/checkout-session/",
        method: "POST",
        body,
      }),
    }),

    // ── Notification endpoints ──────────────────────────────────────────────

    // GET /notifications/
    getNotifications: builder.query<ApiResponse<NotificationItem[]>, void>({
      query: () => "notifications/",
      providesTags: ["Notifications"],
    }),

    // POST /notifications/{id}/read/
    markNotificationRead: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `notifications/${id}/read/`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // POST /notifications/read-all/
    markAllNotificationsRead: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "notifications/read-all/",
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // ── Chat endpoints ─────────────────────────────────────────────────────

    // GET /chat/conversations/?search=
    getConversations: builder.query<ApiResponse<ChatConversation[]>, string | void>({
      query: (search) => ({
        url: "chat/conversations/",
        params: search ? { search } : undefined,
      }),
      providesTags: ["ChatConversations"],
    }),

    // GET /chat/conversations/{id}/messages/
    getConversationMessages: builder.query<ApiResponse<ChatMessage[]>, string>({
      query: (id) => `chat/conversations/${id}/messages/`,
    }),

    // POST /chat/conversations/{id}/messages/
    sendMessage: builder.mutation<ApiResponse<ChatMessage>, { conversationId: string; content: string }>({
      query: ({ conversationId, content }) => ({
        url: `chat/conversations/${conversationId}/messages/`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["ChatConversations"],
    }),

    // POST /chat/conversations/{id}/read/
    markConversationRead: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `chat/conversations/${id}/read/`,
        method: "POST",
      }),
      invalidatesTags: ["ChatConversations"],
    }),

    // POST /chat/conversations/
    createConversation: builder.mutation<ApiResponse<ChatConversation>, { candidate_profile_id: string }>({
      query: (body) => ({
        url: "chat/conversations/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ChatConversations"],
    }),

    // POST /contacts/form/
    submitContactForm: builder.mutation<ApiResponse<null>, { full_name: string; email: string; phone_number: string; message: string }>({
      query: (body) => ({
        url: "contacts/form/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contacts"],
    }),

    // POST /candidate/interviews/{id}/attempt/
    startInterviewAttempt: builder.mutation<ApiResponse<InterviewAttempt>, string>({
      query: (interviewId) => ({
        url: `candidate/interviews/${interviewId}/attempt/`,
        method: "POST",
      }),
    }),

    // POST /candidate/interviews/{id}/attempt/answers/
    submitInterviewAnswer: builder.mutation<
      ApiResponse<InterviewAnswerResponse>,
      { attemptId: string; questionId: string; inputType: "TEXT" | "VOICE"; responseText?: string; audioFile?: File; durationSeconds?: number }
    >({
      query: ({ attemptId, questionId, inputType, responseText, audioFile, durationSeconds }) => {
        if (inputType === "VOICE" && audioFile) {
          const formData = new FormData();
          formData.append("question_id", questionId);
          formData.append("input_type", "VOICE");
          formData.append("audio_file", audioFile);
          if (durationSeconds !== undefined) formData.append("duration_seconds", String(durationSeconds));
          return { url: `candidate/interviews/${attemptId}/attempt/answers/`, method: "POST", body: formData };
        }
        return {
          url: `candidate/interviews/${attemptId}/attempt/answers/`,
          method: "POST",
          body: {
            question_id: questionId,
            input_type: inputType,
            response_text: responseText ?? "",
            ...(durationSeconds !== undefined && { duration_seconds: durationSeconds }),
          },
        };
      },
    }),

    // POST /candidate/interviews/{id}/attempt/submit/
    submitInterviewAttempt: builder.mutation<ApiResponse<InterviewAttempt>, string>({
      query: (attemptId) => ({
        url: `candidate/interviews/${attemptId}/attempt/submit/`,
        method: "POST",
        body: { run_async: true },
      }),
    }),
  }),
});

export const {
  useLoginWithEmailMutation,
  useGoogleLoginMutation,
  useRegisterCandidateMutation,
  useRegisterCompanyMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  // Admin Dashboard
  useGetAdminDashboardQuery,
  // Admin Candidates
  useGetAdminCandidatesQuery,
  useGetAdminCandidateByIdQuery,
  usePatchAdminCandidateMutation,
  useDeleteAdminCandidateMutation,
  useSuspendAdminCandidateMutation,
  useUnsuspendAdminCandidateMutation,
  useResetAdminCandidatePasswordMutation,
  // Admin Jobs
  useGetAdminJobsQuery,
  useDeleteAdminJobMutation,
  // Admin Job Edit Requests
  useGetAdminJobEditRequestsQuery,
  useGetAdminJobEditRequestDetailQuery,
  useApproveAdminJobEditRequestMutation,
  useRejectAdminJobEditRequestMutation,
  // Admin Settings
  useGetAdminSettingsQuery,
  usePatchAdminSettingsMutation,
  // Admin Subscriptions
  useGetAdminSubscriptionDashboardQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  // Admin Applications
  useGetAdminApplicationsQuery,
  // Admin Companies
  useGetAdminCompaniesQuery,
  useGetAdminCompanyByIdQuery,
  usePatchAdminCompanyMutation,
  useDeleteAdminCompanyMutation,
  useApproveAdminCompanyMutation,
  useRejectAdminCompanyMutation,
  useResetAdminCompanyPasswordMutation,
  useSuspendAdminCompanyMutation,
  useUnsuspendAdminCompanyMutation,
  // Candidate Dashboard
  useGetCandidateDashboardQuery,
  // Candidate Applications
  useGetCandidateApplicationsQuery,
  // Candidate Job Detail
  useGetCandidateJobDetailQuery,
  useApplyToJobMutation,
  useTailorCandidateCvMutation,
  useGetTailoredCvQuery,
  // Candidate Jobs List
  useGetCandidateJobsQuery,
  // Candidate CV
  useGetCandidateCvQuery,
  useUploadCandidateCvMutation,
  useDownloadCandidateCvMutation,
  useAutoSuggestCandidateCvMutation,
  useGetAutoSuggestStatusQuery,
  // Candidate Profiles
  useGetCandidateProfilesQuery,
  useCreateCandidateProfileMutation,
  useSwitchCandidateProfileMutation,
  useGetCandidateProfileByIdQuery,
  usePatchCandidateProfileMutation,
  useDeleteCandidateProfileMutation,
  useSetDefaultCandidateProfileMutation,
  useToggleCandidateAutoApplyMutation,
  useUploadProfileImageMutation,
  // Company Dashboard
  useGetCompanyDashboardQuery,
  // Company Candidates
  useGetCompanyCandidatesQuery,
  useGetCompanyCandidateDetailQuery,
  // Company Jobs
  useGetCompanyJobsQuery,
  useGetCompanyJobDetailQuery,
  useCreateCompanyJobMutation,
  useUpdateCompanyJobMutation,
  useDeleteCompanyJobMutation,
  useRequestCompanyJobEditMutation,
  useGetJobQuotaQuery,
  usePurchaseJobSlotsMutation,
  // Company Profile
  useGetCompanyProfileQuery,
  useUpdateCompanyProfileMutation,
  // Company Interviews
  useGetCompanyInterviewsQuery,
  useCreateCompanyInterviewMutation,
  useGetCompanyInterviewDetailQuery,
  useGetCompanyInterviewReportQuery,
  useLazyDownloadCompanyInterviewReportPdfQuery,
  useCreateCompanyInterviewQuestionMutation,
  useDeleteCompanyInterviewQuestionMutation,
  useGenerateCompanyInterviewQuestionsMutation,
  useSendCompanyInterviewMutation,
  useGetCompanyJobApplicationsQuery,
  useChangeApplicationStatusMutation,
  // Subscriptions
  useGetSubscriptionHistoryQuery,
  useGetSubscriptionPlansQuery,
  useCreateStripeCheckoutSessionMutation,
  // Notifications
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  // Chat
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
  useCreateConversationMutation,
  // Contacts
  useSubmitContactFormMutation,
  // Candidate Interview Attempt
  useStartInterviewAttemptMutation,
  useSubmitInterviewAnswerMutation,
  useSubmitInterviewAttemptMutation,
} = authApi;
