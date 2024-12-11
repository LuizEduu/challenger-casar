import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FetchRecentsFollowedPostsUseCase } from './fetch-recents-followed-posts'
import { InMemoryUsersFollowersRepository } from 'test/repositories/in-memory-users-followers-repository'
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository'
import { makeUser } from 'test/factories/make-user'
import dayjs from 'dayjs'
import { makePost } from 'test/factories/make-post'
import { makeFollower } from 'test/factories/make-follower'
import { UserNotFoundError } from '@/core/errors/user-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryUsersFollowersRepository: InMemoryUsersFollowersRepository
let inMemoryPostsRepository: InMemoryPostsRepository
let sut: FetchRecentsFollowedPostsUseCase

describe('Fetch recents followed posts use case', () => {
  beforeEach(() => {
    inMemoryUsersFollowersRepository = new InMemoryUsersFollowersRepository()
    inMemoryPostsRepository = new InMemoryPostsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryUsersFollowersRepository,
      inMemoryPostsRepository,
    )
    sut = new FetchRecentsFollowedPostsUseCase(
      inMemoryUsersRepository,
      inMemoryUsersFollowersRepository,
      inMemoryPostsRepository,
    )
  })

  it('should be able to fetch recent followed posts', async () => {
    const user = makeUser()
    const followedUser = makeUser()
    inMemoryUsersRepository.users.push(user, followedUser)

    for (let i = 1; i <= 5; i++) {
      await inMemoryPostsRepository.create(
        makePost({
          content: `post ${i} - first follower`,
          ownerId: followedUser.id,
          createdAt: dayjs().add(i, 'second').toDate(),
        }),
      )
    }

    const secondFollowedUser = makeUser()
    inMemoryUsersRepository.users.push(secondFollowedUser)

    for (let i = 1; i <= 5; i++) {
      await inMemoryPostsRepository.create(
        makePost({
          content: `post ${i} - second follower`,
          ownerId: secondFollowedUser.id,
          createdAt: dayjs().add(i, 'second').toDate(),
        }),
      )
    }

    const thirdFollowedUser = makeUser()
    inMemoryUsersRepository.users.push(thirdFollowedUser)

    for (let i = 1; i <= 5; i++) {
      await inMemoryPostsRepository.create(
        makePost({
          content: `post ${i} - third follower`,
          ownerId: thirdFollowedUser.id,
          createdAt: dayjs().add(i, 'second').toDate(),
        }),
      )
    }

    const follower = makeFollower({
      followerId: user.id,
      followedId: followedUser.id,
    })

    const secondFollower = makeFollower({
      followerId: user.id,
      followedId: secondFollowedUser.id,
    })

    const thirdFollower = makeFollower({
      followerId: user.id,
      followedId: thirdFollowedUser.id,
    })

    inMemoryUsersFollowersRepository.usersFollowers.push(
      follower,
      secondFollower,
      thirdFollower,
    )

    const result = await sut.execute({
      userId: user.id.toString(),
      page: 1,
    })

    expect(result.isLeft()).toBe(false)
    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveLength(10)
    result.isRight() &&
      expect(result.value?.[0].content).toEqual('post 5 - third follower')
  })

  it('should be able to return empty list when not have recent followed post', async () => {
    const user = makeUser()
    const followedUser = makeUser()
    const secondFollowedUser = makeUser()
    const thirdFollowedUser = makeUser()
    inMemoryUsersRepository.users.push(
      user,
      followedUser,
      secondFollowedUser,
      thirdFollowedUser,
    )

    const follower = makeFollower({
      followerId: user.id,
      followedId: followedUser.id,
    })

    const secondFollower = makeFollower({
      followerId: user.id,
      followedId: secondFollowedUser.id,
    })

    const thirdFollower = makeFollower({
      followerId: user.id,
      followedId: thirdFollowedUser.id,
    })

    inMemoryUsersFollowersRepository.usersFollowers.push(
      follower,
      secondFollower,
      thirdFollower,
    )

    const result = await sut.execute({
      userId: user.id.toString(),
      page: 1,
    })

    expect(result.isLeft()).toBe(false)
    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveLength(0)
  })

  it('should be able to throws UserNotFoundError when user not found', async () => {
    const user = makeUser()
    const result = await sut.execute({
      userId: user.id.toString(),
      page: 1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UserNotFoundError)
  })
})
