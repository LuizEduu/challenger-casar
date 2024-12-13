import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository'
import { CreatePostUseCase } from './create-post'
import { faker } from '@faker-js/faker'
import { makeUser } from 'test/factories/make-user'
import { ValidationError } from '@/core/errors/validation-error'
import { makePost } from 'test/factories/make-post'
import { PostsMaxQuantityError } from '@/core/errors/posts-max-quantity-error'
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository'

let inMemoryCommentsRepository: InMemoryCommentsRepository
let inMemoryPostsRepository: InMemoryPostsRepository
let sut: CreatePostUseCase

describe('create post use case', async () => {
  beforeEach(() => {
    inMemoryCommentsRepository = new InMemoryCommentsRepository()
    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryCommentsRepository,
    )
    sut = new CreatePostUseCase(inMemoryPostsRepository)
  })

  it('should be able to create a new post', async () => {
    const user = makeUser()
    const content = faker.lorem.sentence()

    const result = await sut.execute({
      content,
      ownerId: user.id.toString(),
      originalPostId: null,
    })

    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)
    expect(inMemoryPostsRepository.inMemoryPosts).toHaveLength(1)
    if (result.isRight()) {
      expect(result.value.content).toEqual(content)
      expect(result.value.ownerId.toString()).toEqual(user.id.toString())
    }
  })

  it('should throws validation error when content length greater then 200 characters', async () => {
    const user = makeUser()
    const content = faker.lorem.sentence({
      min: 201,
      max: 400,
    })

    const result = await sut.execute({
      content,
      ownerId: user.id.toString(),
      originalPostId: null,
    })

    expect(result.isRight()).toBe(false)
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ValidationError)
  })

  it('should throws PostsMaxQuantityError if the user sends more than 5 posts in a day', async () => {
    const user = makeUser()

    for (let i = 0; i < 5; i++) {
      const post = makePost({
        ownerId: user.id,
        content: 'a new post',
      })
      await inMemoryPostsRepository.create(post)
    }

    const result = await sut.execute({
      content: 'post que não deve ser criado',
      ownerId: user.id.toString(),
      originalPostId: null,
    })

    expect(result.isRight()).toBe(false)
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PostsMaxQuantityError)
    expect(inMemoryPostsRepository.inMemoryPosts.length).toEqual(5)
  })

  it('should be able to create a new post with comment', async () => {
    const user = makeUser()
    const content = faker.lorem.sentence()

    const result = await sut.execute({
      content,
      ownerId: user.id.toString(),
      originalPostId: null,
      comment: 'comentário sobre o post',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)
    expect(inMemoryPostsRepository.inMemoryPosts).toHaveLength(1)
    expect(inMemoryCommentsRepository.comments).toHaveLength(1)
    if (result.isRight()) {
      expect(result.value.content).toEqual(content)
      expect(result.value.ownerId.toString()).toEqual(user.id.toString())
      expect(inMemoryCommentsRepository.comments[0].postId.toString()).toEqual(
        result.value.id.toString(),
      )
    }
  })
})
