import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/make-user'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PostFactory } from 'test/factories/make-post'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let postFactory: PostFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = app.get(UserFactory)
    postFactory = app.get(PostFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /posts', async () => {
    const createdUser = await userFactory.makePrismaUser({
      name: 'JhonDoe',
    })

    const body = {
      content: 'post create to integration test',
      ownerId: createdUser.id.toString(),
    }

    const response = await request(app.getHttpServer())
      .post('/posts')
      .send(body)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({
      post: {
        id: expect.any(String),
        content: body.content,
        ownerId: body.ownerId,
        originalPostId: null,
        createdAt: expect.any(String),
      },
    })
  })

  test('[POST] /posts not create a new post if user makes 5 more posts on the same day', async () => {
    const createdUser = await userFactory.makePrismaUser({
      name: 'JhonDoe',
    })

    for (let i = 0; i < 5; i++) {
      await postFactory.makePrismaPost({
        ownerId: createdUser.id,
        content: 'posts criados anteriormente',
      })
    }

    const body = {
      content: 'post create to integration test',
      ownerId: createdUser.id.toString(),
    }

    const response = await request(app.getHttpServer())
      .post('/posts')
      .send(body)

    expect(response.statusCode).toEqual(422)
    expect(response.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Maximum number of posts on the day reached',
      statusCode: 422,
    })
  })

  test('[POST] /posts with comment', async () => {
    const createdUser = await userFactory.makePrismaUser({
      name: 'JhonDoe',
    })

    const body = {
      content: 'post create to integration test',
      ownerId: createdUser.id.toString(),
      comment: 'comment on post',
    }

    const response = await request(app.getHttpServer())
      .post('/posts')
      .send(body)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({
      post: {
        id: expect.any(String),
        content: body.content,
        ownerId: body.ownerId,
        originalPostId: null,
        createdAt: expect.any(String),
      },
    })
  })
})
