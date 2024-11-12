import { Dispatch, SetStateAction } from "react";
import { PaginationResponse } from "./api";

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        }
    };
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    }
}

export interface UsersState {
    users: User[];
    loading: boolean;
    error: string | null;
    page: number;
    limit: number;
    total: number;
}

export interface AddUserProps {
    toggleAddUserModal: () => void;
}

export interface userGetResponse {
    status: string;
    data: User;
    message: string;
}

export interface usersResponse {
    status: string;
    data: User[];
    message: string;
}

export interface UserUpdateResponse {
    status: string,
    data: [],
    message: string
}

export interface UserCreateResponse {
    status: string,
    data: [],
    message: string
}

export interface UserDeleteResponse {
    status: string,
    message: string,
    data: []
}

export interface ConfigurationList {
    value?: string;
    key: string;
}

export interface ConfigurationListResponse {
    status: string;
    data: ConfigurationList[];
    pagination: PaginationResponse;
    message: string;
    [key: string]: any;
}

// Props

export interface SearchBarProps {
    setSearchTerm: Dispatch<SetStateAction<string>>;
}

export interface PaginationProps {
    page: number;
    limit: number;
    total: number;
    next: () => void;
    prev: () => void;
    setPage: Dispatch<SetStateAction<number>>;
    setLimit: Dispatch<SetStateAction<number>>;
}
