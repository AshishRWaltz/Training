import vine from '@vinejs/vine'

export const profileValidator = vine.compile(
  vine.object({
    first_name: vine
      .string()
      .regex(/^[a-zA-Z\s]+$/)
      .minLength(2)
      .maxLength(50),
    last_name: vine
      .string()
      .regex(/^[a-zA-Z\s]+$/)
      .minLength(2)
      .maxLength(50),
    email: vine.string()
  })
)