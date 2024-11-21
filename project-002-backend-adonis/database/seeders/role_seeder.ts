/* eslint-disable */
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import Logger from '@adonisjs/core/services/logger'

export default class extends BaseSeeder {
  async run() {
    try {
      let _roles: any = [
        {
          slug: 'admin',
          name: 'Administrator',
          description: 'Manage administration privileges',
        },
        {
          slug: 'user',
          name: 'User',
          description: 'Manage user privileges',
        },
      ]
      await Role.fetchOrCreateMany('slug', _roles)
    } catch (error) {
      Logger.error({ err: Error }, error.message)
    }
  }
}
