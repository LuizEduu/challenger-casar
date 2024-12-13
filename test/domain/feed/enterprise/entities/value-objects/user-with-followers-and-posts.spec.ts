import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserWithFollowersAndPosts } from '@/domain/feed/enterprise/entities/value-objects/user-with-followers-and-posts'

describe('UserWithFollowersAndPosts value object', () => {
  it('should create a valid UserWithFollowersAndPosts instance', () => {
    const ingressedAt = new Date('2023-01-01T00:00:00Z')
    const followedUsers = [
      { userId: new UniqueEntityID('user-id-1'), name: 'User1' },
      { userId: new UniqueEntityID('user-id-2'), name: 'User2' },
    ]

    const user = UserWithFollowersAndPosts.create({
      name: 'ValidUser',
      ingressedAt,
      numberOfFollowers: 100,
      numberOfFolloweds: 50,
      numberOfPosts: 20,
      followedUsers,
    })

    expect(user).toBeTruthy()
    expect(user.name).toEqual('ValidUser')
    expect(user.ingressedAt).toEqual(ingressedAt)
    expect(user.numberOfFollowers).toEqual(100)
    expect(user.numberOfFolloweds).toEqual(50)
    expect(user.numberOfPosts).toEqual(20)
    expect(user.followedUsers).toEqual(followedUsers)
  })

  it('should allow updating the name property', () => {
    const user = UserWithFollowersAndPosts.create({
      name: 'InitialName',
      ingressedAt: new Date(),
      numberOfFollowers: 10,
      numberOfFolloweds: 5,
      numberOfPosts: 2,
      followedUsers: [],
    })

    user.name = 'UpdatedName'
    expect(user.name).toEqual('UpdatedName')
  })

  it('should allow updating the ingressedAt property', () => {
    const initialDate = new Date('2023-01-01T00:00:00Z')
    const updatedDate = new Date('2024-01-01T00:00:00Z')

    const user = UserWithFollowersAndPosts.create({
      name: 'User',
      ingressedAt: initialDate,
      numberOfFollowers: 10,
      numberOfFolloweds: 5,
      numberOfPosts: 2,
      followedUsers: [],
    })

    user.ingressedAt = updatedDate
    expect(user.ingressedAt).toEqual(updatedDate)
  })

  it('should allow updating the numberOfFollowers property', () => {
    const user = UserWithFollowersAndPosts.create({
      name: 'User',
      ingressedAt: new Date(),
      numberOfFollowers: 10,
      numberOfFolloweds: 5,
      numberOfPosts: 2,
      followedUsers: [],
    })

    user.numberOfFollowers = 15
    expect(user.numberOfFollowers).toEqual(15)
  })

  it('should allow updating the numberOfFolloweds property', () => {
    const user = UserWithFollowersAndPosts.create({
      name: 'User',
      ingressedAt: new Date(),
      numberOfFollowers: 10,
      numberOfFolloweds: 5,
      numberOfPosts: 2,
      followedUsers: [],
    })

    user.numberOfFolloweds = 10
    expect(user.numberOfFolloweds).toEqual(10)
  })

  it('should allow updating the numberOfPosts property', () => {
    const user = UserWithFollowersAndPosts.create({
      name: 'User',
      ingressedAt: new Date(),
      numberOfFollowers: 10,
      numberOfFolloweds: 5,
      numberOfPosts: 2,
      followedUsers: [],
    })

    user.numberOfPosts = 5
    expect(user.numberOfPosts).toEqual(5)
  })

  it('should allow updating the followedUsers property', () => {
    const initialFollowedUsers = [
      { userId: new UniqueEntityID('user-id-1'), name: 'User1' },
    ]
    const updatedFollowedUsers = [
      { userId: new UniqueEntityID('user-id-2'), name: 'User2' },
    ]

    const user = UserWithFollowersAndPosts.create({
      name: 'User',
      ingressedAt: new Date(),
      numberOfFollowers: 10,
      numberOfFolloweds: 5,
      numberOfPosts: 2,
      followedUsers: initialFollowedUsers,
    })

    user.followedUsers = updatedFollowedUsers
    expect(user.followedUsers).toEqual(updatedFollowedUsers)
  })
})
