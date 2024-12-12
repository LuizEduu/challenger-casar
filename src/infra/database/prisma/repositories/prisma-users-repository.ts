import { UsersRepository } from '@/domain/feed/application/repositories/users-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { User } from '@/domain/feed/enterprise/entities/users'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { UserWithFollowersAndPosts } from '@/domain/feed/enterprise/entities/value-objects/user-with-followers-and-posts'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    })

    return user ? PrismaUserMapper.toDomain(user) : null
  }

  async findByIdUserWithFollowersAndPosts(
    userId: string,
  ): Promise<UserWithFollowersAndPosts | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        createdAt: true,
      },
    })

    if (!user) {
      return null
    }

    const followeds = await this.prisma.followers.findMany({
      where: {
        followerId: userId,
      },
      include: {
        followed: true,
      },
    })

    const followers = await this.prisma.followers.findMany({
      where: {
        followedId: userId,
      },
      include: {
        follower: true,
      },
    })

    const [followedsCount, followersCount, postsCount] = await Promise.all([
      this.prisma.followers.count({ where: { followerId: userId } }),
      this.prisma.followers.count({ where: { followedId: userId } }),
      this.prisma.post.count({ where: { ownerId: userId } }),
    ])

    const userWithFollowersAndFollowedsAndCounts = {
      ...user,
      followeds: followeds.map((f) => f.followed),
      followers: followers.map((f) => f.follower),
      followedsCount,
      followersCount,
      postsCount,
    }

    return PrismaUserMapper.toDomainUserWithFollowersAndPosts(
      userWithFollowersAndFollowedsAndCounts,
    )
  }
}
