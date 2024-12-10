import { Post } from '@/domain/feed/enterprise/entities/posts'

export class HttpPostsPresenter {
  static toHTTP(post: Post) {
    return {
      id: post.id.toString(),
      content: post.content,
      ownerId: post.ownerId,
      createdAt: post.createdAt,
    }
  }
}
