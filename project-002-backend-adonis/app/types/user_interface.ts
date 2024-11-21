import { DateTime } from 'luxon'

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  password: string
  created_at: DateTime
  updated_at: DateTime | null
}

export interface UsersDataResponse {
  status: string
  message: string
  data: User[]
}

export interface ListCriteria {
  id?: number
  limit: number
  page: number
  search: string
  sortby: string
  orderby: string
  order: 'asc' | 'desc'
}

export interface AddUserData {
  id: number
  first_name: string
  last_name: string
  email: string
  password: string
  created_at?: DateTime
  updated_at?: DateTime | null
}

export interface UserDetailsResponse {
  status: string
  data: User
  message: string
}

export interface ApiResponse<T> {
  status: 'success' | 'failure'
  data?: T
  message: string
}

export interface UserProfileupdated_ata {
  id: number
  first_name: string
  last_name: string
  email: string
  password: string
}
