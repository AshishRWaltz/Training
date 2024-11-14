import { ApiResponse } from '../types/users.js'

export default class ResponseService {
    buildSuccess(_message: string, _data?: any): ApiResponse {
        return {
            status: 'success',
            data: _data,
            message: _message,
        }
    }

    buildFailure(_message: string, _data?: any): ApiResponse {
        return {
            status: 'failure',
            data: _data,
            message: _message,
        }
    }
}