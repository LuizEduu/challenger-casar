import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import dayjs from 'dayjs'
import request from 'supertest'
import { PostFactory } from 'test/factories/make-post'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch recent posts (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let postsFactory: PostFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PostFactory, UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    postsFactory = moduleRef.get(PostFactory)
    userFactory = moduleRef.get(UserFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[GET] /posts', async () => {
    const user = await userFactory.makePrismaUser()
    for (let i = 1; i <= 10; i++) {
      await postsFactory.makePrismaPost({
        content: `fake content ${i}`,
        createdAt: dayjs()
          .add(i * 10, 'seconds')
          .toDate(),
        ownerId: user.id,
      })
    }

    const response = await request(app.getHttpServer()).get(`/posts`)

    expect(response.statusCode).toBe(200)
    expect(response.body.posts.length).toEqual(10)
    expect(response.body).toEqual({
      posts: expect.arrayContaining([
        expect.objectContaining({ content: 'fake content 10' }),
        expect.objectContaining({ content: 'fake content 9' }),
      ]),
    })
  })

  test('[GET] /posts with pagination', async () => {
    await prisma.post.deleteMany()
    const user = await userFactory.makePrismaUser()
    for (let i = 1; i <= 13; i++) {
      await postsFactory.makePrismaPost({
        content: `fake content ${i}`,
        createdAt: dayjs()
          .add(i * 10, 'seconds')
          .toDate(),
        ownerId: user.id,
      })
    }

    const response = await request(app.getHttpServer()).get(`/posts?page=2`)

    expect(response.statusCode).toBe(200)
    expect(response.body.posts.length).toEqual(3)
    expect(response.body).toEqual({
      posts: expect.arrayContaining([
        expect.objectContaining({ content: 'fake content 1' }),
        expect.objectContaining({ content: 'fake content 2' }),
        expect.objectContaining({ content: 'fake content 3' }),
      ]),
    })
  })
})
