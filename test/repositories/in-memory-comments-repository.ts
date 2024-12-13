import { CommentsRepository } from '@/domain/feed/application/repositories/comments-repository'
import { Comment } from '@/domain/feed/enterprise/entities/comment'

export class InMemoryCommentsRepository implements CommentsRepository {
  public comments: Comment[]

  constructor() {
    this.comments = []
  }

  async create(comment: Comment): Promise<void> {
    this.comments.push(comment)
  }
}
