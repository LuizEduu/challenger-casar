import { Comment } from '../../enterprise/entities/comments'

export abstract class CommentsRepository {
  abstract create(comment: Comment): Promise<void>
}
