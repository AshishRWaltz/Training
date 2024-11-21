import User from '#models/user'

export const hasRole = (user: User | null, role: string): boolean => {
  return user?.roles?.some((roleData: { slug: string }) => roleData.slug === role) || false
}

/**
 * Generates a UUID v4.
 *
 * @returns {string} A random UUID v4 string.
 */
export const uuidv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}