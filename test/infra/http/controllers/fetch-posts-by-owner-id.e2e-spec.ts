import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import dayjs from 'dayjs'
import request from 'supertest'
import { PostFactory } from 'test/factories/make-post'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch posts by owner id (E2E)', () => {
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

  test('[GET] /users/:userId/posts', async () => {
    const user = await userFactory.makePrismaUser()

    for (let i = 1; i <= 10; i++) {
      await postsFactory.makePrismaPost({
        content: `fake content ${i}`,
        createdAt: dayjs()
          .add(i * 2000, 'seconds')
          .toDate(),
        ownerId: user.id,
      })
    }

    const response = await request(app.getHttpServer()).get(
      `/users/${user.id.toString()}/posts`,
    )

    expect(response.statusCode).toBe(200)
    expect(response.body.posts.length).toEqual(5)
    expect(response.body).toEqual({
      posts: expect.arrayContaining([
        expect.objectContaining({
          content: 'fake content 10',
          ownerId: user.id.toString(),
        }),
        expect.objectContaining({
          content: 'fake content 9',
          ownerId: user.id.toString(),
        }),
      ]),
    })
  })

  test('[GET] /users/:userId/posts with pagination', async () => {
    await prisma.post.deleteMany()
    const user = await userFactory.makePrismaUser()

    for (let i = 1; i <= 10; i++) {
      await postsFactory.makePrismaPost({
        content: `fake content ${i}`,
        createdAt: dayjs()
          .add(i * 2000, 'seconds')
          .toDate(),
        ownerId: user.id,
      })
    }

    const response = await request(app.getHttpServer()).get(
      `/users/${user.id.toString()}/posts?page=2`,
    )

    expect(response.statusCode).toBe(200)
    expect(response.body.posts.length).toEqual(5)
    expect(response.body).toEqual({
      posts: expect.arrayContaining([
        expect.objectContaining({
          content: 'fake content 5',
          ownerId: user.id.toString(),
        }),
        expect.objectContaining({
          content: 'fake content 4',
          ownerId: user.id.toString(),
        }),
      ]),
    })
  })
})
