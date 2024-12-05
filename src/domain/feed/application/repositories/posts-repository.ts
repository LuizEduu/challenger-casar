import { Post } from '../../enterprise/entities/posts'

export abstract class PostsRepository {
  abstract create(post: Post): Promise<Post>
  abstract countByOwnerIdInDay(ownerId: string): Promise<number>
  abstract findById(postId: string): Promise<Post | null>
}
