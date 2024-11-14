import { DateTime } from 'luxon'

export interface User {
    id: number
    firstName: string
    lastName: string
    email: string
    password: string
    createdat: DateTime
    updatedat: DateTime | null
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
    orderby: 'asc' | 'desc'
    order: string
}

export interface AddUserData {
    id?: number
    firstName: string
    lastName: string
    email: string
    password: string
    createdat: DateTime
    updatedat?: DateTime | null
}

export interface UserDetailsResponse {
    status: string
    data: User
    message: string
}

export interface ApiResponse<T = any> {
    status: 'success' | 'failure'
    data?: T
    message: string
}
