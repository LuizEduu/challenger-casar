import { Comment } from '../../enterprise/entities/comment'

export abstract class CommentsRepository {
  abstract create(comment: Comment): Promise<void>
}
