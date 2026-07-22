import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./index";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://10.10.29.169:8020/api/v1";

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
  additional_questions: any[];
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
}

export interface CompanyInterviewPayload {
  candidate_profile_id: number;
  job_id: string;
  num_questions: number;
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
  match_score: number;
  has_saved_cv: boolean;
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
  job_title: string;
  status: string;
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
  subscription:string;
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
  tagTypes: ["AdminCandidates", "AdminCompanies", "AdminDashboard", "AdminJobs", "AdminSettings", "AdminSubscriptions", "AdminApplications", "CandidateDashboard", "CandidateApplications", "CandidateJobDetail", "CompanyCandidates", "CompanyJobs", "CompanyDashboard", "CompanyInterviews", "Notifications", "ChatConversations"],
  endpoints: (builder) => ({
    // POST /auth/login/email/
    loginWithEmail: builder.mutation<ApiResponse<LoginData>, LoginPayload>({
      query: (body) => ({
        url: "auth/login/email/",
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

    // ── Admin Dashboard ─────────────────────────────────────────────────────

    // GET /admin/dashboard/
    getAdminDashboard: builder.query<ApiResponse<DashboardData>, void>({
      query: () => "admin/dashboard/",
      providesTags: ["AdminDashboard"],
    }),

    // ── Admin Candidate endpoints ─────────────────────────────────────────────

    // GET /admin/candidates/
    getAdminCandidates: builder.query<ApiResponse<AdminCandidateListItem[]>, void>({
      query: () => "admin/candidates/",
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

    // ── Company Interview endpoints ─────────────────────────────────────────────

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
    sendCompanyInterview: builder.mutation<ApiResponse<CompanyInterview>, string>({
      query: (id) => ({
        url: `company/interviews/${id}/send/`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, id) => [{ type: "CompanyInterviews", id }],
    }),

    // POST /candidate/interview/generate-questions/
    generateCompanyInterviewQuestions: builder.mutation<ApiResponse<string[]>, { job_id: string; job_description: string; num_questions: number }>({
      query: (body) => ({
        url: "candidate/interview/generate-questions/",
        method: "POST",
        body,
      }),
    }),

    // ── Admin Job endpoints ────────────────────────────────────────────────────

    // GET /admin/jobs/
    getAdminJobs: builder.query<ApiResponse<AdminJobListItem[]>, void>({
      query: () => "admin/jobs/",
      providesTags: ["AdminJobs"],
    }),

    // DELETE /admin/jobs/{id}/
    deleteAdminJob: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `admin/jobs/${id}/`, method: "DELETE" }),
      invalidatesTags: ["AdminJobs"],
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
    getAdminCompanies: builder.query<ApiResponse<AdminCompanyListItem[]>, void>({
      query: () => "admin/companies/",
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
    getCandidateApplications: builder.query<ApiResponse<CandidateApplicationItem[]>, void>({
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

    // ── Subscription endpoints ──────────────────────────────────────────────

    // GET /subscriptions/history/
    getSubscriptionHistory: builder.query<ApiResponse<SubscriptionHistoryItem[]>, void>({
      query: () => "subscriptions/history/",
    }),

    // GET /subscriptions/plans/
    getSubscriptionPlans: builder.query<ApiResponse<SubscriptionPlan[]>, void>({
      query: () => "subscriptions/plans/",
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
  }),
});

export const {
  useLoginWithEmailMutation,
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
  // Company Interviews
  useCreateCompanyInterviewMutation,
  useGetCompanyInterviewDetailQuery,
  useCreateCompanyInterviewQuestionMutation,
  useDeleteCompanyInterviewQuestionMutation,
  useGenerateCompanyInterviewQuestionsMutation,
  useSendCompanyInterviewMutation,
  // Subscriptions
  useGetSubscriptionHistoryQuery,
  useGetSubscriptionPlansQuery,
  // Notifications
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  // Chat
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
} = authApi;
