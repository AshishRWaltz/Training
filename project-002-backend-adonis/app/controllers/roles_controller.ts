// import type { HttpContext } from '@adonisjs/core/http'

export default class RolesController {
  constructor(
    private rolesService: RolesService,
    private responseService: ResponseService
  ) {}
}
