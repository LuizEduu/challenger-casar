import { UsersFollowersRepository } from '@/domain/feed/application/repositories/users-followers-repository'
import { PrismaService } from '../prisma.service'
import { Followers } from '@/domain/feed/enterprise/entities/followers'
import { PrismaUserFollowerMapper } from '../mappers/prisma-user-follower-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaUsersFollowersRepository
  implements UsersFollowersRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(follower: Followers): Promise<void> {
    const data = PrismaUserFollowerMapper.toPrisma(follower)

    await this.prisma.follower.create({
      data,
    })
  }

  async delete(userId: string, followerId: string): Promise<void> {
    await this.prisma.follower.deleteMany({
      where: {
        followerId,
        followedId: userId,
      },
    })
  }

  async fetchByUserId(id: string): Promise<Followers[]> {
    const followers = await this.prisma.follower.findMany({
      where: {
        followerId: id,
      },
    })

    return followers.map(PrismaUserFollowerMapper.toDomain)
  }

  async fetchFollowedsByUserIdWithFollowedsInfo(
    userId: string,
  ): Promise<Followers[]> {
    throw new Error('unplemented method')
  }
}
