import { CommentsRepository } from '@/domain/feed/application/repositories/comments-repository'
import { Comment } from '@/domain/feed/enterprise/entities/comments'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaCommentMapper } from '../mappers/prisma-comment-mapper'

@Injectable()
export class PrismaCommentsRepository implements CommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment)

    await this.prisma.comment.create({
      data,
    })
  }
}
