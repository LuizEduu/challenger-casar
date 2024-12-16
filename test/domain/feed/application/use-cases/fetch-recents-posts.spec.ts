import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository'
import { makePost } from 'test/factories/make-post'
import dayjs from 'dayjs'
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository'
import { FetchRecentPostsUseCase } from '@/domain/feed/application/use-cases/fetch-recents-posts'

let inMemoryCommentsRepository: InMemoryCommentsRepository
let inMemoryPostsRepository: InMemoryPostsRepository
let sut: FetchRecentPostsUseCase

describe('Fetch recents posts use case', () => {
  beforeEach(() => {
    inMemoryCommentsRepository = new InMemoryCommentsRepository()
    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryCommentsRepository,
    )
    sut = new FetchRecentPostsUseCase(inMemoryPostsRepository)
  })

  it('should be able to fetch ten recent posts', async () => {
    for (let i = 1; i <= 11; i++) {
      await inMemoryPostsRepository.create(
        makePost({
          content: `post ${i}`,
          createdAt: dayjs().add(1, 'second').toDate(),
        }),
      )
    }

    const posts = await sut.execute({
      page: 1,
    })

    expect(posts.isLeft()).toBe(false)
    expect(posts.isRight()).toBe(true)
    expect(posts.value?.length).toEqual(10)
    expect(posts.value?.[0].content).toEqual('post 11')
  })

  it('should be able to fetch next ten recent posts', async () => {
    for (let i = 1; i <= 20; i++) {
      await inMemoryPostsRepository.create(
        makePost({
          content: `post ${i}`,
          createdAt: dayjs().add(i, 'seconds').toDate(),
        }),
      )

      new Promise((resolve) => setTimeout(resolve, 1000))
    }

    const posts = await sut.execute({
      page: 2,
    })

    expect(posts.isLeft()).toBe(false)
    expect(posts.isRight()).toBe(true)
    expect(posts.value?.length).toEqual(10)
    expect(posts.value?.[0].content).toEqual('post 10')
  })

  it('should be able to return empty list when not have posts', async () => {
    const posts = await sut.execute({
      page: 1,
    })

    expect(posts.isLeft()).toBe(false)
    expect(posts.isRight()).toBe(true)
    expect(posts.value?.length).toEqual(0)
  })
})
