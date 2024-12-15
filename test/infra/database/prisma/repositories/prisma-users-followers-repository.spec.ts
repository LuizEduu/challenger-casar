import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaUsersFollowersRepository } from '@/infra/database/prisma/repositories/prisma-users-followers-repository'
import {
  setupUnitTestsDatabase,
  teardownUnitTestsDatabase,
} from 'test/setup-repository-unit-test'
import { Followers } from '@/domain/feed/enterprise/entities/followers'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let prisma: PrismaService
let usersFollowersRepository: PrismaUsersFollowersRepository

beforeAll(async () => {
  prisma = await setupUnitTestsDatabase()
  usersFollowersRepository = new PrismaUsersFollowersRepository(prisma)
})

afterAll(async () => {
  await teardownUnitTestsDatabase()
})

describe('PrismaUsersFollowersRepository', () => {
  it('should be able to create a follower', async () => {
    const userFollower = await prisma.user.create({
      data: {
        name: 'userfollower',
      },
    })

    const userToToFollowed = await prisma.user.create({
      data: {
        name: 'userToFollowed',
      },
    })

    const follower = Followers.create({
      followerId: new UniqueEntityID(userFollower.id),
      followedId: new UniqueEntityID(userToToFollowed.id),
    })

    await usersFollowersRepository.create(follower)

    const createdFollower = await prisma.follower.findUnique({
      where: { id: follower.id.toString() },
    })

    expect(createdFollower).not.toBeNull()
    expect(createdFollower?.followerId).toBe(userFollower.id)
    expect(createdFollower?.followedId).toBe(userToToFollowed.id)
  })

  it('should be able to delete a follower by user ID and follower ID', async () => {
    const userFollower = await prisma.user.create({
      data: {
        name: 'userFollowerToDelete',
      },
    })

    const userToFollow = await prisma.user.create({
      data: {
        name: 'userToBeUnfollowed',
      },
    })

    const follower = await prisma.follower.create({
      data: {
        followerId: userFollower.id,
        followedId: userToFollow.id,
      },
    })

    await usersFollowersRepository.delete(userToFollow.id, userFollower.id)

    const deletedFollower = await prisma.follower.findUnique({
      where: { id: follower.id },
    })

    expect(deletedFollower).toBeNull()
  })

  it('should fetch followers by user ID', async () => {
    const userToFollow = await prisma.user.create({
      data: {
        name: 'userToFollow1',
      },
    })

    const userToFollow2 = await prisma.user.create({
      data: {
        name: 'userToFollow2',
      },
    })

    const userFollower = await prisma.user.create({
      data: {
        name: 'follower',
      },
    })

    await prisma.follower.createMany({
      data: [
        { followerId: userFollower.id, followedId: userToFollow.id },
        { followerId: userFollower.id, followedId: userToFollow2.id },
      ],
    })

    const followers = await usersFollowersRepository.fetchByUserId(
      userFollower.id,
    )

    expect(followers.length).toBe(2)
    expect(followers[0].followedId.toString()).toBe(userToFollow.id)
    expect(followers[1].followedId.toString()).toBe(userToFollow2.id)
    expect(followers.map((f) => f.followedId.toString()).sort()).toEqual(
      [userToFollow.id, userToFollow2.id].sort(),
    )
  })
})
