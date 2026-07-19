import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./index";

const BASE_URL =
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

// ─── Admin Job types ─────────────────────────────────────────────────────────

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
  tagTypes: ["AdminCandidates", "AdminCompanies", "AdminDashboard", "AdminJobs", "AdminSettings", "AdminSubscriptions", "AdminApplications"],
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

    // GET /admin/applications/{id}/pdf/
    downloadApplicationPdf: builder.mutation<Blob, string>({
      queryFn: async (id, _queryApi, _extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: `admin/applications/${id}/pdf/`,
          responseHandler: (response) => response.blob(),
        });
        if (result.error) return { error: result.error };
        return { data: result.data as Blob };
      },
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
  useDownloadApplicationPdfMutation,
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
} = authApi;
