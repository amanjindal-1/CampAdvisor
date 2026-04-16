import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { AuthResponse } from '@/types/auth'

export interface UpdateProfileRequest {
  displayName?: string
  bio?: string
}

export const usersApi = {
  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.patch<ApiResponse<AuthResponse['user']>>('/users/me', data),
}
