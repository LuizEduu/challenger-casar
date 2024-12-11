import { PostsRepository } from '@/domain/feed/application/repositories/posts-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Post } from '@/domain/feed/enterprise/entities/posts'
import { PrismaPostMapper } from '../mappers/prisma-post-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'
import dayjs from 'dayjs'

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
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    })

    return post ? PrismaPostMapper.toDomain(post) : null
  }

  async countByOwnerIdInDay(ownerId: string): Promise<number> {
    const todayStart = dayjs().startOf('day').toDate()
    const todayEnd = dayjs().endOf('day').toDate()

    return this.prisma.post.count({
      where: {
        ownerId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    })
  }

  async countPostsByOwnerId(userId: string): Promise<number> {
    return this.prisma.post.count({
      where: {
        ownerId: userId,
      },
    })
  }

  async fetchByUsersIds(
    usersIds: string[],
    { page }: PaginationParams,
  ): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      take: 10,
      skip: (page - 1) * 10,
      where: {
        ownerId: {
          in: usersIds,
        },
      },
    })

    return posts.map(PrismaPostMapper.toDomain)
  }

  async fetchRecentsPosts({ page }: PaginationParams): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      take: 10,
      skip: (page - 1) * 10,
    })

    return posts.map(PrismaPostMapper.toDomain)
  }
}