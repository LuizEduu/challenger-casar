import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/make-user'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Follower or Unfollower (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = app.get(UserFactory)
    prisma = app.get(PrismaService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /followers', async () => {
    const userToFollower = await userFactory.makePrismaUser({
      name: 'JhonDoe',
    })
    const userToFollow = await userFactory.makePrismaUser({
      name: 'DoeJhon',
    })

    const body = {
      userId: userToFollower.id.toString(),
      followerUserId: userToFollow.id.toString(),
      follower: true,
    }

    const response = await request(app.getHttpServer())
      .post('/followers')
      .send(body)

    expect(response.statusCode).toEqual(204)

    const followerOnDb = await prisma.follower.findFirst({
      where: {
        followerId: userToFollower.id.toString(),
      },
    })

    expect(followerOnDb).toEqual({
      followedAt: expect.any(Date),
      followedId: userToFollow.id.toString(),
      followerId: userToFollower.id.toString(),
      id: expect.any(String),
    })
  })

  test('[POST] /followers unfollow user', async () => {
    const userToFollower = await userFactory.makePrismaUser({
      name: 'JhonDoe',
    })
    const userToUnfollow = await userFactory.makePrismaUser({
      name: 'DoeJhon',
    })

    const body = {
      userId: userToFollower.id.toString(),
      followerUserId: userToUnfollow.id.toString(),
      follower: false,
    }

    const response = await request(app.getHttpServer())
      .post('/followers')
      .send(body)

    expect(response.statusCode).toEqual(204)

    const followerOnDb = await prisma.follower.findFirst({
      where: {
        followerId: userToFollower.id.toString(),
      },
    })

    expect(followerOnDb).toEqual(null)
  })
})
