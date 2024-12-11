import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import dayjs from 'dayjs'
import request from 'supertest'
import { FollowersFactory } from 'test/factories/make-follower'
import { PostFactory } from 'test/factories/make-post'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch recent followed posts (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let postsFactory: PostFactory
  let followersFactory: FollowersFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PostFactory, UserFactory, FollowersFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    postsFactory = moduleRef.get(PostFactory)
    userFactory = moduleRef.get(UserFactory)
    followersFactory = moduleRef.get(FollowersFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[GET] /posts/followed/:userId', async () => {
    const user = await userFactory.makePrismaUser()
    const userToFollow = await userFactory.makePrismaUser()

    for (let i = 1; i <= 10; i++) {
      await postsFactory.makePrismaPost({
        content: `fake content ${i}`,
        createdAt: dayjs()
          .add(i * 10, 'seconds')
          .toDate(),
        ownerId: userToFollow.id,
      })
    }

    await followersFactory.makePrismaFollowers({
      followerId: user.id,
      followedId: userToFollow.id,
    })

    const response = await request(app.getHttpServer()).get(
      `/posts/followed/${user.id.toString()}`,
    )

    expect(response.statusCode).toBe(200)
    expect(response.body.posts.length).toEqual(10)
    expect(response.body).toEqual({
      posts: expect.arrayContaining([
        expect.objectContaining({
          content: 'fake content 10',
          ownerId: userToFollow.id.toString(),
        }),
        expect.objectContaining({
          content: 'fake content 9',
          ownerId: userToFollow.id.toString(),
        }),
      ]),
    })
  })

  test('[GET] /posts with pagination', async () => {
    await prisma.post.deleteMany()
    const user = await userFactory.makePrismaUser()
    const userToFollow = await userFactory.makePrismaUser()

    for (let i = 1; i <= 13; i++) {
      await postsFactory.makePrismaPost({
        content: `fake content ${i}`,
        createdAt: dayjs()
          .add(i * 10, 'seconds')
          .toDate(),
        ownerId: userToFollow.id,
      })
    }

    await followersFactory.makePrismaFollowers({
      followerId: user.id,
      followedId: userToFollow.id,
    })

    const response = await request(app.getHttpServer()).get(
      `/posts/followed/${user.id.toString()}?page=2`,
    )

    expect(response.statusCode).toBe(200)
    expect(response.body.posts.length).toEqual(3)
    expect(response.body).toEqual({
      posts: expect.arrayContaining([
        expect.objectContaining({
          content: 'fake content 1',
          ownerId: userToFollow.id.toString(),
        }),
        expect.objectContaining({
          content: 'fake content 2',
          ownerId: userToFollow.id.toString(),
        }),
      ]),
    })
  })
})
