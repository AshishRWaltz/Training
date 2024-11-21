import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'add_is_active_to_users'

  async up() {
    this.schema.table('users', (table) => {
      table.tinyint('isActive').defaultTo(0).notNullable() // Add isActive column
    })
  }

  async down() {
    this.schema.table('users', (table) => {
      table.dropColumn('isActive') // Drop the column if rolling back
    })
  }
}
