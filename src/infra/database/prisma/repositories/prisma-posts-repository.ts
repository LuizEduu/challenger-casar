import { PostsRepository } from '@/domain/feed/application/repositories/posts-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Post } from '@/domain/feed/enterprise/entities/posts'
import { PrismaPostMapper } from '../mappers/prisma-post-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'
import dayjs from 'dayjs'
import { CommentsRepository } from '@/domain/feed/application/repositories/comments-repository'

@Injectable()
export class PrismaPostsRepository implements PostsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async create(post: Post): Promise<void> {
    const data = PrismaPostMapper.toPrisma(post)

    await this.prisma.post.create({
      data,
    })

    post.comment && (await this.commentsRepository.create(post.comment))
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

  async fetchByUsersIds(
    usersIds: string[],
    { page }: PaginationParams,
  ): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
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
        createdAt: 'desc',
      },
      take: 10,
      skip: (page - 1) * 10,
    })

    return posts.map(PrismaPostMapper.toDomain)
  }

  async fetchByOnwerId(
    userId: string,
    { page }: PaginationParams,
  ): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      skip: (page - 1) * 5,
    })

    return posts.map(PrismaPostMapper.toDomain)
  }
}
