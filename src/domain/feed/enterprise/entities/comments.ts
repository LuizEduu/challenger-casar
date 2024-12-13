import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface CommentProps {
  content: string
  postId: UniqueEntityID
  ownerId: UniqueEntityID
  createdAt: Date | string
}

export class Comment extends Entity<CommentProps> {
  get content() {
    return this.props.content
  }

  get postId() {
    return this.props.postId
  }

  get ownerId() {
    return this.props.ownerId
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<CommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Comment {
    const comment = new Comment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return comment
  }

  validate(): {
    hasError: boolean
    error: string
  } {
    if (this.props.content.length > 200) {
      return {
        hasError: true,
        error: 'comment content not must be grater 200 characters',
      }
    }

    return {
      hasError: false,
      error: '',
    }
  }
}
