import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaPostsRepository } from '@/infra/database/prisma/repositories/prisma-posts-repository'
import {
  setupUnitTestsDatabase,
  teardownUnitTestsDatabase,
} from 'test/setup-repository-unit-test'
import { Post } from '@/domain/feed/enterprise/entities/posts'
import { PrismaCommentsRepository } from '@/infra/database/prisma/repositories/prisma-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import dayjs from 'dayjs'
import { Comment } from '@/domain/feed/enterprise/entities/comments'

let prisma: PrismaService
let commentsRepository: PrismaCommentsRepository
let postsRepository: PrismaPostsRepository

beforeAll(async () => {
  prisma = await setupUnitTestsDatabase()
  commentsRepository = new PrismaCommentsRepository(prisma)
  postsRepository = new PrismaPostsRepository(prisma, commentsRepository)
})

afterAll(async () => {
  await teardownUnitTestsDatabase()
})

describe('PrismaPostsRepository', () => {
  it('should be able to create a post', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'JhonDoe',
      },
    })

    const post = Post.create({
      ownerId: new UniqueEntityID(user.id),
      content: 'Test post',
      createdAt: new Date(),
    })

    await postsRepository.create(post)

    const savedPost = await prisma.post.findUnique({
      where: { id: post.id.toString() },
    })

    expect(savedPost).not.toBeNull()
    expect(savedPost?.content).toBe(post.content)
  })

  it('should be able to create a post with comment', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'JhonDoe',
      },
    })

    const post = Post.create({
      ownerId: new UniqueEntityID(user.id),
      content: 'Test post',
      createdAt: new Date(),
    })

    const comment = Comment.create({
      content: 'comment on post',
      ownerId: new UniqueEntityID(user.id),
      postId: post.id,
    })

    post.comment = comment

    await postsRepository.create(post)

    const savedPost = await prisma.post.findUnique({
      where: { id: post.id.toString() },
    })

    const commentOnDb = await prisma.comment.findUnique({
      where: {
        id: comment.id.toString(),
      },
    })

    expect(savedPost).not.toBeNull()
    expect(savedPost?.content).toBe(post.content)
    expect(commentOnDb).not.toBeNull()
    expect(commentOnDb?.id).toEqual(comment.id.toString())
  })

  it('should be able to find a post by ID', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'JhonDoe',
      },
    })

    const post = await prisma.post.create({
      data: {
        ownerId: user.id,
        content: 'Another test post',
        createdAt: new Date(),
      },
    })

    const foundPost = await postsRepository.findById(post.id)

    expect(foundPost).not.toBeNull()
    expect(foundPost?.id.toString()).toBe(post.id)
  })

  it('should return null when finding a non-existing post by ID', async () => {
    const post = await postsRepository.findById('non-existing-id')

    expect(post).toBeNull()
  })

  it('should count posts by owner ID in the current day', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'JhonDoe',
      },
    })

    await prisma.post.createMany({
      data: [
        { ownerId: user.id, content: 'Post 1', createdAt: new Date() },
        { ownerId: user.id, content: 'Post 2', createdAt: new Date() },
        { ownerId: user.id, content: 'Post 3', createdAt: new Date() },
      ],
    })

    const count = await postsRepository.countByOwnerIdInDay(user.id)

    expect(count).toBe(3)
  })

  it('should fetch posts by multiple user IDs with pagination', async () => {
    const user1 = await prisma.user.create({
      data: {
        name: 'user1',
      },
    })

    const user2 = await prisma.user.create({
      data: {
        name: 'user2',
      },
    })
    const usersIds = [user1.id, user2.id]

    await prisma.post.createMany({
      data: [
        {
          ownerId: user1.id,
          content: 'Post User 1',
        },
        {
          ownerId: user2.id,
          content: 'Post User 2',
        },
        {
          ownerId: user1.id,
          content: 'Another Post User 1',
        },
        {
          ownerId: user2.id,
          content: 'Another Post User 2',
        },
      ],
    })

    const posts = await postsRepository.fetchByUsersIds(usersIds, { page: 1 })

    expect(posts.length).toBe(4)
  })

  it('should fetch recent posts with pagination', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'user1',
      },
    })

    const postsToSave: any = []

    for (let i = 1; i <= 15; i++) {
      postsToSave.push({
        ownerId: user.id,
        content: `post ${i}`,
        createdAt: dayjs()
          .add(i * 1000, 'seconds')
          .toDate(),
      })
    }

    await prisma.post.createMany({
      data: postsToSave,
    })

    const posts = await postsRepository.fetchRecentsPosts({ page: 2 })

    expect(posts.length).toBeGreaterThanOrEqual(5)
  })

  it('should be able  to fetch recent posts by ownerId', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'user1',
      },
    })

    const postsToSave: any = []

    for (let i = 1; i <= 15; i++) {
      postsToSave.push({
        ownerId: user.id,
        content: `post ${i}`,
        createdAt: dayjs()
          .add(i * 1000, 'seconds')
          .toDate(),
      })
    }

    await prisma.post.createMany({
      data: postsToSave,
    })

    const posts = await postsRepository.fetchByOnwerId(user.id, {
      page: 1,
    })

    expect(posts).toHaveLength(5)
    expect(posts[0].content).toEqual('post 15')
  })
})
