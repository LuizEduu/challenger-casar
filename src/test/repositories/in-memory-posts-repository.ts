import { PostsRepository } from '@/domain/feed/application/repositories/posts-repository'
import { Post } from '@/domain/feed/enterprise/entities/posts'
import dayjs from 'dayjs'

export class InMemoryPostsRepository implements PostsRepository {
  public inMemoryPosts: Post[] = []

  async create(post: Post): Promise<Post> {
    this.inMemoryPosts.push(post)

    return post
  }

  async countByOwnerIdInDay(ownerId: string): Promise<number> {
    const today = dayjs().startOf('day')
    const todayPosts = this.inMemoryPosts.filter(
      (post) =>
        dayjs(post.createdAt).isSame(today, 'day') &&
        post.ownerId.toString() === ownerId,
    )

    return todayPosts.length
  }
}
