import { PostsRepository } from '@/domain/feed/application/repositories/posts-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Post } from '@/domain/feed/enterprise/entities/posts'
import { PrismaPostMapper } from '../mappers/prisma-post-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaPostsRepository implements PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(post: Post): Promise<void> {
    const data = PrismaPostMapper.toPrisma(post)

    await this.prisma.post.create({
      data,
    })
  }

  async findById(postId: string): Promise<Post | null> {
    throw new Error('uneplementedMethod')
  }

  async countByOwnerIdInDay(ownerId: string): Promise<number> {
    throw new Error('uneplementedMethod')
  }

  async countPostsByOwnerId(userId: string): Promise<number> {
    throw new Error('uneplementedMethod')
  }

  async fetchByUsersIds(
    usersIds: string[],
    { page }: PaginationParams,
  ): Promise<Post[]> {
    throw new Error('uneplementedMethod')
  }

  async fetchRecentsPosts({ page }: PaginationParams): Promise<Post[]> {
    throw new Error('uneplementedMethod')
  }
}
