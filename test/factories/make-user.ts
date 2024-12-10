import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/feed/enterprise/entities/users'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

/**
 * @type {object}
 * @property {string} name - nome do usuário.
 * @property {Date} createdAt - data de criação.
 *
 * @type {UniqueEntityID} id - criar o user com id especifíco.
 *
 * @returns {User}
 */
export function makeUser(
  override: Partial<User> = {},
  id?: UniqueEntityID,
): User {
  return User.create(
    {
      name: faker.person.firstName(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class UserFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const student = makeUser(data)

    await this.prismaService.user.create({
      data: PrismaUserMapper.toPrisma(student),
    })

    return student
  }
}
