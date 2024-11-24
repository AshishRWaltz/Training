import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Role from './role.js'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Token from './token.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  serializeExtras() {
    let _extras: any = {}
    if (this.$extras && Object.keys(this.$extras).length > 0) {
      for (let _key of Object.keys(this.$extras)) {
        _extras[_key] = this.$extras[_key]
      }
      return _extras
    }
  }
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare first_name: string

  @column()
  declare last_name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime | null

  @column()
  declare isActive: boolean

  @column()
  declare isAdmin: boolean

  static accessTokens = DbAccessTokensProvider.forModel(User, { table: 'auth_access_tokens' })

  @manyToMany(() => Role, {
    pivotTable: 'user_role',
  })
  declare roles: ManyToMany<typeof Role>

  @hasMany(() => Token, {
    foreignKey: 'tokenable_id',
    localKey: 'id',
  })
  declare tokens: HasMany<typeof Token>
}
