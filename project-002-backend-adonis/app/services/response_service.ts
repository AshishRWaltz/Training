/* eslint-disable prettier/prettier */
import logger from '@adonisjs/core/services/logger'
import { ApiResponse, ResponseOptions } from '../types/response_interface.js'
import { HttpContext } from '@adonisjs/core/http'

export default class ResponseService {
    buildSuccess(_message: string, _data?: any): ApiResponse {
        return {
            status: 'success',
            data: _data,
            message: _message,
        }
    }

    buildFailure(_message: string, _data?: any): ApiResponse {
        console.log(_message, _data)
        return {
            status: 'failure',
            data: _data,
            message: _message,
        }
    }

    sendResponse(
        _response: HttpContext['response'],
        _responseData: ApiResponse,
        _options?: ResponseOptions
    ) {
        let overrideHttpCode = (_options && _options['overrideHttpCode']) || false

        if (overrideHttpCode === false) {
            _responseData?.status === 'success' ? overrideHttpCode = 200 : overrideHttpCode = 500
        }
        return _response.status(overrideHttpCode).json(_responseData
        )
    }

    buildLogger(_type: 'error' | 'warn' | 'info',
        _data: string | object
    ) {
        if (typeof _data === 'string') {
            logger[_type](_data)
        } else {
            logger[_type](_data)
        }
    }
}