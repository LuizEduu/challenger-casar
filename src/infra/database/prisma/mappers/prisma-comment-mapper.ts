import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Comment as CommentDomain } from '@/domain/feed/enterprise/entities/comment'
import { Prisma, Comment as PrismaComment } from '@prisma/client'

export class PrismaCommentMapper {
  static toDomain(raw: PrismaComment): CommentDomain {
    return CommentDomain.create(
      {
        content: raw.content,
        ownerId: new UniqueEntityID(raw.ownerId),
        postId: new UniqueEntityID(raw.postId),
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(comment: CommentDomain): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      content: comment.content,
      ownerId: comment.ownerId?.toString(),
      postId: comment.postId.toString(),
    }
  }
}
