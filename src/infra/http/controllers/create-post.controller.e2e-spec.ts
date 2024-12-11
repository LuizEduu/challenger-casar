import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/make-user'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = app.get(UserFactory)

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
        createdAt: expect.any(String),
      },
    })
  })
})
