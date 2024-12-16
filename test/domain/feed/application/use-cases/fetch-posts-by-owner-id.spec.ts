import { UserNotFoundError } from '@/core/errors/user-not-found-error'
import { FetchPostsByOwnerIdUseCase } from '@/domain/feed/application/use-cases/fetch-posts-by-owner-id'
import { makePost } from 'test/factories/make-post'
import { makeUser } from 'test/factories/make-user'
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository'
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository'
import { InMemoryUsersFollowersRepository } from 'test/repositories/in-memory-users-followers-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

let inMemoryCommentsRepository: InMemoryCommentsRepository
let inMemoryUsersFollowersRepository: InMemoryUsersFollowersRepository
let inMemoryPostsRepository: InMemoryPostsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: FetchPostsByOwnerIdUseCase

describe('fetch posts by ownerId use case', () => {
  beforeEach(() => {
    inMemoryUsersFollowersRepository = new InMemoryUsersFollowersRepository()
    inMemoryCommentsRepository = new InMemoryCommentsRepository()
    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryCommentsRepository,
    )
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryUsersFollowersRepository,
      inMemoryPostsRepository,
    )

    sut = new FetchPostsByOwnerIdUseCase(
      inMemoryUsersRepository,
      inMemoryPostsRepository,
    )
  })

  it('should be able to fetch five user recents posts', async () => {
    const user = makeUser()
    inMemoryUsersRepository.users.push(user)

    for (let i = 1; i <= 7; i++) {
      const post = makePost({
        content: `post ${i}`,
        ownerId: user.id,
      })
      inMemoryPostsRepository.inMemoryPosts.push(post)
    }

    const result = await sut.execute({
      userId: user.id.toString(),
      page: 1,
    })

    expect(result.isLeft()).toBe(false)
    expect(result.isRight()).toBe(true)
    result.isRight() && expect(result.value).toHaveLength(5)
  })

  it('should be able to fetch five user recents posts with pagination', async () => {
    const user = makeUser()
    inMemoryUsersRepository.users.push(user)

    for (let i = 1; i <= 7; i++) {
      const post = makePost({
        content: `post ${i}`,
        ownerId: user.id,
      })
      inMemoryPostsRepository.inMemoryPosts.push(post)
    }

    const result = await sut.execute({
      userId: user.id.toString(),
      page: 2,
    })

    expect(result.isLeft()).toBe(false)
    expect(result.isRight()).toBe(true)
    result.isRight() && expect(result.value).toHaveLength(2)
  })

  it('should be able to throws UserNotFoundError when user not found', async () => {
    const user = makeUser()

    const result = await sut.execute({
      userId: user.id.toString(),
      page: 2,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UserNotFoundError)
  })
})
