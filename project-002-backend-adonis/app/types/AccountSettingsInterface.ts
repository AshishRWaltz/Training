/* eslint-disable unicorn/filename-case */
import User from '#models/user'

export interface UserObject {
  id: number
  password: string
}

export interface ChangePasswordRequest {
  old_password: string
  new_password: string
}

export interface ProfileUpdateData {
  first_name: string
  last_name: string
  email: string
}

export interface UserData {
  id: number
  first_name?: string
  password?: string
  load: (relation: string) => Promise<void>
  toJSON: () => any
  save: () => Promise<User | null>
}

export interface UpdatePasswordCriteria {
  id: number
}

export interface UpdatePasswordData {
  password?: string
}
