import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
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
    password: vine
      .string()
      .minLength(6)
      .maxLength(15)
      .confirmed()
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\])[A-Za-z\d@$!%*#?&-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]{8,}$/
      ),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)

export const changePasswordValidator = vine.compile(
  vine.object({
    old_password: vine
      .string()
      .minLength(6)
      .maxLength(15)
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\])[A-Za-z\d@$!%*#?&-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]{8,}$/
      ),
    new_password: vine
      .string()
      .minLength(6)
      .confirmed()
      .maxLength(15)
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\])[A-Za-z\d@$!%*#?&-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]{8,}$/
      ),
  })
)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string(),
    password: vine
      .string()
      .minLength(6)
      .maxLength(15)
      .confirmed()
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\])[A-Za-z\d@$!%*#?&-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]{8,}$/
      ),
  })
)
