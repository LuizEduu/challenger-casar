import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Followers,
  FollowersProps,
} from '@/domain/feed/enterprise/entities/followers'
import { PrismaUserFollowerMapper } from '@/infra/database/prisma/mappers/prisma-user-follower-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

/**
 * @type {object}
 * @property {UniqueEntityID} followerId - id do usuário que está seguindo.
 * @property {UniqueEntityID} followedId - id do usuário que foi seguido.
 * @property {Date} createdAt - data de criação.
 *
 * @type {UniqueEntityID} id - criar o follower com id específico.
 *
 * @returns {Followers}
 */
export function makeFollower(
  override: Partial<Followers> = {},
  id?: UniqueEntityID,
): Followers {
  const follower = Followers.create(
    {
      followerId: override.followerId ?? new UniqueEntityID(),
      followedId: override.followedId ?? new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return follower
}

@Injectable()
export class FollowersFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaFollowers(
    data: Partial<FollowersProps> = {},
  ): Promise<Followers> {
    const follower = makeFollower(data)

    await this.prismaService.follower.create({
      data: PrismaUserFollowerMapper.toPrisma(follower),
    })

    return follower
  }
}
