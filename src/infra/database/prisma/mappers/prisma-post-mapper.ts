import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Post as PostDomain } from '@/domain/feed/enterprise/entities/posts'
import { Prisma, Post as PrismaPost } from '@prisma/client'

export class PrismaPostMapper {
  static toDomain(raw: PrismaPost): PostDomain {
    return PostDomain.create(
      {
        content: raw.content,
        ownerId: new UniqueEntityID(raw.ownerId),
        originalPostId: raw.originalPostId
          ? new UniqueEntityID(raw.originalPostId)
          : null,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(post: PostDomain): Prisma.PostUncheckedCreateInput {
    return {
      id: post.id.toString(),
      content: post.content,
      ownerId: post.ownerId.toString(),
      originalPostId: post.originalPostId?.toString() ?? null,
    }
  }
}
