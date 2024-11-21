/* eslint-disable prettier/prettier */
import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    first_name: vine
      .string()
      .trim()
      .regex(/^[a-zA-Z\s]+$/)
      .minLength(2)
      .maxLength(256),
    last_name: vine
      .string()
      .trim()
      .regex(/^[a-zA-Z\s]+$/)
      .minLength(2)
      .maxLength(256),
    email: vine.string().trim().email().minLength(2).maxLength(256),
    password: vine.string().trim().minLength(8).maxLength(256),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    first_name: vine
      .string()
      .trim()
      .regex(/^[a-zA-Z\s]+$/)
      .minLength(2)
      .maxLength(256),
    last_name: vine
      .string()
      .trim()
      .regex(/^[a-zA-Z\s]+$/)
      .minLength(2)
      .maxLength(256),
    email: vine.string().trim().email().minLength(2).maxLength(256),
    password: vine.string().trim().minLength(8).maxLength(256),
    created_at: vine.date(),
  })
)
