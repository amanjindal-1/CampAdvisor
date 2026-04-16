import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'

export const authApi = {
  forgotPassword: (email: string) =>
    apiClient.post<ApiResponse<void>>('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<ApiResponse<void>>('/auth/reset-password', { token, newPassword }),

  verifyEmail: (token: string) =>
    apiClient.post<ApiResponse<void>>(`/auth/verify-email?token=${token}`),

  resendVerification: () =>
    apiClient.post<ApiResponse<void>>('/auth/resend-verification'),
}
