export interface ApiResponse<T = unknown> {
    status: "success" | "failure";
    message: string;
    data: T | null;
}
export interface PaginationResponse {
    page: number;
    perPage: number;
    totalPages: number;
    totalCount: number;
}
export interface SearchData {
    page: number;
    perPage: number;
    commonSearch: string;
    sortBy: string;
}
