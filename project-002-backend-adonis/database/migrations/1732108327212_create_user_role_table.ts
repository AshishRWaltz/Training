import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_role'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('role_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('roles')
        .index('role_id')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .index('user_id')
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now()).notNullable()
      table
        .timestamp('updated_at', { useTz: true })
        .defaultTo(this.raw('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'))
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
