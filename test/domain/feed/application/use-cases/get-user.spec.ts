import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryUsersFollowersRepository } from 'test/repositories/in-memory-users-followers-repository'
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository'
import { makeUser } from 'test/factories/make-user'
import { makeFollower } from 'test/factories/make-follower'
import { makePost } from 'test/factories/make-post'
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository'
import { GetUserUseCase } from '@/domain/feed/application/use-cases/get-user'
import { UserNotFoundError } from '@/core/errors/user-not-found-error'

let postsRepository: InMemoryPostsRepository
let commentsRepository: InMemoryCommentsRepository
let usersFollowersRepository: InMemoryUsersFollowersRepository
let usersRepository: InMemoryUsersRepository
let sut: GetUserUseCase

describe('get user use case', () => {
  beforeEach(() => {
    usersFollowersRepository = new InMemoryUsersFollowersRepository()
    commentsRepository = new InMemoryCommentsRepository()
    postsRepository = new InMemoryPostsRepository(commentsRepository)
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

    const postContent = 'content'

    for (let i = 0; i < 2; i++) {
      postsRepository.inMemoryPosts.push(
        makePost({
          content: postContent,
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

    if (result.isRight()) {
      expect(result.value.name).toEqual(userToFind.name)
      expect(followedUsersIdsToCompare).toEqual([
        expect.objectContaining({
          userId: followedUsersIds[0],
        }),
        expect.objectContaining({
          userId: followedUsersIds[1],
        }),
      ])
      expect(result.value.numberOfFolloweds).toEqual(2)
      expect(result.value.numberOfFollowers).toEqual(2)
      expect(result.value.numberOfPosts).toEqual(2)
      expect(result.value.numberOfPosts).toEqual(2)
      const postResult = result.value.posts.map((p) => ({
        ownerId: p.ownerId.toString(),
        content: p.content,
      }))
      expect(
        result.value.posts.map((p) => ({
          ownerId: p.ownerId.toString(),
          content: p.content,
        })),
      ).toEqual(postResult)
    }
  })

  it('should be able to throws UserNotFoundError when user not found', async () => {
    const userToFind = makeUser()

    const result = await sut.execute({
      userId: userToFind.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UserNotFoundError)
  })
})
