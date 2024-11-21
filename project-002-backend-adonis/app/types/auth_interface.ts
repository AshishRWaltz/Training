import Token from '#models/token'
import { DateTime } from 'luxon'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface ForgotPasswordData {
  email: string
}

export interface AuthUserDetails {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  token: string | undefined
}

export interface TokenResponse {
  hash: string
  expiresAt: Date
  tokenable_id: number
  user_id: number
  type: string
}

export interface ResetPasswordData {
  token: string
  password: string
}

export interface PasswordResetToken {
  tokenableId: number
  name: string
  type: string
  hash: string
  abilities: string
  expiresAt: DateTime
  save(): Promise<Token>
}
