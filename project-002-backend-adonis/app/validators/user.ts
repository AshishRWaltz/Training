/* eslint-disable prettier/prettier */
import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
    vine.object({
        firstName: vine.string().trim().minLength(1).maxLength(256),
        lastName: vine.string().trim().minLength(1).maxLength(256),
        email: vine.string().trim().minLength(1).maxLength(256).email(),
        password: vine.string().trim().minLength(8).maxLength(256),
        createdat: vine.date(),
        updatedat: vine.date().optional(),

    })
)
