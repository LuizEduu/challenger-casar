import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/make-user'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PostFactory } from 'test/factories/make-post'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Repost (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let postFactory: PostFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = app.get(UserFactory)
    postFactory = app.get(PostFactory)
    prisma = app.get(PrismaService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /posts/repost', async () => {
    const createdUser = await userFactory.makePrismaUser({
      name: 'JhonDoe',
    })

    const post = await postFactory.makePrismaPost({
      content: 'post created to repost',
      ownerId: createdUser.id,
      originalPostId: null,
    })

    const userToRepost = await userFactory.makePrismaUser({
      name: 'repostUser',
    })

    const body = {
      ownerId: userToRepost.id.toString(),
      originalPostId: post.id.toString(),
    }

    const response = await request(app.getHttpServer())
      .post('/posts/repost')
      .send(body)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({
      post: {
        id: expect.any(String),
        content: post.content,
        ownerId: body.ownerId,
        originalPostId: post.id.toString(),
        createdAt: expect.any(String),
      },
    })
  })

  test('[POST] /posts/repost not repost if user makes 5 more posts on the same day', async () => {
    const createdUser = await userFactory.makePrismaUser({
      name: 'JhonDoe',
    })

    const post = await postFactory.makePrismaPost({
      content: 'post created to repost',
      ownerId: createdUser.id,
      originalPostId: null,
    })

    const userToRepost = await userFactory.makePrismaUser({
      name: 'repostUser',
    })

    for (let i = 0; i < 5; i++) {
      await postFactory.makePrismaPost({
        ownerId: userToRepost.id,
        content: 'posts criados anteriormente',
      })
    }

    const body = {
      ownerId: userToRepost.id.toString(),
      originalPostId: post.id.toString(),
    }

    const response = await request(app.getHttpServer())
      .post('/posts/repost')
      .send(body)

    expect(response.statusCode).toEqual(422)
    expect(response.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Maximum number of posts on the day reached',
      statusCode: 422,
    })
  })

  test('[POST] /posts/repost with comment', async () => {
    const createdUser = await userFactory.makePrismaUser({
      name: 'JhonDoe',
    })

    const post = await postFactory.makePrismaPost({
      content: 'post created to repost',
      ownerId: createdUser.id,
      originalPostId: null,
    })

    const userToRepost = await userFactory.makePrismaUser({
      name: 'repostUser',
    })

    const body = {
      ownerId: userToRepost.id.toString(),
      originalPostId: post.id.toString(),
      comment: 'comment on repost',
    }

    const response = await request(app.getHttpServer())
      .post('/posts/repost')
      .send(body)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({
      post: {
        id: expect.any(String),
        content: post.content,
        ownerId: body.ownerId,
        originalPostId: post.id.toString(),
        createdAt: expect.any(String),
      },
    })

    const commentOnDb = await prisma.comment.findFirst({
      where: {
        postId: response.body.id,
      },
    })

    expect(commentOnDb?.content).toEqual('comment on repost')
  })
})
