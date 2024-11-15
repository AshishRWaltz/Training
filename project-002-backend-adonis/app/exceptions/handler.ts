import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import ResponseService from '#services/response_service'
import { errors } from '@vinejs/vine';
import { ApiResponse } from '../types/response_interface.js';

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const responseService = new ResponseService()
    if (error instanceof errors.E_VALIDATION_ERROR) {
      let errorData: ApiResponse
      if (error.messages.length > 0) {
        errorData = responseService.buildFailure(error.messages[0].message, error.messages[0])
      } else {
        errorData = responseService.buildFailure(error.messages[0].message, error.messages[0])
      }
      ctx.response.status(422).send(errorData)
      return
    }
    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
