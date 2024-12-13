import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Followers as FollowerDomain } from '@/domain/feed/enterprise/entities/followers'
import { Prisma, Follower as PrismaFollowers } from '@prisma/client'

export class PrismaUserFollowerMapper {
  static toDomain(raw: PrismaFollowers): FollowerDomain {
    return FollowerDomain.create(
      {
        followerId: new UniqueEntityID(raw.followerId),
        followedId: new UniqueEntityID(raw.followedId),
        followedAt: raw.followedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    follower: FollowerDomain,
  ): Prisma.FollowerUncheckedCreateInput {
    return {
      id: follower.id.toString(),
      followerId: follower.followerId.toString(),
      followedId: follower.followedId.toString(),
      followedAt: follower.followedAt,
    }
  }
}
