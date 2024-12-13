import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Comment,
  CommentProps,
} from '@/domain/feed/enterprise/entities/comments'
import { faker } from '@faker-js/faker'
import { PrismaCommentMapper } from '@/infra/database/prisma/mappers/prisma-comment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

/**
 * @type {object}
 * @property {string} content - contéudo do comentário
 * @property {UniqueEntityID} ownerId - id do autor do comentário.
 * @property {UniqueEntityID} postId - id do post que foi feito o comentário.
 * @property {Date} createdAt - data de criação.
 *
 * @type {UniqueEntityID} id - criar o follower com id específico.
 *
 * @returns {Comment}
 */
export function makeComment(
  override: Partial<Comment> = {},
  id?: UniqueEntityID,
): Comment {
  const follower = Comment.create(
    {
      content: faker.lorem.sentence(),
      ownerId: override.ownerId ?? new UniqueEntityID(),
      postId: override.postId ?? new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return follower
}

@Injectable()
export class CommentFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaComment(data: Partial<CommentProps> = {}): Promise<Comment> {
    const follower = makeComment(data)

    await this.prismaService.comment.create({
      data: PrismaCommentMapper.toPrisma(follower),
    })

    return follower
  }
}
