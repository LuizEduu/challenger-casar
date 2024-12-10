import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository'
import { RepostUseCase } from './repost'
import { makeUser } from 'test/factories/make-user'
import { makePost } from 'test/factories/make-post'
import { ValidationError } from '@/core/errors/validation-error'
import { PostsMaxQuantityError } from '@/core/errors/posts-max-quantity-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

let inMemoryPostsRepository: InMemoryPostsRepository
let sut: RepostUseCase

describe('repost use case', () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository()
    sut = new RepostUseCase(inMemoryPostsRepository)
  })

  it('should be able to repost another user post', async () => {
    const ownerToOriginalPost = makeUser()
    const userToRepost = makeUser()

    const originalPost = makePost({
      ownerId: ownerToOriginalPost.id,
      content: 'original post content',
    })

    await inMemoryPostsRepository.create(originalPost)

    const repost = await sut.execute({
      originalPostId: originalPost.id.toString(),
      ownerId: userToRepost.id.toString(),
    })

    expect(repost.isLeft()).toBe(false)
    expect(repost.isRight()).toBe(true)
    if (repost.isRight()) {
      expect(repost.value.content).toEqual(originalPost.content)
      expect(repost.value.originalPostId?.toString()).toEqual(
        originalPost.id.toString(),
      )
      expect(repost.value.ownerId.toString()).toEqual(
        userToRepost.id.toString(),
      )
    }
  })

  it('should throws validation error when repost content length greater then 200 characters', async () => {
    const ownerToOriginalPost = makeUser()
    const userToRepost = makeUser()

    const originalPost = makePost({
      ownerId: ownerToOriginalPost.id,
      content: 'original post content'.repeat(200),
    })

    await inMemoryPostsRepository.create(originalPost)

    const repost = await sut.execute({
      originalPostId: originalPost.id.toString(),
      ownerId: userToRepost.id.toString(),
    })

    expect(repost.isRight()).toBe(false)
    expect(repost.isLeft()).toBe(true)
    expect(repost.value).toBeInstanceOf(ValidationError)
  })

  it('should throws PostsMaxQuantityError if the user sends more than 5 posts in a day', async () => {
    const ownerToOriginalPost = makeUser()

    const originalPost = makePost({
      ownerId: ownerToOriginalPost.id,
    })

    inMemoryPostsRepository.create(originalPost)

    const userToRepost = makeUser()

    for (let i = 0; i < 5; i++) {
      const post = makePost({
        ownerId: userToRepost.id,
        content: 'a new post',
      })
      await inMemoryPostsRepository.create(post)
    }

    const repost = await sut.execute({
      originalPostId: originalPost.id.toString(),
      ownerId: userToRepost.id.toString(),
    })

    expect(repost.isRight()).toBe(false)
    expect(repost.isLeft()).toBe(true)
    expect(repost.value).toBeInstanceOf(PostsMaxQuantityError)
    expect(inMemoryPostsRepository.inMemoryPosts.length).toEqual(6)
  })

  it('should throws resource not found error when originalPost not found', async () => {
    const ownerToOriginalPost = makeUser()
    const userToRepost = makeUser()

    const originalPost = makePost({
      ownerId: ownerToOriginalPost.id,
      content: 'original post content'.repeat(200),
    })

    const repost = await sut.execute({
      originalPostId: originalPost.id.toString(),
      ownerId: userToRepost.id.toString(),
    })

    expect(repost.isRight()).toBe(false)
    expect(repost.isLeft()).toBe(true)
    expect(repost.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
