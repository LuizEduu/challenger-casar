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
  it('should find a user by ID', async () => {
    const user = await prisma.user.create({
      data: { id: '1', name: 'JohnDoe', createdAt: new Date() },
    })

    const foundUser = await usersRepository.findById(user.id)

    expect(foundUser).not.toBeNull()
    expect(foundUser?.name).toBe('JohnDoe')
  })
})
