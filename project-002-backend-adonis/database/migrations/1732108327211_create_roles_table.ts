import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.table('roles', (table) => {
      table.string('slug')
      table.string('description')
      table.string('name')
    })
  }

  async down() {
    this.schema.table('roles', (table) => {
      table.dropColumn('slug')
      table.dropColumn('description')
      table.dropColumn('name') // Drop the column if rolling back
    })
  }
}
