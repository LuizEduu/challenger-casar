import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/make-user'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PostFactory } from 'test/factories/make-post'
import dayjs from 'dayjs'
import { FollowersFactory } from 'test/factories/make-follower'

describe('Get User (E2E)', () => {
  let app: INestApplication
  let usersFactory: UserFactory
  let postsFactory: PostFactory
  let followersFactory: FollowersFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory, FollowersFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    usersFactory = app.get(UserFactory)
    postsFactory = app.get(PostFactory)
    followersFactory = app.get(FollowersFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /users/:userId', async () => {
    const userToGetData = await usersFactory.makePrismaUser({
      name: 'JhonDoe',
    })

    const userToFollow = await usersFactory.makePrismaUser({
      name: 'DoeJhon',
    })

    const anotherUserToFollow = await usersFactory.makePrismaUser({
      name: 'secondUser',
    })

    await followersFactory.makePrismaFollowers({
      followerId: userToGetData.id,
      followedId: userToFollow.id,
    })

    await followersFactory.makePrismaFollowers({
      followerId: userToGetData.id,
      followedId: anotherUserToFollow.id,
    })

    await followersFactory.makePrismaFollowers({
      followerId: userToFollow.id,
      followedId: userToGetData.id,
    })

    for (let i = 1; i <= 10; i++) {
      await postsFactory.makePrismaPost({
        content: `fake content ${i}`,
        createdAt: dayjs()
          .add(i * 10, 'seconds')
          .toDate(),
        ownerId: userToGetData.id,
      })
    }

    const response = await request(app.getHttpServer()).get(
      `/users/${userToGetData.id.toString()}`,
    )

    const expectedResponse = {
      user: {
        name: userToGetData.name,
        ingressedAt: expect.any(String),
        numberOfFollowers: 1,
        numberOfFolloweds: 2,
        numberOfPosts: 10,
        followedUsers: [
          {
            name: userToFollow.name,
            userId: userToFollow.id.toString(),
          },
          {
            name: anotherUserToFollow.name,
            userId: anotherUserToFollow.id.toString(),
          },
        ],
      },
    }

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(expectedResponse)
  })
})
