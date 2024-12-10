import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'
import { GetUserUseCase } from './get-user'
import { InMemoryUsersFollowersRepository } from '@/test/repositories/in-memory-users-followers-repository'
import { InMemoryPostsRepository } from '@/test/repositories/in-memory-posts-repository'
import { makeUser } from '@/test/factories/make-user'
import { makeFollower } from '@/test/factories/make-follower'
import { makePost } from '@/test/factories/make-post'

let postsRepository: InMemoryPostsRepository
let usersFollowersRepository: InMemoryUsersFollowersRepository
let usersRepository: InMemoryUsersRepository
let sut: GetUserUseCase

describe('get user use case', () => {
  beforeEach(() => {
    usersFollowersRepository = new InMemoryUsersFollowersRepository()
    postsRepository = new InMemoryPostsRepository()
    usersRepository = new InMemoryUsersRepository(
      usersFollowersRepository,
      postsRepository,
    )

    sut = new GetUserUseCase(usersRepository)
  })

  it('should be able to return user info', async () => {
    const userToFind = makeUser()
    usersRepository.users.push(userToFind)

    for (let i = 0; i < 2; i++) {
      const user = makeUser()
      usersRepository.users.push(user)
      usersFollowersRepository.usersFollowers.push(
        makeFollower({
          followerId: user.id,
          followedId: userToFind.id,
        }),
      )
    }

    const followedUsersIds: string[] = []

    for (let i = 0; i < 2; i++) {
      const user = makeUser()
      usersRepository.users.push(user)
      usersFollowersRepository.usersFollowers.push(
        makeFollower({
          followerId: userToFind.id,
          followedId: user.id,
        }),
      )
      followedUsersIds.push(user.id.toString())
    }

    for (let i = 0; i < 2; i++) {
      postsRepository.inMemoryPosts.push(
        makePost({
          ownerId: userToFind.id,
        }),
      )
    }

    const result = await sut.execute({
      userId: userToFind.id.toString(),
    })

    const followedUsersIdsToCompare =
      result.isRight() &&
      result.value.followedUsers.map((user) => ({
        userId: user.userId.toString(),
      }))

    expect(result.isLeft()).toBe(false)
    expect(result.isRight()).toBe(true)
    result.isRight() && expect(result.value.name).toEqual(userToFind.name)
    result.isRight() &&
      expect(followedUsersIdsToCompare).toEqual([
        expect.objectContaining({
          userId: followedUsersIds[0],
        }),
        expect.objectContaining({
          userId: followedUsersIds[1],
        }),
      ])
    result.isRight() && expect(result.value.numberOfFollowed).toEqual(2)
    result.isRight() && expect(result.value.numberOfFollowers).toEqual(2)
    result.isRight() && expect(result.value.numberOfPosts).toEqual(2)
  })
})