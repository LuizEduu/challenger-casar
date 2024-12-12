import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User as UserDomain } from '@/domain/feed/enterprise/entities/users'
import { UserWithFollowersAndPosts } from '@/domain/feed/enterprise/entities/value-objects/user-with-followers-and-posts'
import { Prisma, User as PrismaUser } from '@prisma/client'

type toDomainUserWithFollowersAndPosts = {
  followeds: {
    name: string
    id: string
    createdAt: Date
  }[]
  followers: {
    name: string
    id: string
    createdAt: Date
  }[]
  followedsCount: number
  followersCount: number
  postsCount: number
  name: string
  createdAt: Date
}

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

  static toDomainUserWithFollowersAndPosts(
    raw: toDomainUserWithFollowersAndPosts,
  ): UserWithFollowersAndPosts {
    return UserWithFollowersAndPosts.create({
      name: raw.name,
      ingressedAt: raw.createdAt,
      numberOfFollowers: raw.followersCount,
      numberOfFolloweds: raw.followedsCount,
      numberOfPosts: raw.postsCount,
      followedUsers: raw.followeds.map((f) => ({
        userId: new UniqueEntityID(f.id),
        name: f.name,
      })),
    })
  }
}
