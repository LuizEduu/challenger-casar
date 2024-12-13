import { PaginationParams } from '@/core/repositories/pagination-params'
import { CommentsRepository } from '@/domain/feed/application/repositories/comments-repository'
import { PostsRepository } from '@/domain/feed/application/repositories/posts-repository'
import { Post } from '@/domain/feed/enterprise/entities/posts'
import dayjs from 'dayjs'

export class InMemoryPostsRepository implements PostsRepository {
  public inMemoryPosts: Post[]

  constructor(private readonly commentsRepository: CommentsRepository) {
    this.inMemoryPosts = []
  }

  async create(post: Post): Promise<void> {
    this.inMemoryPosts.push(post)

    post.comment && this.commentsRepository.create(post.comment)
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

  async findById(postId: string): Promise<Post | null> {
    const post = this.inMemoryPosts.find(
      (post) => post.id.toString() === postId,
    )

    return post ?? null
  }

  async fetchRecentsPosts({ page }: PaginationParams): Promise<Post[]> {
    return this.inMemoryPosts
      .sort((a, b) => {
        const dataA = dayjs(a.createdAt)
        const dataB = dayjs(b.createdAt)
        return dataB.isAfter(dataA) ? 1 : -1
      })
      .slice((page - 1) * 10, page * 10)
  }

  async fetchByUsersIds(
    usersIds: string[],
    { page }: PaginationParams,
  ): Promise<Post[]> {
    return this.inMemoryPosts
      .filter((post) => usersIds.includes(post.ownerId.toString()))
      .sort((a, b) => {
        const dataA = dayjs(a.createdAt)
        const dataB = dayjs(b.createdAt)
        return dataB.isAfter(dataA) ? 1 : -1
      })
      .slice((page - 1) * 10, page * 10)
  }

  async countPostsByOwnerId(userId: string): Promise<number> {
    return this.inMemoryPosts.filter(
      (post) => post.ownerId.toString() === userId,
    ).length
  }
}
