import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserRole extends BaseModel {
  serializeExtras() {
    let extras: any = {}
    if (this.$extras && Object.keys(this.$extras).length > 0) {
      for (let key of Object.keys(this.$extras)) {
        extras[key] = this.$extras[key]
      }
      return extras
    }
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleId: number

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
