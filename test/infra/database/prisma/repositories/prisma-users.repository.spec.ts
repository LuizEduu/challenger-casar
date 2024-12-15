import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users-repository'
import {
  setupUnitTestsDatabase,
  teardownUnitTestsDatabase,
} from 'test/setup-repository-unit-test'

let prisma: PrismaService
let usersRepository: PrismaUsersRepository

beforeAll(async () => {
  prisma = await setupUnitTestsDatabase()
  usersRepository = new PrismaUsersRepository(prisma)
})

afterAll(async () => {
  await teardownUnitTestsDatabase()
})

describe('PrismaUsersRepository', () => {
  it('should be able find a user by ID', async () => {
    const user = await prisma.user.create({
      data: { id: '1', name: 'JohnDoe', createdAt: new Date() },
    })

    const foundUser = await usersRepository.findById(user.id)

    expect(foundUser).not.toBeNull()
    expect(foundUser?.name).toBe('JohnDoe')
  })

  it('should be able to return null when user not found', async () => {
    const user = await usersRepository.findById('not-found-id')

    expect(user).toBeNull()
  })

  it('should return user data with followers, followeds, and post counts', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'JohnDoe',
      },
    })

    const followedUser = await prisma.user.create({
      data: {
        name: 'FollowedUser',
      },
    })

    const followerUser = await prisma.user.create({
      data: {
        name: 'FollowerUser',
      },
    })

    await prisma.follower.create({
      data: {
        followerId: followerUser.id,
        followedId: user.id,
      },
    })

    await prisma.follower.create({
      data: {
        followerId: user.id,
        followedId: followedUser.id,
      },
    })

    await prisma.post.createMany({
      data: [
        {
          ownerId: user.id,
          content: 'First post',
        },
        {
          ownerId: user.id,
          content: 'Second post',
        },
      ],
    })

    const result = await usersRepository.findByIdUserWithFollowersAndPosts(
      user.id,
    )

    expect(result).not.toBeNull()
    expect(result?.name).toBe(user.name)
    expect(result?.numberOfFollowers).toBe(1)
    expect(result?.numberOfFolloweds).toBe(1)
    expect(result?.numberOfPosts).toBe(2)
    expect(result?.followedUsers).toHaveLength(1)
    expect(result?.followedUsers[0].name).toBe(followedUser.name)
  })

  it('should return null if user does not exist', async () => {
    const result =
      await usersRepository.findByIdUserWithFollowersAndPosts('non-existent-id')
    expect(result).toBeNull()
  })
})
