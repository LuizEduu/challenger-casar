import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User as UserDomain } from '@/domain/feed/enterprise/entities/users'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): UserDomain {
    return UserDomain.create(
      {
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(student: UserDomain): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
    }
  }
}
