import { InMemoryUsersFollowersRepository } from '@/test/repositories/in-memory-users-followers-repository'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'
import { FollowerOrUnfollowerUseCase } from './follower-or-unfollower'
import { InMemoryPostsRepository } from '@/test/repositories/in-memory-posts-repository'
import { makeUser } from '@/test/factories/make-user'
import { makeFollower } from '@/test/factories/make-follower'
import { UserNotFoundError } from '@/core/errors/user-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

let usersFollowersRepository: InMemoryUsersFollowersRepository
let postsRepository: InMemoryPostsRepository
let usersRepository: InMemoryUsersRepository
let sut: FollowerOrUnfollowerUseCase

describe('follower or unfollower use case', () => {
  beforeEach(() => {
    usersFollowersRepository = new InMemoryUsersFollowersRepository()
    postsRepository = new InMemoryPostsRepository()
    usersRepository = new InMemoryUsersRepository(
      usersFollowersRepository,
      postsRepository,
    )
    sut = new FollowerOrUnfollowerUseCase(
      usersRepository,
      usersFollowersRepository,
    )
  })

  it('should be able to follow a user', async () => {
    const user = makeUser()
    const userToFollow = makeUser()

    usersRepository.users.push(user, userToFollow)

    const result = await sut.execute({
      userId: user.id.toString(),
      followerUserId: userToFollow.id.toString(),
      follower: true,
    })

    expect(result.isLeft()).toBe(false)
    expect(result.isRight()).toBe(true)
    result.isRight() && expect(result.value).toBeNull()
    expect(usersFollowersRepository.usersFollowers.length).toEqual(1)
  })

  it('should be able to unfollow a user', async () => {
    const user = makeUser()
    const userToUnfollow = makeUser()

    usersRepository.users.push(user, userToUnfollow)

    const follower = makeFollower({
      followerId: user.id,
      followedId: userToUnfollow.id,
    })

    usersFollowersRepository.create(follower)

    const result = await sut.execute({
      userId: user.id.toString(),
      followerUserId: userToUnfollow.id.toString(),
      follower: false,
    })

    expect(result.isLeft()).toBe(false)
    expect(result.isRight()).toBe(true)
    result.isRight() && expect(result.value).toBeNull()
    expect(usersFollowersRepository.usersFollowers.length).toEqual(0)
  })

  it('should be able to throws UserNotFoundError when user not found', async () => {
    const user = makeUser()
    const userToFollow = makeUser()

    usersRepository.users.push(userToFollow)

    const result = await sut.execute({
      userId: user.id.toString(),
      followerUserId: userToFollow.id.toString(),
      follower: true,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    result.isRight() && expect(result.value).toBeInstanceOf(UserNotFoundError)
  })

  it('should be able to throws UserNotFoundError when user to follow not found', async () => {
    const user = makeUser()
    const userToFollow = makeUser()

    usersRepository.users.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      followerUserId: userToFollow.id.toString(),
      follower: true,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    result.isRight() && expect(result.value).toBeInstanceOf(UserNotFoundError)
  })

  it('should be able to throws NotAllowedError when user follower or unfollower youselff', async () => {
    const user = makeUser()

    usersRepository.users.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      followerUserId: user.id.toString(),
      follower: true,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    result.isRight() && expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
