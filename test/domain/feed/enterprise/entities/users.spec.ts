import { ValidationError } from '@/core/errors/validation-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/feed/enterprise/entities/users'

describe('User entity', () => {
  it('should create a user with valid properties', () => {
    const user = User.create({ name: 'ValidUserName' })

    expect(user).toBeTruthy()
    expect(user.name).toEqual('ValidUserName')
    expect(user.createdAt).toBeInstanceOf(Date)
  })

  it('should throw a validation error if name is longer than 14 characters', () => {
    expect(() => User.create({ name: 'NameWithMoreThan14Chars' })).toThrow(
      ValidationError,
    )
  })

  it('should throw a validation error if name contains non-alphanumeric characters', () => {
    expect(() => User.create({ name: 'Invalid@Name!' })).toThrow(
      ValidationError,
    )
  })

  it('should default createdAt to current date if not provided', () => {
    const user = User.create({ name: 'ValidName' })

    expect(user.createdAt).toBeInstanceOf(Date)
    const now = new Date()
    expect(user.createdAt.getDate()).toEqual(now.getDate())
    expect(user.createdAt.getMonth()).toEqual(now.getMonth())
    expect(user.createdAt.getFullYear()).toEqual(now.getFullYear())
  })

  it('should accept a custom createdAt date', () => {
    const customDate = new Date('2023-01-01T00:00:00Z')
    const user = User.create({ name: 'ValidName', createdAt: customDate })

    expect(user.createdAt).toEqual(customDate)
  })

  it('should accept an optional unique ID', () => {
    const uniqueId = new UniqueEntityID('custom-id')
    const user = User.create({ name: 'ValidName' }, uniqueId)

    expect(user.id).toEqual(uniqueId)
  })
})
