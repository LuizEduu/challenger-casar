import { PaginationParams } from '@/core/repositories/pagination-params'
import { Post } from '../../enterprise/entities/posts'

export abstract class PostsRepository {
  abstract create(post: Post): Promise<void>
  abstract countByOwnerIdInDay(ownerId: string): Promise<number>
  abstract findById(postId: string): Promise<Post | null>
  abstract fetchRecentsPosts({ page }: PaginationParams): Promise<Post[]>
  abstract fetchByUsersIds(
    usersIds: string[],
    { page }: PaginationParams,
  ): Promise<Post[]>

  abstract countPostsByOwnerId(userId: string): Promise<number>
}
