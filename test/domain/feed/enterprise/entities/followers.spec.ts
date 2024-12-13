import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Followers } from '@/domain/feed/enterprise/entities/followers'

describe('Followers entity', () => {
  it('should create a follower relationship with valid properties', () => {
    const followerId = new UniqueEntityID('follower-id')
    const followedId = new UniqueEntityID('followed-id')

    const follower = Followers.create({ followerId, followedId })

    expect(follower).toBeTruthy()
    expect(follower.followerId).toEqual(followerId)
    expect(follower.followedId).toEqual(followedId)
    expect(follower.followedAt).toBeInstanceOf(Date)
  })

  it('should default followedAt to the current date if not provided', () => {
    const followerId = new UniqueEntityID('follower-id')
    const followedId = new UniqueEntityID('followed-id')

    const follower = Followers.create({ followerId, followedId })

    expect(follower.followedAt).toBeInstanceOf(Date)
    const now = new Date()
    expect(follower.followedAt.getDate()).toEqual(now.getDate())
    expect(follower.followedAt.getMonth()).toEqual(now.getMonth())
    expect(follower.followedAt.getFullYear()).toEqual(now.getFullYear())
  })

  it('should accept a custom followedAt date', () => {
    const followerId = new UniqueEntityID('follower-id')
    const followedId = new UniqueEntityID('followed-id')
    const customDate = new Date('2023-01-01T00:00:00Z')

    const follower = Followers.create({
      followerId,
      followedId,
      followedAt: customDate,
    })

    expect(follower.followedAt).toEqual(customDate)
  })

  it('should accept an optional unique ID', () => {
    const followerId = new UniqueEntityID('follower-id')
    const followedId = new UniqueEntityID('followed-id')
    const uniqueId = new UniqueEntityID('custom-id')

    const follower = Followers.create({ followerId, followedId }, uniqueId)

    expect(follower.id).toEqual(uniqueId)
  })
})
