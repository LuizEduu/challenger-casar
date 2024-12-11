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
    throw new Error('uneplement method')
  }
}
